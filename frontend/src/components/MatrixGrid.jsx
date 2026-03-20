import Table from "react-bootstrap/Table";

export default function MatrixGrid({
  rows,
  columns,
  cells,
  onChange,
  disabled,
}) {
  function toggle(r, c) {
    if (disabled) return;
    const updated = cells.map((row) => [...row]);
    updated[r][c] = !updated[r][c];
    onChange(updated);
  }

  return (
    <Table bordered responsive className="text-center align-middle">
      <thead className="table-dark">
        <tr>
          <th></th>
          {columns.map((col, c) => (
            <th key={c}>{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, r) => (
          <tr key={r}>
            <td className="fw-semibold text-start">{row}</td>
            {columns.map((_, c) => (
              <td
                key={c}
                onClick={() => toggle(r, c)}
                style={{
                  cursor: disabled ? "default" : "pointer",
                  background: cells[r][c] ? "#0d6efd22" : "",
                }}
              >
                <input
                  type="checkbox"
                  checked={cells[r][c]}
                  onChange={() => toggle(r, c)}
                  disabled={disabled}
                  className="form-check-input"
                  style={{ pointerEvents: "none" }}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
