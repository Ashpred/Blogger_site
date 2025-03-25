import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const Navbar = ({ isAuthenticated, logout, user }) => {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">Blog Site</Link>
        <ul>
          {isAuthenticated ? (
            <>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/create-post">New Post</Link>
              </li>
              <li>
                <span className="user-greeting">Welcome, {user?.username || 'User'}</span>
              </li>
              <li>
                <a href="#!" onClick={logout} className="logout-btn">Logout</a>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </header>
  );
};

Navbar.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
  user: PropTypes.object
};

export default Navbar; 