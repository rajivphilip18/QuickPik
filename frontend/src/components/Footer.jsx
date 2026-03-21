export default function Footer() {
  return (
    <footer className="bg-dark text-secondary text-center py-3 mt-1">
      <small>
        © {new Date().getFullYear()} QuickPik — Fast group decisions,
        simplified.
      </small>
    </footer>
  );
}
