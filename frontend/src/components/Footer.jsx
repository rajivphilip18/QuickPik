import PropTypes from 'prop-types';

function Footer() {
  return (
    <footer className="bg-dark text-light text-center py-3 mt-1">
      <small>
        © {new Date().getFullYear()} QuickPik — Fast group decisions,
        simplified.
      </small>
    </footer>
  );
}

Footer.propTypes = {};

export default Footer;
