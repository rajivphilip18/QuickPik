import express from "express";
import { getCollection } from "../db/dbConnection.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// Middleware - check if user is logged in, otherwise return 401 error
function requireAuth(req, res, next) {
  if (!req.session.user)
    return res.status(401).json({ error: "Not logged in" });
  next();
}

// POST - /api/polls  – create poll
router.post("/", requireAuth, async (req, res) => {
  const { title, description, rows, columns } = req.body;
  if (!title || !rows?.length || !columns?.length)
    return res
      .status(400)
      .json({ error: "Title, rows and columns are required" });

  try {
    const polls = await getCollection("polls");
    const result = await polls.insertOne({
      title,
      description: description || "",
      rows,
      columns,
      creator_id: req.session.user.id,
      status: "open",
      created_at: new Date(),
    });
    res.json({ poll_id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

// GET - /api/polls/mine - list polls created by logged in user
router.get("/mine", requireAuth, async (req, res) => {
  try {
    const polls = await getCollection("polls");
    const myPolls = await polls
      .find({ creator_id: req.session.user.id })
      .sort({ created_at: -1 })
      .toArray();
    res.json(myPolls);
  } catch (err) {
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

// GET - /api/polls/:id  – get a single poll by id
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const polls = await getCollection("polls");
    const poll = await polls.findOne({ _id: new ObjectId(req.params.id) });
    if (!poll) return res.status(404).json({ error: "Poll not found" });
    res.json(poll);
  } catch (err) {
    res.status(500).json({ error: err.message || "Invalid poll ID" });
  }
});

// PATCH - /api/polls/:id/close – creator can close poll they created to prevent further submissions
router.patch("/:id/close", requireAuth, async (req, res) => {
  try {
    const polls = await getCollection("polls");
    const poll = await polls.findOne({ _id: new ObjectId(req.params.id) });
    if (!poll) return res.status(404).json({ error: "Poll not found" });
    if (poll.creator_id !== req.session.user.id)
      return res.status(403).json({ error: "Not user's poll to close" });

    await polls.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status: "closed" } },
    );
    res.json({ message: "Poll closed" });
  } catch (err) {
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

// DELETE - /api/polls/:id  – creator can delete poll they created
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const polls = await getCollection("polls");
    const submissions = await getCollection("submissions");
    const poll = await polls.findOne({ _id: new ObjectId(req.params.id) });
    if (!poll) return res.status(404).json({ error: "Poll not found" });
    if (poll.creator_id !== req.session.user.id)
      return res.status(403).json({ error: "Not user's poll to delete" });

    await polls.deleteOne({ _id: new ObjectId(req.params.id) });
    await submissions.deleteMany({ poll_id: req.params.id });
    res.json({ message: "Poll deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

export default router;
