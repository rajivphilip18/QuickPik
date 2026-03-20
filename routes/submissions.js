import express from "express";
import { getCollection } from "../db/dbConnection.js";
import { ObjectId } from "mongodb";

const router = express.Router();

function requireAuth(req, res, next) {
  if (!req.session.user)
    return res.status(401).json({ error: "Not logged in" });
  next();
}

router.post("/", requireAuth, async (req, res) => {
  const { poll_id, selected_cells } = req.body;
  if (!poll_id || !selected_cells)
    return res
      .status(400)
      .json({ error: "poll_id and selected_cells required" });
  try {
    const polls = await getCollection("polls");
    const poll = await polls.findOne({ _id: new ObjectId(poll_id) });
    if (!poll) return res.status(404).json({ error: "Poll not found" });
    if (poll.status === "closed")
      return res.status(400).json({ error: "Poll is closed" });
    const submissions = await getCollection("submissions");
    await submissions.updateOne(
      { poll_id, user_id: req.session.user.id },
      {
        $set: { selected_cells, updated_at: new Date() },
        $setOnInsert: { submitted_at: new Date() },
      },
      { upsert: true },
    );
    res.json({ message: "Submission saved" });
  } catch (err) {
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

router.get("/mine/:poll_id", requireAuth, async (req, res) => {
  try {
    const submissions = await getCollection("submissions");
    const sub = await submissions.findOne({
      poll_id: req.params.poll_id,
      user_id: req.session.user.id,
    });
    res.json(sub || null);
  } catch (err) {
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

router.get("/aggregate/:poll_id", requireAuth, async (req, res) => {
  try {
    const polls = await getCollection("polls");
    const poll = await polls.findOne({ _id: new ObjectId(req.params.poll_id) });
    if (!poll) return res.status(404).json({ error: "Poll not found" });
    if (poll.creator_id !== req.session.user.id)
      return res.status(403).json({ error: "Not your poll" });
    const submissions = await getCollection("submissions");
    const allSubs = await submissions
      .find({ poll_id: req.params.poll_id })
      .toArray();
    const matrix = Array.from({ length: poll.rows.length }, () =>
      Array(poll.columns.length).fill(0),
    );
    for (const sub of allSubs) {
      for (let r = 0; r < poll.rows.length; r++)
        for (let c = 0; c < poll.columns.length; c++)
          if (sub.selected_cells?.[r]?.[c]) matrix[r][c]++;
    }
    res.json({ matrix, total: allSubs.length });
  } catch (err) {
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

router.delete("/:poll_id", requireAuth, async (req, res) => {
  try {
    const submissions = await getCollection("submissions");
    await submissions.deleteOne({
      poll_id: req.params.poll_id,
      user_id: req.session.user.id,
    });
    res.json({ message: "Submission removed" });
  } catch (err) {
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

export default router;
