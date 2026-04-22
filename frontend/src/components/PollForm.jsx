import { useState } from "react";
import { Form, Button, Row, Col, Alert } from "react-bootstrap";
import PropTypes from 'prop-types';
import "../pages/css/PollForm.css";

function PollForm({ onSubmit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rows, setRows] = useState([""]);
  const [columns, setColumns] = useState([""]);
  const [error, setError] = useState("");

  function addRow() {
    setRows([...rows, ""]);
  }
  function addColumn() {
    setColumns([...columns, ""]);
  }
  function updateRow(i, val) {
    const r = [...rows];
    r[i] = val;
    setRows(r);
  }
  function updateColumn(i, val) {
    const c = [...columns];
    c[i] = val;
    setColumns(c);
  }
  function removeRow(i) {
    setRows(rows.filter((_, idx) => idx !== i));
  }
  function removeColumn(i) {
    setColumns(columns.filter((_, idx) => idx !== i));
  }

  function handleSubmit() {
    const cleanRows = rows.map((r) => r.trim()).filter(Boolean);
    const cleanCols = columns.map((c) => c.trim()).filter(Boolean);
    if (!title.trim()) return setError("Poll title is required");
    if (cleanRows.length === 0) return setError("Add at least one row");
    if (cleanCols.length === 0) return setError("Add at least one column");
    setError("");
    onSubmit({
      title: title.trim(),
      description,
      rows: cleanRows,
      columns: cleanCols,
    });
  }

  return (
    <>
      {error && (
        <Alert variant="danger" className="py-2">
          {error}
        </Alert>
      )}

      <Form.Group className="mb-4">
        <Form.Label className="fw-bold">Poll Name</Form.Label>
        <Form.Control
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Where should we eat?"
        />
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label for="description">Description (optional)</Form.Label>
        <Form.Control
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional: Add context for voters"
        />
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label className="fw-bold">Rows</Form.Label>
        {rows.map((row, i) => (
          <Row key={i} className="g-2 mb-3">
            <Col>
              <Form.Control
                value={row}
                onChange={(e) => updateRow(i, e.target.value)}
                placeholder={`Row ${i + 1}`}
              />
            </Col>
            {rows.length > 1 && (
              <Col xs="auto">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => removeRow(i)}
                >
                  ✕
                </Button>
              </Col>
            )}
          </Row>
        ))}
        <Button variant="secondary" size="sm" onClick={addRow}>
          + Add Row
        </Button>
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label className="fw-bold">Columns</Form.Label>
        {columns.map((col, i) => (
          <Row key={i} className="g-2 mb-3">
            <Col>
              <Form.Control
                value={col}
                onChange={(e) => updateColumn(i, e.target.value)}
                placeholder={`Column ${i + 1}`}
              />
            </Col>
            {columns.length > 1 && (
              <Col xs="auto">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => removeColumn(i)}
                >
                  ✕
                </Button>
              </Col>
            )}
          </Row>
        ))}
        <Button variant="secondary" size="sm" onClick={addColumn}>
          + Add Column
        </Button>
      </Form.Group>

      <Button variant="primary" className="w-100 py-2 fw-600" size="lg" onClick={handleSubmit}>
        Create Poll
      </Button>
    </>
  );
}

PollForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default PollForm;
