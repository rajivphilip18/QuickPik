import { useState } from "react";
import PropTypes from 'prop-types';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import "./css/LoginPage.css";

export default function LoginPage({ onLogin, onGoSignup }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin() {
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error);
    onLogin(data.user);
  }

  return (
    <Container style={{ minHeight: "100vh" }} className="d-flex align-items-center">
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={8} md={5} lg={4}>
          <Card className="p-4 shadow-sm custom-card">
            <h4 className="mb-4 text-center">QuickPik Login</h4>
            {error && (
              <Alert variant="danger" className="py-3 mb-4">
                {error}
              </Alert>
            )}
            <Form.Group className="mb-4">
              <Form.Label className="fw-500" for="username">Username</Form.Label>
              <Form.Control
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="Enter your username"
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label className="fw-500" for="password">Password</Form.Label>
              <Form.Control
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="Enter your password"
              />
            </Form.Group>
            <Button variant="primary" className="w-100 py-2 fw-600 mb-3" size="lg" onClick={handleLogin}>
              Login
            </Button>
            <Button variant="primary" className="w-100 mt-2" onClick={onGoSignup}>
              Sign up
            </Button>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

LoginPage.propTypes = {
  onLogin: PropTypes.func.isRequired,
  onGoSignup: PropTypes.func.isRequired,
};
