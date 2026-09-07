import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { Toaster } from 'react-hot-toast';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyEmail from './pages/auth/VerifyEmail';

// Public Pages
import PublicDashboard from './pages/PublicDashboard';
import About from './pages/About';
import ActiveChallengesPublic from './pages/ActiveChallengesPublic';
import Guidelines from './pages/Guidelines';

// Govt Pages
import GovtDashboard from './pages/govt/GovtDashboard';
import PostChallenge from './pages/govt/PostChallenge';
import ViewMatches from './pages/govt/ViewMatches';
import GovtEscrow from './pages/govt/GovtEscrow';
import BlindEvaluationPage from './pages/govt/BlindEvaluationPage';

// Startup Pages
import StartupDashboard from './pages/startup/StartupDashboard';
import ApplyChallenge from './pages/startup/ApplyChallenge';
import MyPilots from './pages/startup/MyPilots';
import UploadMilestones from './pages/startup/UploadMilestones';
import TRLQuizPage from './pages/startup/TRLQuizPage';

// ── Route Guards ──────────────────────────────────────────────────────────────

const GovtRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAuthStore((s) => s.user);
  if (user?.role !== 'NODAL_OFFICER') return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const StartupRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAuthStore((s) => s.user);
  if (user?.role !== 'STARTUP_FOUNDER') return <Navigate to="/login" replace />;
  return <>{children}</>;
};

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Public */}
        <Route path="/" element={<PublicDashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/active-challenges" element={<ActiveChallengesPublic />} />
        <Route path="/guidelines" element={<Guidelines />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Protected — Govt */}
        <Route path="/govt/dashboard" element={<GovtRoute><GovtDashboard /></GovtRoute>} />
        <Route path="/govt/post-challenge" element={<GovtRoute><PostChallenge /></GovtRoute>} />
        <Route path="/govt/matches" element={<GovtRoute><ViewMatches /></GovtRoute>} />
        <Route path="/govt/escrow" element={<GovtRoute><GovtEscrow /></GovtRoute>} />
        <Route path="/govt/blind-eval" element={<GovtRoute><BlindEvaluationPage /></GovtRoute>} />

        {/* Protected — Startup */}
        <Route path="/startup/dashboard" element={<StartupRoute><StartupDashboard /></StartupRoute>} />
        <Route path="/startup/challenges" element={<StartupRoute><ApplyChallenge /></StartupRoute>} />
        <Route path="/startup/pilots" element={<StartupRoute><MyPilots /></StartupRoute>} />
        <Route path="/startup/milestones" element={<StartupRoute><UploadMilestones /></StartupRoute>} />
        <Route path="/startup/trl-quiz" element={<StartupRoute><TRLQuizPage /></StartupRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}