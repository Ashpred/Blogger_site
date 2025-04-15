import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
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
import TestDirectionalEditor from './pages/TestDirectionalEditor'
import TestImageEditor from './pages/TestImageEditor'
import TestBasicEditor from './pages/TestBasicEditor'
import BasicColorEditor from './pages/BasicColorEditor'
import PlainTextEditor from './pages/PlainTextEditor'
import Navbar from './components/Navbar'
import LoadingSpinner from './components/LoadingSpinner'
import './App.css'

function AppRoutes() {
  const { user, loading, isNewUser, setIsNewUser } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
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
          element={user ? (isNewUser ? <Navigate to="/create-profile" /> : <Navigate to="/main" />) : <SignUpPage />} 
        />
        <Route path="/about" element={<AboutPage />} />

        {/* Protected Routes */}
        <Route 
          path="/create-profile" 
          element={
            user ? (
              <CreateProfilePage onComplete={() => setIsNewUser(false)} />
            ) : <Navigate to="/signin" />
          } 
        />
        {/* Redirect verify route to main */}
        <Route 
          path="/verify" 
          element={<Navigate to="/main" />} 
        />
        <Route 
          path="/main" 
          element={
            user ? (
              isNewUser ? 
              <Navigate to="/create-profile" /> : 
              <MainPage />
            ) : <Navigate to="/signin" />
          } 
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
        <Route 
          path="/test-directional-editor" 
          element={user ? <TestDirectionalEditor /> : <Navigate to="/signin" />} 
        />
        <Route 
          path="/test-image-editor" 
          element={user ? <TestImageEditor /> : <Navigate to="/signin" />} 
        />
        <Route 
          path="/test-basic-editor" 
          element={<TestBasicEditor />} 
        />
        <Route 
          path="/basic-color-editor" 
          element={<BasicColorEditor />} 
        />
        <Route 
          path="/plain-editor" 
          element={<PlainTextEditor />}
        />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
