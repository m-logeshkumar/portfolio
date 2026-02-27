import { motion } from 'framer-motion';
import { Card, Button, Modal, Form, Input, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { usePortfolioStore } from '../store/portfolioStore';
import { useAuthStore } from '../store/authStore';
import { useState } from 'react';

const { TextArea } = Input;
const dotColors = ['#06d6a0', '#4cc9f0', '#7b5ea7', '#f72585', '#ffd60a'];

export default function Experience() {
  const { data, updateExperience, addExperience, deleteExperience } = usePortfolioStore();
  const { isLoggedIn } = useAuthStore();
  const { experience } = data;
  const [editModal, setEditModal] = useState({ open: false, experience: null });
  const [form] = Form.useForm();

  const handleEdit = (exp) => {
    form.setFieldsValue({ ...exp, bullets: exp.bullets.join('\n') });
    setEditModal({ open: true, experience: exp });
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Delete Experience', content: 'Are you sure?', okText: 'Delete', okType: 'danger',
      onOk: () => { deleteExperience(id); message.success('Deleted'); }
    });
  };

  const handleSubmit = (values) => {
    const expData = { ...values, bullets: values.bullets.split('\n').filter(b => b.trim()) };
    if (editModal.experience) {
      updateExperience(experience.map(e => e.id === editModal.experience.id ? { ...e, ...expData } : e));
      message.success('Updated!');
    } else { addExperience(expData); message.success('Added!'); }
    setEditModal({ open: false, experience: null }); form.resetFields();
  };

  return (
    <div className="min-h-screen relative" style={{ background: '#0a0a0f' }}>
      <div className="orb orb-2" />
      <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
            <div>
              <p style={{ color: '#06d6a0', fontSize: 14, fontWeight: '500', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 12 }}>Where I've worked</p>
              <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: '800', color: 'rgba(255,255,255,0.92)', letterSpacing: '-1px', margin: 0 }}>Experience</h1>
            </div>
            {isLoggedIn && <Button icon={<PlusOutlined />} type="primary" size="large" onClick={() => { form.resetFields(); setEditModal({ open: true, experience: null }); }}>Add Experience</Button>}
          </div>

          {/* Snake / Alternating Timeline */}
          <div style={{ position: 'relative' }}>
            {/* Center vertical line */}
            <div style={{
              position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2,
              background: 'linear-gradient(180deg, #06d6a0, #4cc9f0, #7b5ea7, #f72585)',
              transform: 'translateX(-50%)', borderRadius: 999, opacity: 0.25,
            }} />

            {experience.map((exp, index) => {
              const isLeft = index % 2 === 0;
              const color = dotColors[index % dotColors.length];
              return (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    display: 'flex',
                    justifyContent: isLeft ? 'flex-start' : 'flex-end',
                    position: 'relative',
                    marginBottom: 48,
                  }}
                >
                  {/* Glowing dot on center line */}
                  <div style={{
                    position: 'absolute', left: '50%', top: 28, transform: 'translateX(-50%)',
                    width: 18, height: 18, borderRadius: '50%', background: color,
                    boxShadow: `0 0 18px ${color}60`, zIndex: 2, border: '3px solid #0a0a0f',
                  }} />

                  {/* Horizontal connector line */}
                  <div style={{
                    position: 'absolute', top: 35, height: 2, width: 40, background: `${color}35`,
                    left: isLeft ? undefined : '50%', right: isLeft ? '50%' : undefined, zIndex: 1,
                  }} />

                  {/* Card */}
                  <div style={{
                    width: 'calc(50% - 60px)',
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${color}18`,
                    borderRadius: 16,
                    padding: '28px 28px',
                    transition: 'all 0.35s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}40`; e.currentTarget.style.boxShadow = `0 4px 28px ${color}12`; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = `${color}18`; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    {/* Header row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 12,
                        background: `${color}12`, border: `1px solid ${color}25`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, fontSize: 20, fontWeight: '700', color,
                      }}>
                        {exp.company.charAt(0)}
                      </div>
                      <div>
                        <h3 style={{ fontSize: 17, fontWeight: '600', color: 'rgba(255,255,255,0.92)', margin: 0 }}>{exp.role}</h3>
                        <p style={{ color, fontWeight: '500', fontSize: 13, margin: 0 }}>{exp.company}</p>
                      </div>
                    </div>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: '500', letterSpacing: 0.5, marginBottom: 12 }}>{exp.dates}</p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {exp.bullets.map((bullet, i) => (
                        <li key={i} style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: '1.65', paddingLeft: 14, position: 'relative' }}>
                          <span style={{ position: 'absolute', left: 0, top: 7, width: 4, height: 4, borderRadius: '50%', background: `${color}50` }} />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                    {isLoggedIn && (
                      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                        <Button icon={<EditOutlined />} onClick={() => handleEdit(exp)} size="small">Edit</Button>
                        <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(exp.id)} size="small">Delete</Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            style={{ marginTop: 48, textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 24, padding: '48px 32px' }}>
            <h3 style={{ fontSize: 24, fontWeight: '700', marginBottom: 12, color: 'rgba(255,255,255,0.92)' }}>Looking for Opportunities</h3>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 16, maxWidth: 600, margin: '0 auto', lineHeight: '1.7' }}>Open to full-time roles in Full Stack Development and Machine Learning</p>
          </motion.div>
        </motion.div>
      </div>

      {/* Edit Modal */}
      <Modal title={editModal.experience ? 'Edit Experience' : 'Add Experience'} open={editModal.open}
        onCancel={() => setEditModal({ open: false, experience: null })} footer={null} width={700}>
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item name="company" label="Company" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="dates" label="Dates" rules={[{ required: true }]}><Input placeholder="Jan 2025 - Present" /></Form.Item>
          <Form.Item name="logo" label="Logo URL" rules={[{ required: true, type: 'url' }]}><Input /></Form.Item>
          <Form.Item name="bullets" label="Achievements (one per line)" rules={[{ required: true }]}><TextArea rows={6} /></Form.Item>
          <Form.Item><Button type="primary" htmlType="submit" block>{editModal.experience ? 'Update' : 'Add'}</Button></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
