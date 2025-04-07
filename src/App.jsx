import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import OtpVerificationPage from './pages/OtpVerificationPage'
import CreateProfilePage from './pages/CreateProfilePage'
import MainPage from './pages/MainPage'
import CreateBlogPage from './pages/CreateBlogPage'
import BlogSuccessPage from './pages/BlogSuccessPage'
import BlogDetailPage from './pages/BlogDetailPage'
import SettingsPage from './pages/SettingsPage'
import Navbar from './components/Navbar'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route 
          path="/signin" 
          element={isAuthenticated ? <Navigate to="/main" /> : <SignInPage setIsAuthenticated={setIsAuthenticated} />} 
        />
        <Route 
          path="/signup" 
          element={isAuthenticated ? <Navigate to="/main" /> : <SignUpPage />} 
        />
        <Route 
          path="/verify" 
          element={<OtpVerificationPage setIsAuthenticated={setIsAuthenticated} />} 
        />
        <Route path="/about" element={<div>AboutPage</div>} />

        {/* Protected Routes */}
        <Route 
          path="/create-profile" 
          element={
            isAuthenticated ? <CreateProfilePage /> : <Navigate to="/signin" />
          } 
        />
        <Route 
          path="/main" 
          element={
            isAuthenticated ? <MainPage /> : <Navigate to="/signin" />
          } 
        />
        <Route 
          path="/profile/:username" 
          element={
            isAuthenticated ? <div>ProfilePage</div> : <Navigate to="/signin" />
          } 
        />
        <Route 
          path="/create-blog" 
          element={
            isAuthenticated ? <CreateBlogPage /> : <Navigate to="/signin" />
          } 
        />
        <Route 
          path="/blog-success" 
          element={
            isAuthenticated ? <BlogSuccessPage /> : <Navigate to="/signin" />
          } 
        />
        <Route 
          path="/blog/:blogId" 
          element={
            isAuthenticated ? <BlogDetailPage /> : <Navigate to="/signin" />
          } 
        />
        <Route 
          path="/settings" 
          element={
            isAuthenticated ? <SettingsPage /> : <Navigate to="/signin" />
          } 
        />
      </Routes>
    </Router>
  )
}

export default App
