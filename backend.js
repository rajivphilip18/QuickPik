import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import authRouter from "./routes/auth.js";
import pollsRouter from "./routes/polls.js";
import submissionsRouter from "./routes/submissions.js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("./frontend/dist"));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "quickpik_secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      dbName: "quickpik",
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  }),
);

app.use("/api/auth", authRouter);
app.use("/api/polls", pollsRouter);
app.use("/api/submissions", submissionsRouter);

// Catch-all route: serves up the index.html (React app) for any non-API GET request (lets the route to be handled by React Router)
// Catch-all route: The (.*) syntax is the new way to say "match everything"
app.get("/{*path}", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
