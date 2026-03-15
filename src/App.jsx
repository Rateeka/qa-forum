// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AskQuestionPage from './pages/AskQuestionPage';
import QuestionDetailPage from './pages/QuestionDetailPage';
import EditQuestionPage from './pages/EditQuestionPage';
import ProfilePage from './pages/ProfilePage';
import TagsPage from './pages/TagsPage';
import NotFoundPage from './pages/NotFoundPage';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  if (loading) return null;
  if (!currentUser) return <Navigate to="/login" replace />;
  return children;
};

// Auth Route (redirect if already logged in)
const AuthRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  if (loading) return null;
  if (currentUser) return <Navigate to="/" replace />;
  return children;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<HomePage />} />
      <Route path="questions/:id" element={<QuestionDetailPage />} />
      <Route
        path="questions/:id/edit"
        element={
          <ProtectedRoute>
            <EditQuestionPage />
          </ProtectedRoute>
        }
      />
      <Route path="tags" element={<TagsPage />} />
      <Route path="tags/:tag" element={<HomePage />} />
      <Route path="profile/:userId" element={<ProfilePage />} />
      <Route
        path="ask"
        element={
          <ProtectedRoute>
            <AskQuestionPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
    <Route
      path="/login"
      element={
        <AuthRoute>
          <LoginPage />
        </AuthRoute>
      }
    />
    <Route
      path="/signup"
      element={
        <AuthRoute>
          <SignupPage />
        </AuthRoute>
      }
    />
  </Routes>
);

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <AppRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1f2937',
            color: '#f9fafb',
            border: '1px solid #374151',
            fontFamily: '"DM Sans", sans-serif',
          },
          success: { iconTheme: { primary: '#6366f1', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
    </BrowserRouter>
  </AuthProvider>
);

export default App;
