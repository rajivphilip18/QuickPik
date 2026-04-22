import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import IndexPage from "./index.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <IndexPage />
  </StrictMode>,
);
