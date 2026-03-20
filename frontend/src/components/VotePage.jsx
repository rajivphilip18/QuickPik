import { useEffect, useState } from "react";
import { Container, Button, Alert, Badge } from "react-bootstrap";
import MatrixGrid from "../components/MatrixGrid";

export default function VotePage({ pollId, navigate }) {
  const [poll, setPoll] = useState(null);
  const [cells, setCells] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");
  const [msgVariant, setMsgVariant] = useState("success");

  useEffect(() => {
    Promise.all([
      fetch(`/api/polls/${pollId}`).then((r) => r.json()),
      fetch(`/api/submissions/mine/${pollId}`).then((r) => r.json()),
    ]).then(([pollData, existingSub]) => {
      setPoll(pollData);
      const empty = Array.from({ length: pollData.rows.length }, () =>
        Array(pollData.columns.length).fill(false),
      );
      if (existingSub?.selected_cells) {
        setCells(existingSub.selected_cells);
        setSubmitted(true);
      } else {
        setCells(empty);
      }
    });
  }, [pollId]);

  async function handleSubmit() {
    const res = await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ poll_id: pollId, selected_cells: cells }),
    });
    const data = await res.json();
    if (res.ok) {
      setSubmitted(true);
      setMsgVariant("success");
      setMessage(
        submitted ? "Your response has been updated!" : "Response submitted!",
      );
      setTimeout(() => setMessage(""), 3000);
    } else {
      setMsgVariant("danger");
      setMessage(data.error);
    }
  }

  if (!poll) return <Container className="p-4">Loading...</Container>;

  const isClosed = poll.status === "closed";

  return (
    <Container className="py-4">
      <Button
        variant="link"
        className="ps-0 mb-3"
        onClick={() => navigate("home")}
      >
        ← Back to Home
      </Button>

      <h4 className="d-inline me-2">{poll.title}</h4>
      <Badge bg={isClosed ? "secondary" : "success"} className="mb-2">
        {poll.status}
      </Badge>

      {poll.description && <p className="text-muted">{poll.description}</p>}

      {isClosed && (
        <Alert variant="secondary">
          This poll is closed. You can view your response below.
        </Alert>
      )}
      {submitted && !isClosed && (
        <Alert variant="info" className="py-2">
          You've already voted. You can update your selections and resubmit.
        </Alert>
      )}
      {message && (
        <Alert variant={msgVariant} className="py-2">
          {message}
        </Alert>
      )}

      <p className="text-muted">
        Click cells to select your preferred combinations:
      </p>
      <MatrixGrid
        rows={poll.rows}
        columns={poll.columns}
        cells={cells}
        onChange={setCells}
        disabled={isClosed}
      />

      {!isClosed && (
        <Button variant="primary" className="mt-2" onClick={handleSubmit}>
          {submitted ? "Update Response" : "Submit Response"}
        </Button>
      )}
    </Container>
  );
}
