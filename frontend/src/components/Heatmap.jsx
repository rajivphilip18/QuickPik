import Table from "react-bootstrap/Table";

export default function Heatmap({ rows, columns, matrix, total }) {
  const max = Math.max(...matrix.flat(), 1);

  function cellColor(count) {
    if (count === 0) return "#ebedf0";
    const intensity = count / max;
    if (intensity < 0.25) return "#9be9a8";
    if (intensity < 0.5) return "#45c968";
    if (intensity < 0.75) return "#309f4e";
    return "#038b2e";
  }

  return (
    <>
      <p className="text-muted mb-2">
        Total responses: <strong>{total}</strong>
      </p>
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
                <td key={c} style={{ background: cellColor(matrix[r][c]) }}>
                  <span
                    style={{
                      color: matrix[r][c] / max > 0.5 ? "#fff" : "#000",
                    }}
                  >
                    {matrix[r][c]}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
