import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Layout, ConfigProvider, theme } from 'antd';
import { AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import { usePortfolioStore } from './store/portfolioStore';
import Home from './pages/Home';
import About from './pages/About';
import Skills from './pages/Skills';
import Projects from './pages/Projects';
import Experience from './pages/Experience';
import Certificates from './pages/Certificates';
import LeetCode from './pages/LeetCode';
import Dashboard from './pages/Dashboard';
import './App.css';

const { Content } = Layout;

// Hidden admin entry point
function AdminLogin() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(true);

  const handleClose = () => {
    setModalOpen(false);
    navigate('/');
  };

  const handleSuccess = () => {
    setModalOpen(false);
    navigate('/dashboard');
  };

  return <LoginModal open={modalOpen} onClose={handleClose} onSuccess={handleSuccess} />;
}

function App() {
  const { loadFromDB, checkResume } = usePortfolioStore();

  useEffect(() => {
    loadFromDB();
    checkResume();
  }, []);

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#06d6a0',
          colorInfo: '#06d6a0',
          colorBgBase: '#0a0a0f',
          colorBgContainer: 'rgba(255, 255, 255, 0.03)',
          colorBorder: 'rgba(255, 255, 255, 0.06)',
          colorText: 'rgba(255, 255, 255, 0.92)',
          colorTextSecondary: 'rgba(255, 255, 255, 0.6)',
          borderRadius: 12,
          fontFamily: "'Inter', system-ui, sans-serif",
        },
      }}
    >
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Layout style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'transparent' }}>
          <Header />
          <Content style={{ flex: 1 }}>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/skills" element={<Skills />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/experience" element={<Experience />} />
                <Route path="/certificates" element={<Certificates />} />
                <Route path="/leetcode" element={<LeetCode />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin" element={<AdminLogin />} />
              </Routes>
            </AnimatePresence>
          </Content>
          <Footer />
        </Layout>
      </Router>
    </ConfigProvider>
  );
}

export default App;
