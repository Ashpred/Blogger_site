import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import HomePage from './pages/HomePage'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import CreateProfilePage from './pages/CreateProfilePage'
import MainPage from './pages/MainPage'
import CreateBlogPage from './pages/CreateBlogPage'
import BlogSuccessPage from './pages/BlogSuccessPage'
import BlogDetailPage from './pages/BlogDetailPage'
import SettingsPage from './pages/SettingsPage'
import AboutPage from './pages/AboutPage'
import ProfilePage from './pages/ProfilePage'
import Navbar from './components/Navbar'
import './App.css'

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route 
          path="/signin" 
          element={user ? <Navigate to="/main" /> : <SignInPage />} 
        />
        <Route 
          path="/signup" 
          element={user ? <Navigate to="/main" /> : <SignUpPage />} 
        />
        <Route path="/about" element={<AboutPage />} />

        {/* Protected Routes */}
        <Route 
          path="/create-profile" 
          element={user ? <CreateProfilePage /> : <Navigate to="/signin" />} 
        />
        {/* Redirect verify route to main */}
        <Route 
          path="/verify" 
          element={<Navigate to="/main" />} 
        />
        <Route 
          path="/main" 
          element={user ? <MainPage /> : <Navigate to="/signin" />} 
        />
        <Route 
          path="/profile/:username" 
          element={user ? <ProfilePage /> : <Navigate to="/signin" />} 
        />
        <Route 
          path="/create-blog" 
          element={user ? <CreateBlogPage /> : <Navigate to="/signin" />} 
        />
        <Route 
          path="/blog-success" 
          element={user ? <BlogSuccessPage /> : <Navigate to="/signin" />} 
        />
        <Route 
          path="/blog/:blogId" 
          element={user ? <BlogDetailPage /> : <Navigate to="/signin" />} 
        />
        <Route 
          path="/settings" 
          element={user ? <SettingsPage /> : <Navigate to="/signin" />} 
        />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
