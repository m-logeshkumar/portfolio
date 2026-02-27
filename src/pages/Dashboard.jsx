import { Navigate } from 'react-router-dom';
import { Card, Button, Statistic, Row, Col, Upload, message } from 'antd';
import { ReloadOutlined, UploadOutlined, DownloadOutlined, DeleteOutlined, FilePdfOutlined } from '@ant-design/icons';
import { useAuthStore } from '../store/authStore';
import { usePortfolioStore } from '../store/portfolioStore';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { isLoggedIn } = useAuthStore();
  const { data, resetData, hasResume, resumeFileName, saveResume, downloadResume, clearResume } = usePortfolioStore();

  if (!isLoggedIn) return <Navigate to="/" replace />;

  const handleReset = () => {
    if (window.confirm('This will reset all data to defaults. Are you sure?')) {
      resetData();
      window.location.reload();
    }
  };

  const stats = [
    { title: 'Projects', value: data.projects.length, color: '#06d6a0' },
    { title: 'Featured', value: data.projects.filter(p => p.featured).length, color: '#4cc9f0' },
    { title: 'Skills', value: data.skills.reduce((a, c) => a + c.items.length, 0), color: '#7b5ea7' },
    { title: 'Experience', value: data.experience.length, color: '#f72585' },
    { title: 'Certificates', value: (data.certificates || []).length, color: '#ffd60a' },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0f' }}>
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <p style={{ color: '#06d6a0', fontSize: 14, fontWeight: '500', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 12 }}>Admin panel</p>
              <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: '800', color: 'rgba(255,255,255,0.92)', letterSpacing: '-1px', margin: 0 }}>Dashboard</h1>
            </div>
            <Button icon={<ReloadOutlined />} danger onClick={handleReset}>Reset to Defaults</Button>
          </div>

          <Row gutter={[16, 16]} className="mb-8">
            {stats.map((stat, i) => (
              <Col xs={24} sm={12} md={6} key={i}>
                <Card style={{ borderRadius: 16 }} bodyStyle={{ padding: 24 }}>
                  <Statistic title={<span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>{stat.title}</span>}
                    value={stat.value} valueStyle={{ color: stat.color, fontSize: 36, fontWeight: '800' }} />
                </Card>
              </Col>
            ))}
          </Row>

          {/* Resume Management */}
          <Card style={{ borderRadius: 20, marginBottom: 24 }} bodyStyle={{ padding: 32 }}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <h2 style={{ fontSize: 22, fontWeight: '700', color: 'rgba(255,255,255,0.92)', margin: 0 }}>📄 Resume Management</h2>
            </div>
            {hasResume ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(6,214,160,0.06)', border: '1px solid rgba(6,214,160,0.15)', borderRadius: 14, padding: '16px 20px' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(6,214,160,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FilePdfOutlined style={{ fontSize: 24, color: '#06d6a0' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: 15, fontWeight: '600', color: 'rgba(255,255,255,0.9)' }}>{resumeFileName}</p>
                    <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Uploaded • Ready for download</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Button icon={<DownloadOutlined />} size="large" type="primary" block onClick={() => {
                    window.open('/api/resume', '_blank');
                  }}>Download</Button>
                  <Upload beforeUpload={async (file) => {
                    if (file.type !== 'application/pdf') { message.error('PDF files only.'); return false; }
                    if (file.size > 10 * 1024 * 1024) { message.error('Max 10MB.'); return false; }
                    try { await saveResume(file); message.success(`Resume replaced with "${file.name}"!`); } catch (err) { message.error(err.message); }
                    return false;
                  }} accept=".pdf" showUploadList={false} maxCount={1}>
                    <Button icon={<UploadOutlined />} size="large" block>Replace</Button>
                  </Upload>
                  <Button icon={<DeleteOutlined />} size="large" danger block onClick={async () => { await clearResume(); message.success('Resume removed.'); }}>Remove</Button>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ width: 64, height: 64, borderRadius: 16, background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <FilePdfOutlined style={{ fontSize: 32, color: 'rgba(255,255,255,0.25)' }} />
                </div>
                <p style={{ fontSize: 16, fontWeight: '500', color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>No resume uploaded yet</p>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', marginBottom: 20 }}>Upload a PDF to enable the Download Resume button on your portfolio</p>
                <Upload beforeUpload={async (file) => {
                  if (file.type !== 'application/pdf') { message.error('PDF files only.'); return false; }
                  if (file.size > 10 * 1024 * 1024) { message.error('Max 10MB.'); return false; }
                  try { await saveResume(file); message.success(`Resume "${file.name}" uploaded!`); } catch (err) { message.error(err.message); }
                  return false;
                }} accept=".pdf" showUploadList={false} maxCount={1}>
                  <Button icon={<UploadOutlined />} type="primary" size="large">Upload Resume PDF</Button>
                </Upload>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 12 }}>PDF files only, max 10MB. Stored permanently on server.</p>
              </div>
            )}
          </Card>

          <Card style={{ borderRadius: 20, marginBottom: 24 }} bodyStyle={{ padding: 32 }}>
            <h2 style={{ fontSize: 22, fontWeight: '700', color: 'rgba(255,255,255,0.92)', marginBottom: 20 }}>How to Edit</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { icon: '📝', title: 'Projects', desc: 'Go to Projects page to add, edit, or delete.' },
                { icon: '⚡', title: 'Skills', desc: 'Visit Skills page to manage proficiency levels.' },
                { icon: '💼', title: 'Experience', desc: 'Update work history on Experience page.' },
                { icon: '🏆', title: 'Certificates', desc: 'Manage certificates on Certificates page.' },
                { icon: '💾', title: 'Persistence', desc: 'All edits saved to MongoDB Atlas permanently.' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 20 }}>{item.icon}</span>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: '600', color: 'rgba(255,255,255,0.85)', margin: '0 0 2px 0' }}>{item.title}</h3>
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, margin: 0 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card style={{ borderRadius: 20, marginBottom: 24 }} bodyStyle={{ padding: 32 }}>
            <h2 style={{ fontSize: 22, fontWeight: '700', color: 'rgba(255,255,255,0.92)', marginBottom: 16 }}>Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Edit Projects', href: '/projects' },
                { label: 'Edit Skills', href: '/skills' },
                { label: 'Edit Experience', href: '/experience' },
                { label: 'Edit Certificates', href: '/certificates' },
                { label: 'View Portfolio', href: '/' },
              ].map((a, i) => (
                <Button key={i} type={i < 3 ? 'primary' : 'default'} size="large" href={a.href} block>{a.label}</Button>
              ))}
            </div>
          </Card>

          <Card style={{ borderRadius: 20 }} bodyStyle={{ padding: 32 }}>
            <h2 style={{ fontSize: 22, fontWeight: '700', color: 'rgba(255,255,255,0.92)', marginBottom: 16 }}>Data Preview</h2>
            <pre style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: 16, borderRadius: 12, overflow: 'auto', maxHeight: 384, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
              {JSON.stringify(data, null, 2)}
            </pre>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
