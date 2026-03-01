import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button, Card, Statistic, Row, Col, Form, Input, Modal, Upload, message } from 'antd';
import { DownloadOutlined, ArrowRightOutlined, EditOutlined, SaveOutlined, UploadOutlined, LinkOutlined } from '@ant-design/icons';
import { usePortfolioStore } from '../store/portfolioStore';
import { useAuthStore } from '../store/authStore';
import { useState, useEffect } from 'react';

export default function Home() {
  const { data, updatePersonalInfo, hasResume, resumeFileName, saveResume, downloadResume, clearResume } = usePortfolioStore();
  const { isLoggedIn } = useAuthStore();
  const { personalInfo, stats, techStack, projects } = data;

  // Dynamically compute project count for stats, and remove "Years Exp" stat
  const dynamicStats = stats
    .filter(stat => !stat.label.toLowerCase().includes('exp') && !stat.label.toLowerCase().includes('year'))
    .map(stat =>
      stat.label === 'Projects' ? { ...stat, value: `${projects.length}+` } : stat
    );

  const [editingInfo, setEditingInfo] = useState(() => ({ ...personalInfo }));
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    setEditingInfo({ ...personalInfo });
  }, [personalInfo]);



  const handleEditInfo = () => {
    form.setFieldsValue(editingInfo);
    setInfoModalOpen(true);
  };

  const handleSaveInfo = (values) => {
    updatePersonalInfo(values);
    message.success('Personal info updated!');
    setInfoModalOpen(false);
  };

  const handleResumeUpload = async (file) => {
    if (file.type !== 'application/pdf') {
      message.error('Please upload a PDF file only.');
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      message.error('File too large. Maximum size is 10MB.');
      return false;
    }
    try {
      await saveResume(file);
      message.success(`Resume "${file.name}" uploaded to server!`);
    } catch (err) {
      message.error(err.message);
    }
    return false;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };
  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#0a0a0f' }}>
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <motion.div initial="hidden" animate="visible" variants={containerVariants}
        className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8 relative z-10">

        {/* Hero */}
        <motion.div variants={itemVariants} className="text-center mb-20">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
            {personalInfo.name && (
              <>
                <p style={{ color: '#06d6a0', fontSize: 16, fontWeight: '500', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 16 }}>Hello, I'm</p>
                <h1 className="gradient-text" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: '800', lineHeight: '1.1', marginBottom: 16, letterSpacing: '-2px' }}>
                  {personalInfo.name}
                </h1>
              </>
            )}
            {personalInfo.title && (
              <h2 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', color: 'rgba(255,255,255,0.5)', fontWeight: '400', marginBottom: 40 }}>
                {personalInfo.title}
              </h2>
            )}
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/projects">
              <Button type="primary" size="large" icon={<ArrowRightOutlined />} iconPosition="end"
                style={{ height: 52, fontSize: 15, padding: '0 32px', fontWeight: '600' }}>
                View Projects
              </Button>
            </Link>
            {hasResume && (
              <Button size="large" icon={<DownloadOutlined />}
                style={{ height: 52, fontSize: 15, padding: '0 32px' }}
                onClick={() => window.open('/api/resume', '_blank')}>
                Download Resume
              </Button>
            )}
            {isLoggedIn && (
              <Button size="large" icon={<EditOutlined />} onClick={handleEditInfo}
                style={{ height: 52, fontSize: 15, padding: '0 32px', borderColor: '#06d6a0', color: '#06d6a0' }}>
                Edit Info
              </Button>
            )}
          </div>
        </motion.div>

        {/* Stats */}
        {dynamicStats.length > 0 && (
          <motion.div variants={itemVariants}>
            <Row gutter={[20, 20]} justify="center" className="mb-20">
              {dynamicStats.map((stat, index) => (
                <Col xs={24} sm={12} md={10} key={index}>
                  <motion.div whileHover={{ y: -6, scale: 1.02 }} transition={{ duration: 0.3 }}>
                    <Card hoverable style={{ textAlign: 'center', borderRadius: 20 }} styles={{ body: { padding: '36px 24px' } }}>
                      <Statistic
                        title={<span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '500' }}>{stat.label}</span>}
                        value={stat.value}
                        valueStyle={{ background: 'linear-gradient(135deg, #06d6a0, #4cc9f0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: 48, fontWeight: '800', letterSpacing: '-2px' }}
                      />
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        )}

        {/* Tech Stack */}
        {techStack.length > 0 && (
          <motion.div variants={itemVariants}>
            <h3 style={{ textAlign: 'center', marginBottom: 32, color: 'rgba(255,255,255,0.92)', fontSize: 28, fontWeight: '700' }}>Tech Stack</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-20">
              {techStack.map((tech, index) => (
                <motion.div key={index} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.05 }} whileHover={{ scale: 1.08, y: -4 }}
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 16, textAlign: 'center', cursor: 'default', transition: 'border-color 0.3s, box-shadow 0.3s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(6,214,160,0.2)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(6,214,160,0.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.boxShadow = 'none'; }}>
                  <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)', fontWeight: '500', fontSize: 14 }}>{tech}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div variants={itemVariants} className="text-center"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 24, padding: '64px 32px' }}>
          <h3 style={{ fontSize: 32, fontWeight: '700', marginBottom: 12, color: 'rgba(255,255,255,0.92)' }}>Ready to Collaborate?</h3>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.4)', marginBottom: 32 }}>Let's build something amazing together</p>
          <Link to="/experience">
            <Button type="primary" size="large" style={{ height: 52, fontSize: 15, padding: '0 32px' }}>View My Experience</Button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Edit Personal Info Modal */}
      <Modal title="Edit Personal Information" open={infoModalOpen}
        onCancel={() => setInfoModalOpen(false)} footer={null} width={600}>
        <Form form={form} onFinish={handleSaveInfo} layout="vertical" initialValues={editingInfo}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
                <Input placeholder="Your Name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="title" label="Job Title" rules={[{ required: true }]}>
                <Input placeholder="Full Stack Developer" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                <Input placeholder="you@example.com" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label="Phone">
                <Input placeholder="+91 1234567890" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="location" label="Location">
            <Input placeholder="India-based, open to remote" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="github" label="GitHub URL">
                <Input prefix={<LinkOutlined />} placeholder="https://github.com/..." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="linkedin" label="LinkedIn URL">
                <Input prefix={<LinkOutlined />} placeholder="https://linkedin.com/in/..." />
              </Form.Item>
            </Col>
          </Row>

          {/* Resume Section */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 16, marginBottom: 24 }}>
            <p style={{ fontSize: 14, fontWeight: '600', color: 'rgba(255,255,255,0.8)', marginBottom: 12 }}>📄 Resume</p>
            {hasResume ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(6,214,160,0.08)', border: '1px solid rgba(6,214,160,0.2)', borderRadius: 8, padding: '10px 14px', marginBottom: 12 }}>
                <span style={{ fontSize: 20 }}>✅</span>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: '600', color: '#06d6a0' }}>Resume uploaded</p>
                  <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{resumeFileName}</p>
                </div>
                <Button size="small" danger onClick={async () => { await clearResume(); message.success('Resume removed.'); }}>Remove</Button>
              </div>
            ) : (
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 8 }}>No resume uploaded yet</p>
            )}
            <Upload beforeUpload={handleResumeUpload} accept=".pdf" showUploadList={false} maxCount={1}>
              <Button icon={<UploadOutlined />} block>{hasResume ? 'Replace Resume PDF' : 'Upload Resume PDF'}</Button>
            </Upload>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 8, marginBottom: 0 }}>
              PDF files only, max 10MB. Stored permanently on server.
            </p>
          </div>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" block size="large" icon={<SaveOutlined />}>
              Save Personal Info
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
