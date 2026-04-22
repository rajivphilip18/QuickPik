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

export default function SignupPage({ onSignup }) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  function updateFirstName(val) {
    setForm({
      first_name: val,
      last_name: form.last_name,
      username: form.username,
      password: form.password,
    });
  }

  function updateLastName(val) {
    setForm({
      first_name: form.first_name,
      last_name: val,
      username: form.username,
      password: form.password,
    });
  }

  function updateUsername(val) {
    setForm({
      first_name: form.first_name,
      last_name: form.last_name,
      username: val,
      password: form.password,
    });
  }

  function updatePassword(val) {
    setForm({
      first_name: form.first_name,
      last_name: form.last_name,
      username: form.username,
      password: val,
    });
  }

  async function handleSignup() {
    setError("");
    if (!form.first_name || !form.last_name || !form.username || !form.password)
      return setError("All fields are required");
    if (form.password.length < 4)
      return setError("Password must be at least 4 characters");

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        username: form.username.trim(),
        password: form.password,
      }),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error);
    onSignup(data.user);
  }

  return (
    <Container style={{ minHeight: "100vh" }} className="d-flex align-items-center">
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={8} md={5} lg={4}>
          <Card className="p-4 shadow-sm custom-card">
            <h4 className="mb-4 text-center">Create an Account</h4>
            {error && (
              <Alert variant="danger" className="py-3 mb-4">
                {error}
              </Alert>
            )}

            <Row className="g-3 mb-4">
              <Col>
                <Form.Label for="first_name" className="fw-500">First Name</Form.Label>
                <Form.Control
                  id="first_name"
                  value={form.first_name}
                  onChange={(e) => updateFirstName(e.target.value)}
                  placeholder="First name"
                />
              </Col>
              <Col>
                <Form.Label for="last_name" className="fw-500">Last Name</Form.Label>
                <Form.Control
                  id="last_name"
                  value={form.last_name}
                  onChange={(e) => updateLastName(e.target.value)}
                  placeholder="Last name"
                />
              </Col>
            </Row>

            <Form.Group className="mb-4">
              <Form.Label for="username" className="fw-500">
                Username
              </Form.Label>
              <Form.Control
                id="username"
                value={form.username}
                onChange={(e) => updateUsername(e.target.value)}
                placeholder="Choose a username"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label for="password" className="fw-500">
                Password
              </Form.Label>
              <Form.Control
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => updatePassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                placeholder="At least 4 characters"
              />
            </Form.Group>

            <Button
              variant="primary"
              className="w-100 py-2 fw-600 mb-3"
              size="lg"
              onClick={handleSignup}
            >
              Sign Up
            </Button>
            <Button
              variant="primary"
              className="w-100"
              onClick={() => onSignup(null)}
            >Log in
            </Button>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

SignupPage.propTypes = {
  onSignup: PropTypes.func.isRequired,
};
