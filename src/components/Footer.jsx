import { Layout } from 'antd';
import { GithubOutlined, LinkedinOutlined, MailOutlined, HeartFilled, CodeOutlined, PhoneOutlined } from '@ant-design/icons';
import { usePortfolioStore } from '../store/portfolioStore';
import { Link } from 'react-router-dom';

const { Footer: AntFooter } = Layout;

export default function Footer() {
  const { data } = usePortfolioStore();
  const { personalInfo } = data;

  const socialLinks = [
    { icon: <GithubOutlined />, href: personalInfo.github, label: 'GitHub' },
    { icon: <LinkedinOutlined />, href: personalInfo.linkedin, label: 'LinkedIn' },
    { icon: <MailOutlined />, href: `mailto:${personalInfo.email}`, label: 'Email' },
  ];

  const quickLinks = [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'Skills', to: '/skills' },
    { label: 'Projects', to: '/projects' },
    { label: 'Experience', to: '/experience' },
    { label: 'Certificates', to: '/certificates' },
    { label: 'LeetCode', to: '/leetcode' },
  ];

  return (
    <AntFooter
      style={{
        background: 'linear-gradient(180deg, rgba(10, 10, 15, 0.6) 0%, rgba(10, 10, 15, 0.95) 100%)',
        borderTop: '1px solid rgba(255, 255, 255, 0.04)',
        padding: '0',
        marginTop: 'auto',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle gradient glow */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '60%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(6, 214, 160, 0.3), rgba(76, 201, 240, 0.3), transparent)',
      }} />

      <div className="max-w-6xl mx-auto" style={{ padding: '48px 24px 32px' }}>
        {/* Top section — Brand + Social + Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

          {/* Brand */}
          <div>
            <h3 style={{
              fontSize: 22,
              fontWeight: '800',
              background: 'linear-gradient(135deg, #06d6a0, #4cc9f0)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: 10,
              letterSpacing: '-0.5px',
            }}>
              {personalInfo.name}
            </h3>
            <p style={{
              color: 'rgba(255, 255, 255, 0.35)',
              fontSize: 13,
              lineHeight: 1.7,
              margin: 0,
            }}>
              {personalInfo.title}. Building exceptional digital
              experiences with clean code and modern design.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{
              fontSize: 12,
              fontWeight: '600',
              color: 'rgba(255, 255, 255, 0.5)',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              marginBottom: 16,
            }}>
              Quick Links
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {quickLinks.map((link, i) => (
                <Link
                  key={i}
                  to={link.to}
                  style={{
                    color: 'rgba(255, 255, 255, 0.35)',
                    fontSize: 13,
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#06d6a0'; e.currentTarget.style.paddingLeft = '4px'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255, 255, 255, 0.35)'; e.currentTarget.style.paddingLeft = '0'; }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{
              fontSize: 12,
              fontWeight: '600',
              color: 'rgba(255, 255, 255, 0.5)',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              marginBottom: 16,
            }}>
              Get In Touch
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a
                href={`mailto:${personalInfo.email}`}
                style={{
                  color: 'rgba(255, 255, 255, 0.4)',
                  fontSize: 13,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#06d6a0'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.4)'}
              >
                <MailOutlined style={{ fontSize: 14 }} />
                {personalInfo.email}
              </a>
              {personalInfo.phone && (
                <a
                  href={`tel:${personalInfo.phone}`}
                  style={{
                    color: 'rgba(255, 255, 255, 0.4)',
                    fontSize: 13,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#06d6a0'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.4)'}
                >
                  <PhoneOutlined style={{ fontSize: 14 }} />
                  {personalInfo.phone}
                </a>
              )}
              {personalInfo.location && (
                <p style={{
                  color: 'rgba(255, 255, 255, 0.3)',
                  fontSize: 13,
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  📍 {personalInfo.location}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
          marginBottom: 24,
        }} />

        {/* Bottom — Social icons + Copyright */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div style={{ display: 'flex', gap: 6 }}>
            {socialLinks.map((link, i) => (
              <a
                key={i}
                href={link.href}
                target={link.label !== 'Email' ? '_blank' : undefined}
                rel="noopener noreferrer"
                aria-label={link.label}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'rgba(255, 255, 255, 0.35)',
                  fontSize: 18,
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = '#06d6a0';
                  e.currentTarget.style.borderColor = 'rgba(6, 214, 160, 0.25)';
                  e.currentTarget.style.background = 'rgba(6, 214, 160, 0.08)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(6, 214, 160, 0.12)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.35)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {link.icon}
              </a>
            ))}
          </div>

          <p style={{
            margin: 0,
            color: 'rgba(255, 255, 255, 0.2)',
            fontSize: 12,
            letterSpacing: '0.3px',
            display: 'flex',
            alignItems: 'center',
            gap: 5,
          }}>
            © {new Date().getFullYear()} {personalInfo.name}
          </p>
        </div>
      </div>
    </AntFooter>
  );
}
