import { Routes, Route } from 'react-router-dom';
import Home from '../screens/Home/Home.jsx';
import VideoPlayer from '../screens/VideoPlayer/VideoPlayer.jsx';
import DoubtSolver from '../screens/DoubtSolver/DoubtSolver.jsx';
import CareerChatbot from '../screens/CareerChatbot/CareerChatbot.jsx';
import Dashboard from '../screens/Dashboard/Dashboard.jsx';
import MockTest from '../screens/MockTest/MockTest.jsx';
import PYQAnalysis from '../screens/PYQAnalysis/PYQAnalysis.jsx';
import Settings from '../screens/Settings/Settings.jsx';
import NotFound from '../screens/NotFound/NotFound.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/watch" element={<VideoPlayer />} />
      <Route path="/doubts" element={<DoubtSolver />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/test" element={<MockTest />} />
      <Route path="/pyq" element={<PYQAnalysis />} />
      <Route path="/career" element={<CareerChatbot />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
