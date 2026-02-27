import { motion } from 'framer-motion';
import { Card, Button, Modal, Form, Input, message } from 'antd';
import {
  ClockCircleOutlined, TrophyOutlined, RocketOutlined,
  BookOutlined, CodeOutlined, EditOutlined, DeleteOutlined,
  PlusOutlined, SaveOutlined
} from '@ant-design/icons';
import { usePortfolioStore } from '../store/portfolioStore';
import { useAuthStore } from '../store/authStore';
import { useState, useEffect } from 'react';

const { TextArea } = Input;

const iconMap = [
  <BookOutlined />, <CodeOutlined />, <RocketOutlined />,
  <TrophyOutlined />, <ClockCircleOutlined />
];
const iconColors = ['#06d6a0', '#4cc9f0', '#7b5ea7', '#f72585', '#ffd60a'];

export default function About() {
  const { data, updateAbout } = usePortfolioStore();
  const { isLoggedIn } = useAuthStore();
  const { about, personalInfo } = data;

  const [editingAbout, setEditingAbout] = useState(() => JSON.parse(JSON.stringify(about)));
  const [editModal, setEditModal] = useState({ open: false, item: null, index: null });
  const [introEditing, setIntroEditing] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    setEditingAbout(JSON.parse(JSON.stringify(about)));
  }, [about]);

  const handleSaveAll = () => {
    updateAbout(editingAbout);
    message.success('About section updated!');
  };

  const handleIntroChange = (e) => {
    setEditingAbout(prev => ({ ...prev, intro: e.target.value }));
  };

  const handleEditTimeline = (item, index) => {
    form.setFieldsValue(item);
    setEditModal({ open: true, item, index });
  };

  const handleDeleteTimeline = (index) => {
    setEditingAbout(prev => ({
      ...prev,
      timeline: prev.timeline.filter((_, i) => i !== index)
    }));
  };

  const handleTimelineSubmit = (values) => {
    if (editModal.index !== null) {
      setEditingAbout(prev => ({
        ...prev,
        timeline: prev.timeline.map((t, i) =>
          i === editModal.index ? { ...t, ...values } : t
        )
      }));
    } else {
      setEditingAbout(prev => ({
        ...prev,
        timeline: [...prev.timeline, { ...values, id: Date.now() }]
      }));
    }
    setEditModal({ open: false, item: null, index: null });
    form.resetFields();
    message.success(editModal.index !== null ? 'Updated!' : 'Added!');
  };

  const displayAbout = isLoggedIn ? editingAbout : about;

  return (
    <div className="min-h-screen relative" style={{ background: '#0a0a0f' }}>
      <div className="orb orb-2" />
      <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex justify-between items-center mb-8">
            <div>
              <p style={{ color: '#06d6a0', fontSize: 14, fontWeight: '500', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 12 }}>Get to know me</p>
              <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: '800', color: 'rgba(255,255,255,0.92)', letterSpacing: '-1px', margin: 0 }}>About Me</h1>
            </div>
            {isLoggedIn && (
              <Button icon={<SaveOutlined />} type="primary" size="large" onClick={handleSaveAll}>
                Save Changes
              </Button>
            )}
          </div>

          {/* Introduction */}
          <Card style={{ borderRadius: 20, marginBottom: 48 }} styles={{ body: { padding: 32 } }}>
            {isLoggedIn ? (
              <TextArea
                value={editingAbout.intro}
                onChange={handleIntroChange}
                autoSize={{ minRows: 3, maxRows: 8 }}
                style={{ fontSize: 17, lineHeight: '1.8', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}
              />
            ) : (
              <p style={{ fontSize: 17, lineHeight: '1.8', color: 'rgba(255,255,255,0.7)', marginBottom: 16 }}>{displayAbout.intro}</p>
            )}
            <div style={{ display: 'flex', alignItems: 'center', color: '#06d6a0', fontWeight: '500', fontSize: 14, marginTop: 16 }}>
              <ClockCircleOutlined style={{ marginRight: 8 }} />
              <span>{personalInfo.location}</span>
            </div>
          </Card>

          {/* Developer Journey */}
          <div className="flex justify-between items-center mb-10">
            <h2 style={{ fontSize: 28, fontWeight: '700', color: 'rgba(255,255,255,0.92)', margin: 0 }}>My Developer Journey</h2>
            {isLoggedIn && (
              <Button icon={<PlusOutlined />} onClick={() => { form.resetFields(); setEditModal({ open: true, item: null, index: null }); }}>
                Add Entry
              </Button>
            )}
          </div>

          {/* Snake / Alternating Timeline */}
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2,
              background: 'linear-gradient(180deg, #06d6a0, #4cc9f0, #7b5ea7, #f72585, #ffd60a)',
              transform: 'translateX(-50%)', borderRadius: 999, opacity: 0.3,
            }} />

            {displayAbout.timeline.map((item, index) => {
              const isLeft = index % 2 === 0;
              const color = iconColors[index % iconColors.length];
              return (
                <motion.div
                  key={item.id || index}
                  initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  style={{ display: 'flex', justifyContent: isLeft ? 'flex-start' : 'flex-end', position: 'relative', marginBottom: 40 }}
                >
                  {/* Dot */}
                  <div style={{
                    position: 'absolute', left: '50%', top: 28, transform: 'translateX(-50%)',
                    width: 16, height: 16, borderRadius: '50%', background: color,
                    boxShadow: `0 0 16px ${color}60`, zIndex: 2, border: '3px solid #0a0a0f',
                  }} />
                  {/* Connector */}
                  <div style={{
                    position: 'absolute', top: 34, height: 2, width: 40, background: `${color}40`,
                    left: isLeft ? undefined : '50%', right: isLeft ? '50%' : undefined, zIndex: 1,
                  }} />
                  {/* Card */}
                  <div style={{
                    width: 'calc(50% - 60px)', background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${color}20`, borderRadius: 16, padding: '24px 28px',
                    transition: 'all 0.3s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}40`; e.currentTarget.style.boxShadow = `0 4px 24px ${color}15`; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = `${color}20`; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 8, background: `${color}15`,
                        border: `1px solid ${color}30`, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', color, fontSize: 14,
                      }}>
                        {iconMap[index] || <ClockCircleOutlined />}
                      </div>
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase' }}>{item.year}</span>
                    </div>
                    <h3 style={{ fontSize: 17, fontWeight: '600', color: 'rgba(255,255,255,0.92)', margin: '0 0 6px 0' }}>{item.title}</h3>
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, lineHeight: '1.65', margin: 0 }}>{item.description}</p>
                    {isLoggedIn && (
                      <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                        <Button icon={<EditOutlined />} size="small" onClick={() => handleEditTimeline(item, index)}>Edit</Button>
                        <Button icon={<DeleteOutlined />} size="small" danger onClick={() => handleDeleteTimeline(index)}>Delete</Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Contact CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            style={{ marginTop: 48, textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 24, padding: '48px 32px' }}>
            <h3 style={{ fontSize: 28, fontWeight: '700', marginBottom: 20, color: 'rgba(255,255,255,0.92)' }}>Let's Connect</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href={`mailto:${personalInfo.email}`} style={{ color: '#06d6a0' }}>{personalInfo.email}</a>
              <span className="hidden sm:inline" style={{ color: 'rgba(255,255,255,0.15)' }}>●</span>
              <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: '#4cc9f0' }}>LinkedIn</a>
              <span className="hidden sm:inline" style={{ color: 'rgba(255,255,255,0.15)' }}>●</span>
              <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" style={{ color: '#7b5ea7' }}>GitHub</a>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Edit/Add Timeline Modal */}
      <Modal
        title={editModal.index !== null ? 'Edit Timeline Entry' : 'Add Timeline Entry'}
        open={editModal.open}
        onCancel={() => setEditModal({ open: false, item: null, index: null })}
        footer={null}
      >
        <Form form={form} onFinish={handleTimelineSubmit} layout="vertical">
          <Form.Item name="year" label="Year" rules={[{ required: true }]}>
            <Input placeholder="e.g., 2024" />
          </Form.Item>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input placeholder="e.g., Started Web Development" />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <TextArea rows={3} placeholder="Describe what happened..." />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {editModal.index !== null ? 'Update Entry' : 'Add Entry'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
