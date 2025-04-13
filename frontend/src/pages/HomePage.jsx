import { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, OrbitControls, Text } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import axios from '../config/axios';
import '../assets/styles/HomePage.css';

// Optimized 3D sphere component with memoization
const AnimatedSphere = () => {
  const sphereRef = useRef();
  
  useFrame(({ clock }) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.x = clock.getElapsedTime() * 0.2;
      sphereRef.current.rotation.y = clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Sphere ref={sphereRef} args={[1, 100, 200]} scale={2.5}>
      <MeshDistortMaterial 
        color="#8352FD" 
        attach="material"
        distort={0.4}
        speed={2}
        roughness={0.2}
      />
    </Sphere>
  );
};

// Memoized 3D text component
const FloatingText = ({ text, position, rotation, color }) => {
  const textRef = useRef();
  
  useFrame(({ clock }) => {
    if (textRef.current) {
      textRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime()) * 0.1;
    }
  });

  return (
    <Text
      ref={textRef}
      position={position}
      rotation={rotation}
      color={color}
      fontSize={0.5}
      font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiA.woff2"
      anchorX="center"
      anchorY="middle"
    >
      {text}
    </Text>
  );
};

// Memoized feature card component
const FeatureCard = ({ icon, title, description, delay }) => {
  return (
    <motion.div 
      className="feature-card"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </motion.div>
  );
};

// Updated PopularBlogCard component to work with real data
const PopularBlogCard = ({ blog, isActive }) => {
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  // Create excerpt from content
  const createExcerpt = (content) => {
    // Remove any HTML tags and limit to 100 characters
    return content.replace(/(<([^>]+)>)/gi, '').substring(0, 100);
  };

  return (
    <motion.div
      className={`popular-blog-card ${isActive ? 'active' : ''}`}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
    >
      <div className="blog-image">
        <img src={blog.image || '/default-blog.jpg'} alt={blog.title} loading="lazy" />
      </div>
      <div className="blog-content">
        <h3>{blog.title}</h3>
        <p>{createExcerpt(blog.excerpt)}</p>
        <div className="blog-meta">
          <span className="author">{blog.author}</span>
          <span className="dot">•</span>
          <span className="date">{formatDate(blog.date)}</span>
        </div>
      </div>
    </motion.div>
  );
};

