import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout, Button, Space, Dropdown } from 'antd';
import {
  LogoutOutlined,
  MenuOutlined,
  HomeOutlined,
  UserOutlined,
  CodeOutlined,
  ProjectOutlined,
  ScheduleOutlined,
  SafetyCertificateOutlined,
  TrophyOutlined,
  DashboardOutlined
} from '@ant-design/icons';
import { useAuthStore } from '../store/authStore';
import { usePortfolioStore } from '../store/portfolioStore';

const { Header: AntHeader } = Layout;

export default function Header() {
  const location = useLocation();
  const { isLoggedIn, logout } = useAuthStore();
  const { setEditMode } = usePortfolioStore();
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY.current && currentY > 80) {
        setNavVisible(false);
      } else {
        setNavVisible(true);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setEditMode(false);
  };

  const menuItems = [
    { key: '/', label: 'Home', icon: <HomeOutlined /> },
    { key: '/about', label: 'About', icon: <UserOutlined /> },
    { key: '/skills', label: 'Skills', icon: <CodeOutlined /> },
    { key: '/projects', label: 'Projects', icon: <ProjectOutlined /> },
    { key: '/experience', label: 'Experience', icon: <ScheduleOutlined /> },
    { key: '/certificates', label: 'Certificates', icon: <SafetyCertificateOutlined /> },
    { key: '/leetcode', label: 'LeetCode', icon: <TrophyOutlined /> },
  ];

  if (isLoggedIn) {
    menuItems.push({ key: '/dashboard', label: 'Dashboard', icon: <DashboardOutlined /> });
  }

  const mobileMenuProps = {
    selectedKeys: [location.pathname],
    items: menuItems.map(item => ({
      key: item.key,
      icon: item.icon,
      label: <Link to={item.key}>{item.label}</Link>,
    })),
  };

  return (
    <AntHeader
      className="sticky top-0 z-50"
      style={{
        background: 'rgba(10, 10, 15, 0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
        transform: navVisible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.3s ease',
      }}
    >
      <div className="flex items-center">
        <Link to="/">
          <h1
            className="text-xl font-bold m-0 cursor-pointer transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #06d6a0, #4cc9f0)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            LK.
          </h1>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-1">
        {menuItems.map(item => (
          <Link
            key={item.key}
            to={item.key}
            className="transition-all duration-300"
            style={{
              padding: '6px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: location.pathname === item.key ? '600' : '400',
              color: location.pathname === item.key ? '#06d6a0' : 'rgba(255, 255, 255, 0.6)',
              background: location.pathname === item.key ? 'rgba(6, 214, 160, 0.08)' : 'transparent',
              textDecoration: 'none',
            }}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Auth & Mobile Menu */}
      <Space>
        {isLoggedIn && (
          <>
            <span
              style={{
                fontSize: '12px',
                padding: '4px 12px',
                borderRadius: '999px',
                background: 'rgba(6, 214, 160, 0.1)',
                border: '1px solid rgba(6, 214, 160, 0.2)',
                color: '#06d6a0',
              }}
              className="hidden sm:inline-flex"
            >
              ● Edit Mode
            </span>
            <Button
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              size="small"
              style={{
                background: 'rgba(247, 37, 133, 0.1)',
                borderColor: 'rgba(247, 37, 133, 0.3)',
                color: '#f72585',
                borderRadius: '8px',
              }}
            >
              Logout
            </Button>
          </>
        )}

        {/* Mobile Menu */}
        <Dropdown menu={mobileMenuProps} trigger={['click']} className="md:hidden">
          <Button
            icon={<MenuOutlined />}
            type="text"
            style={{ color: 'rgba(255, 255, 255, 0.7)' }}
          />
        </Dropdown>
      </Space>
    </AntHeader>
  );
}
