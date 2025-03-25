import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const Home = ({ isAuthenticated, user }) => {
  return (
    <section className="home-page">
      <div className="home-content">
        {isAuthenticated ? (
          <div className="user-welcome">
            <h1>Welcome to Blog Site, {user?.username || 'User'}!</h1>
            <p>Start creating and sharing your blog posts with the world.</p>
            <div className="home-buttons">
              <Link to="/create-post" className="btn">Create New Post</Link>
              <Link to="/my-posts" className="btn">My Posts</Link>
            </div>
          </div>
        ) : (
          <>
            <h1>Welcome to Blog Site</h1>
            <p>A place to share your thoughts and ideas with the world.</p>
            <div className="home-buttons">
              <Link to="/login" className="btn">Login</Link>
              <Link to="/register" className="btn">Register</Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

Home.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  user: PropTypes.object
};

export default Home; 