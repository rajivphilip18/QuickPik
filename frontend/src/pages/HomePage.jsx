import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  ListGroup,
  Badge,
} from "react-bootstrap";
import PollForm from "../components/PollForm.jsx";

export default function HomePage({ navigate }) {
  const [joinId, setJoinId] = useState("");
  const [myPolls, setMyPolls] = useState([]);
  const [showPolls, setShowPolls] = useState(false);
  const [joinError, setJoinError] = useState("");

  async function loadMyPolls() {
    const res = await fetch("/api/polls/mine");
    const data = await res.json();
    setMyPolls(data);
    setShowPolls(true);
  }

  async function handleCreatePoll(pollData) {
    const res = await fetch("/api/polls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pollData),
    });
    const data = await res.json();
    if (res.ok) navigate("manage", data.poll_id);
  }

  async function handleJoin() {
    setJoinError("");
    const id = joinId.trim();
    if (!id) return setJoinError("Please enter a Poll ID");
    const res = await fetch(`/api/polls/${id}`);
    if (!res.ok)
      return setJoinError("Poll not found. Check the ID and try again.");
    navigate("vote", id);
  }

  async function deletePoll(id) {
    if (!confirm("Delete this poll and all its responses?")) return;
    await fetch(`/api/polls/${id}`, { method: "DELETE" });
    setMyPolls(myPolls.filter((p) => p._id !== id));
  }

  return (
    <Container className="py-2">
      <Row className="g-4">
        <Col md={6}>
          <Card className="p-2 h-80 bg-transparent">
            <h5 className="mb-3">Create a Poll</h5>
            <PollForm onSubmit={handleCreatePoll} />
          </Card>
        </Col>

        <Col md={6}>
          <Card className="p-4 h-80 bg-transparent">
            <h5 className="mb-3">Participate in a Poll</h5>
            <p className="text-muted">Enter the Poll ID shared with you:</p>
            <Form.Control
              className="mb-2"
              value={joinId}
              onChange={(e) => setJoinId(e.target.value)}
              placeholder="Paste Poll ID here"
            />
            {joinError && (
              <Alert variant="danger" className="py-2 mb-2">
                {joinError}
              </Alert>
            )}
            <Button variant="success" className="w-100" onClick={handleJoin}>
              Join Poll
            </Button>
          </Card>
        </Col>
      </Row>

      <Row className="mt-2">
        <Col className="text-center">
          <Button variant="outline-primary" onClick={loadMyPolls}>
            {showPolls ? "Refresh My Polls" : "View My Created Polls"}
          </Button>
        </Col>
      </Row>

      {showPolls && (
        <Row className="mt-3">
          <Col>
            <h5>My Polls</h5>
            {myPolls.length === 0 ? (
              <p className="text-muted">You haven't created any polls yet.</p>
            ) : (
              <ListGroup>
                {myPolls.map((p) => (
                  <ListGroup.Item className="bg-light" key={p._id}>
                    <Row className="align-items-center">
                      <Col>
                        <strong>{p.title}</strong>
                        <Badge
                          bg={p.status === "open" ? "success" : "secondary"}
                          className="ms-2"
                        >
                          {p.status}
                        </Badge>
                        <div className="text-muted small">ID: {p._id}</div>
                      </Col>
                      <Col xs="auto">
                        <Row className="g-2">
                          <Col xs="auto">
                            <Button
                              size="sm"
                              variant="outline-primary"
                              onClick={() => navigate("manage", p._id)}
                            >
                              View
                            </Button>
                          </Col>
                          <Col xs="auto">
                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() => deletePoll(p._id)}
                            >
                              Delete
                            </Button>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Col>
        </Row>
      )}
    </Container>
  );
}
