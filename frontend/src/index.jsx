import { useState, useEffect } from "react";
import { Container, Navbar, Button } from "react-bootstrap";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ManagePollPage from "./pages/ManagePollPage";
import VotePage from "./pages/VotePage";
import HelpPage from "./pages/HelpPage";
import Footer from "./components/Footer";

export default function IndexPage() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("login");
  const [pageParam, setPageParam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          setUser(data);
          // if url is poll/:id/manage or poll/:id/vote, directly navigate there instead of home
          const match = window.location.pathname.match(
            /^\/poll\/([^/]+)\/vote$/,
          );
          if (match) {
            setPage("vote");
            setPageParam(match[1]);
          } else {
            setPage("home");
          }
        }
        setLoading(false);
      });
  }, []);

  function navigate(pg, param = null) {
    setPage(pg);
    setPageParam(param);
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setPage("login");
  }

  if (loading) return <Container className="p-4">Loading...</Container>;

  return (
    <div className="d-flex flex-column min-vh-100">
      {user && (
        <Navbar bg="dark" variant="dark" className="px-3 mb-3">
          <Navbar.Brand>QuickPik</Navbar.Brand>
          <Navbar.Text className="ms-auto me-3">
            Hi, {user.first_name}
          </Navbar.Text>
          <Button
            className="me-2"
            variant="outline-light"
            size="md"
            onClick={() => navigate("home")}
          >
            Home
          </Button>
          <Button
            className="me-2"
            variant="outline-light"
            size="md"
            onClick={() => navigate("help")}
          >
            Help
          </Button>
          <Button variant="outline-light" size="md" onClick={handleLogout}>
            Logout
          </Button>
        </Navbar>
      )}

      <div className="flex-grow-1">
        {page === "login" && (
          <LoginPage
            onLogin={(u) => {
              setUser(u);
              setPage("home");
            }}
          />
        )}
        {page === "home" && <HomePage navigate={navigate} user={user} />}
        {page === "manage" && (
          <ManagePollPage pollId={pageParam} navigate={navigate} user={user} />
        )}
        {page === "vote" && (
          <VotePage pollId={pageParam} navigate={navigate} user={user} />
        )}
        {page === "help" && <HelpPage navigate={navigate} />}
      </div>

      {user && <Footer />}
    </div>
  );
}