const HomePage = () => {
  const [currentBlogIndex, setCurrentBlogIndex] = useState(0);
  const { user } = useAuth();
  
  // Memoized popular blogs data
  const popularBlogs = useMemo(() => [
    {
      id: 1,
      title: "The Future of Web Development",
      excerpt: "Exploring the latest trends in web development and what's coming next...",
      author: "John Doe",
      date: "2 days ago",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6"
    },
    {
      id: 2,
      title: "Mastering React Hooks",
      excerpt: "A comprehensive guide to using React Hooks in your applications...",
      author: "Jane Smith",
      date: "4 days ago",
      image: "https://images.unsplash.com/photo-1555099962-4199c345e5dd"
    },
    {
      id: 3,
      title: "The Art of Clean Code",
      excerpt: "Best practices for writing maintainable and efficient code...",
      author: "Mike Johnson",
      date: "1 week ago",
      image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea"
    }
  ], []);

  // Optimized auto-rotate with cleanup
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBlogIndex((prevIndex) => 
        prevIndex === popularBlogs.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [popularBlogs.length]);

  // Memoized animation variants
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.3
      } 
    }
  }), []);

  const itemVariants = useMemo(() => ({
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  }), []);

  const buttonVariants = useMemo(() => ({
    hover: { 
      scale: 1.05, 
      boxShadow: '0px 0px 8px rgba(255,255,255,0.5)',
      transition: { type: 'spring', stiffness: 400 }
    },
    tap: { scale: 0.95 }
  }), []);

  return (
    <div className="home-page">
      <Navbar />
      
      <section className="hero-section">
        <div className="hero-content">
          <motion.div 
            className="hero-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1>Share Your Stories with the World</h1>
            <p>A modern blogging platform with stunning visuals and seamless experience</p>
            
            {!user ? (
              <div className="hero-buttons">
                <Link to="/signup">
                  <motion.button 
                    className="primary-button"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    Get Started
                  </motion.button>
                </Link>
                <Link to="/signin">
                  <motion.button 
                    className="secondary-button"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    Sign In
                  </motion.button>
                </Link>
              </div>
            ) : (
              <div className="hero-buttons">
                <Link to="/main">
                  <motion.button 
                    className="primary-button"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    Explore Blogs
                  </motion.button>
                </Link>
                <Link to="/create-blog">
                  <motion.button 
                    className="secondary-button"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    Create Blog
                  </motion.button>
                </Link>
              </div>
            )}
          </motion.div>
        </div>
        
        <div className="popular-blogs-container">
          <h2>Popular Stories</h2>
          <div className="blogs-carousel">
            <AnimatePresence mode="wait">
              <PopularBlogCard 
                key={popularBlogs[currentBlogIndex].id}
                blog={popularBlogs[currentBlogIndex]}
                isActive={true}
              />
            </AnimatePresence>
            <div className="carousel-indicators">
              {popularBlogs.map((_, index) => (
                <div 
                  key={index}
                  className={`indicator ${index === currentBlogIndex ? 'active' : ''}`}
                  onClick={() => setCurrentBlogIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="canvas-container">
          <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <Suspense fallback={null}>
              <AnimatedSphere />
              <FloatingText text="Create" position={[-2, 1, 0]} rotation={[0, 0.5, 0]} color="#fff" />
              <FloatingText text="Share" position={[2, -1, 0]} rotation={[0, -0.5, 0]} color="#fff" />
              <FloatingText text="Connect" position={[0, 2, 0]} rotation={[0, 0, 0]} color="#fff" />
            </Suspense>
            <OrbitControls enableZoom={false} enablePan={false} enableRotate={true} />
          </Canvas>
        </div>
      </section>

      <section className="features-section">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          What Sets Us Apart
        </motion.h2>
        
        <div className="features-grid">
          <FeatureCard 
            icon="✍️"
            title="Rich Text Editor"
            description="Create beautiful content with our powerful editor supporting images, code snippets, and formatting."
            delay={0.1}
          />
          <FeatureCard 
            icon="🌐"
            title="Global Reach"
            description="Share your content with readers from all around the world with our optimized platform."
            delay={0.2}
          />
          <FeatureCard 
            icon="🔒"
            title="Secure Platform"
            description="Your account and content are protected with best-in-class security measures."
            delay={0.3}
          />
          <FeatureCard 
            icon="📊"
            title="Analytics"
            description="Track your blog's performance with comprehensive analytics and insights."
            delay={0.4}
          />
        </div>
      </section>

      <section className="photos-section">
        <div className="photo-overlay">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Express Yourself Through Words
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Join thousands of writers sharing their stories, knowledge, and passion
          </motion.p>
        </div>
      </section>

      <footer className="contact-footer">
        <div className="footer-content">
          <div className="footer-info">
            <h3>BlogSphere</h3>
            <p>A modern platform for bloggers and readers alike.</p>
          </div>
          
          <div className="footer-links">
            <div className="footer-column">
              <h4>Platform</h4>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/signin">Sign In</Link></li>
                <li><Link to="/signup">Sign Up</Link></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4>Legal</h4>
              <ul>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Cookie Policy</a></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4>Contact</h4>
              <ul>
                <li>Email: contact@blogsphere.com</li>
                <li>Phone: +1 (555) 123-4567</li>
                <li>Address: 123 Blog Street, Content City</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} BlogSphere. All rights reserved.</p>
          <div className="social-links">
            <a href="#" className="social-link">Facebook</a>
            <a href="#" className="social-link">Twitter</a>
            <a href="#" className="social-link">Instagram</a>
            <a href="#" className="social-link">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage; 