import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Alert,
} from "react-bootstrap";
import Heatmap from "../components/Heatmap";

export default function ManagePollPage({ pollId, navigate }) {
  const [poll, setPoll] = useState(null);
  const [heatmapData, setHeatmapData] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/polls/${pollId}`)
      .then((r) => r.json())
      .then(setPoll);
    fetch(`/api/submissions/aggregate/${pollId}`)
      .then((r) => r.json())
      .then(setHeatmapData);
  }, [pollId]);

  async function closePoll() {
    if (!confirm("Close this poll? No more votes will be accepted.")) return;
    await fetch(`/api/polls/${pollId}/close`, { method: "PATCH" });
    setPoll((prev) => ({ ...prev, status: "closed" }));
  }

  function copyLink() {
    const url = `${window.location.origin}/poll/${pollId}/vote`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function getTopCells() {
    if (!heatmapData || !poll) return [];
    const { matrix } = heatmapData;
    const max = Math.max(...matrix.flat());
    if (max === 0) return [];

    const results = [];
    for (let r = 0; r < poll.rows.length; r++) {
      for (let c = 0; c < poll.columns.length; c++) {
        if (matrix[r][c] === max) {
          results.push({ row: poll.rows[r], col: poll.columns[c], count: max });
          if (results.length === 2) return results;
        }
      }
    }
    return results;
  }

  if (!poll) return <Container className="p-4">Loading...</Container>;

  return (
    <Container className="py-4">
      <div className="mb-4">
        <Button
          variant="link"
          className="ps-0 mb-3 text-decoration-none"
          onClick={() => navigate("home")}
        >
          ← Back to Home
        </Button>

        <div className="d-flex align-items-center gap-3 mb-3">
          <h2 className="mb-0 fw-bold">{poll.title}</h2>
          <Badge bg={poll.status === "open" ? "success" : "secondary"} className="fs-6">
            {poll.status}
          </Badge>
        </div>

        {poll.description && <p className="text-muted">{poll.description}</p>}
      </div>

      <Card className="p-3 mb-4 bg-light">
        <Row className="align-items-center g-2">
          <Col xs="auto">
            <span className="text-muted fw-500">Share this Poll:</span>
          </Col>
          <Col>
            <code className="text-primary-emphasis">{`${window.location.origin}/poll/${pollId}/vote`}</code>
          </Col>
          <Col xs="auto">
            <Button variant="dark" size="sm" onClick={copyLink}>
              {copied ? "Copied!" : "Copy"}
            </Button>
          </Col>
        </Row>
      </Card>

      {poll.status === "open" && (
        <Button variant="warning" className="mb-4 fw-600" onClick={closePoll}>
          Close Poll
        </Button>
      )}

      {heatmapData && getTopCells().length > 0 && (
        <div className="mb-4">
          <h5 className="fw-bold mb-3">
            Top Choice{getTopCells().length > 1 ? "s" : ""}
          </h5>
          <Row className="g-3">
            {getTopCells().map((cell, i) => (
              <Col xs="auto" key={i}>
                <Card className="px-4 py-3 text-center border-success border-2 shadow-sm">
                  <div className="fw-semibold fs-6">
                    {cell.row} × {cell.col}
                  </div>
                  <div className="text-muted small mt-1">
                    {cell.count} vote{cell.count !== 1 ? "s" : ""}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}

      <div>
        <h4 className="fw-bold mb-3">Results Heatmap</h4>
        {heatmapData ? (
          <Heatmap
            rows={poll.rows}
            columns={poll.columns}
            matrix={heatmapData.matrix}
            total={heatmapData.total}
          />
        ) : (
          <p className="text-muted">Loading results...</p>
        )}
      </div>
    </Container>
  );
}

ManagePollPage.propTypes = {
  pollId: PropTypes.string.isRequired,
  navigate: PropTypes.func.isRequired,
};
