import { Container, Row, Col, Card } from "react-bootstrap";

export default function HelpPage() {
  return (
    <Container>
      <h5>How to Use QuickPik</h5>
      <p className="text-muted">
        QuickPik helps groups reach consensus fast using a matrix-based poll and
        a heatmap visualization. Any logged-in user can both{" "}
        <strong>create</strong> a poll and <strong>participate</strong> in one —
        there is no separate role. Simply use the left side of the home page to
        create, and the right side to join.
      </p>

      <Row className="g-4">
        <Col md={6}>
          <Card className="h-80">
            <Card.Header className="bg-primary text-white">
              <strong>For Poll Creators</strong>
            </Card.Header>
            <Card.Body>
              <ol className="mb-0">
                <li className="mb-2">
                  From the <strong>Home</strong> page, fill in a{" "}
                  <strong>Poll Name</strong> and an optional description on the
                  left side.
                </li>
                <li className="mb-2">
                  Click <strong>+ Add Row</strong> to add row labels (e.g.
                  cuisines, tasks, activities). Each row represents one option.
                </li>
                <li className="mb-2">
                  Click <strong>+ Add Column</strong> to add column labels (e.g.
                  times, priority levels, days).
                </li>
                <li className="mb-2">
                  Click <strong>Create Poll</strong>. You will be taken to the
                  <strong> Poll Management</strong> page automatically.
                </li>
                <li className="mb-2">
                  On the Poll Management page, copy the{" "}
                  <strong>shareable URL</strong> and send it to your
                  participants via any messaging app or email.
                </li>
                <li className="mb-2">
                  Watch the <strong>heatmap</strong> update as responses come
                  in. Darker cells indicate stronger group agreement.
                </li>
                <li className="mb-2">
                  Once you have enough responses, click{" "}
                  <strong>Close Poll</strong> to stop accepting new votes. The
                  heatmap remains visible.
                </li>
                <li>
                  To remove a poll entirely, go to{" "}
                  <strong>View My Created Polls</strong> on the Home page and
                  click <strong>Delete</strong> next to it.
                </li>
              </ol>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="h-80">
            <Card.Header className="bg-success text-white">
              <strong>For Participants</strong>
            </Card.Header>
            <Card.Body>
              <ol className="mb-0">
                <li className="mb-2">
                  Receive a poll link from the creator. It will look like:
                  <br />
                  <code>http://&lt;host&gt;/poll/&lt;id&gt;/vote</code>
                </li>
                <li className="mb-2">
                  Open the link in your browser. If you are not logged in, you
                  will be redirected to the <strong>Login</strong> page first.
                </li>
                <li className="mb-2">
                  Alternatively, from the <strong>Home</strong> page, paste the
                  Poll ID into the <strong>Participate in a Poll</strong> box on
                  the right and click <strong>Join Poll</strong>.
                </li>
                <li className="mb-2">
                  On the voting page you will see a <strong>matrix grid</strong>
                  . Each row is an option and each column is a category (e.g.
                  time slot, priority).
                </li>
                <li className="mb-2">
                  Click any cell to <strong>check or uncheck</strong> it. Select
                  all combinations that are acceptable or preferred to you —
                  there is no limit.
                </li>
                <li className="mb-2">
                  Click <strong>Submit Response</strong> when done. Your vote is
                  saved immediately.
                </li>
                <li className="mb-2">
                  Changed your mind? Come back to the same link, adjust your
                  selections, and click <strong>Update Response</strong>. Only
                  your latest response is kept.
                </li>
                <li>
                  Once the creator closes the poll, the grid becomes{" "}
                  <strong>read-only</strong>. You can still view your submitted
                  response but can no longer edit it.
                </li>
              </ol>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
