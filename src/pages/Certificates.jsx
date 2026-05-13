import { motion } from 'framer-motion';
import { Card, Button, Modal, Form, Input, DatePicker, message, Tag, Empty, Upload, Image } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, LinkOutlined, SafetyCertificateOutlined, UploadOutlined, FileImageOutlined } from '@ant-design/icons';
import { usePortfolioStore } from '../store/portfolioStore';
import { useAuthStore } from '../store/authStore';
import { useState, useEffect } from 'react';

const accentColors = ['#06d6a0', '#4cc9f0', '#7b5ea7', '#f72585', '#ffd60a', '#ff6b6b'];

const getCertificateImage = (url) => {
  if (!url) return '';
  if (url.startsWith('data:') || url.startsWith('/')) return url;
  return `/api/image-proxy?url=${encodeURIComponent(url)}`;
};

const getCertificatePreviewImage = (cert, uploadedImage = '') => {
  if (uploadedImage) return uploadedImage;
  return getCertificateImage(cert?.image || cert?.url || '');
};

export default function Certificates() {
  const { data, addCertificate, updateCertificate, deleteCertificate } = usePortfolioStore();
  const { isLoggedIn } = useAuthStore();
  const certificates = data.certificates || [];
  const [detailsModal, setDetailsModal] = useState({ open: false, certificate: null });
  const [editModal, setEditModal] = useState({ open: false, certificate: null });
  const [form] = Form.useForm();
  const [uploadingImage, setUploadingImage] = useState(false);
  const [certImages, setCertImages] = useState({});
  const [closeHovered, setCloseHovered] = useState(false);

  const handleImageUpload = async (file, certId) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      message.error('Only JPEG, PNG, and WebP images are allowed');
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      message.error('Image must be under 5MB');
      return false;
    }
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch(`/api/certificate-image/${certId}`, { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Upload failed');
      message.success('Certificate image uploaded!');
      setCertImages(prev => ({ ...prev, [certId]: `/api/certificate-image/${certId}?t=${Date.now()}` }));
    } catch (err) {
      message.error(err.message);
    }
    setUploadingImage(false);
    return false;
  };

  const handleDeleteImage = async (certId) => {
    try {
      await fetch(`/api/certificate-image/${certId}`, { method: 'DELETE' });
      setCertImages(prev => { const n = { ...prev }; delete n[certId]; return n; });
      message.success('Image removed');
    } catch (err) {
      message.error('Failed to delete image');
    }
  };

  const handleEdit = (cert) => {
    form.setFieldsValue({ ...cert });
    setEditModal({ open: true, certificate: cert });
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Delete Certificate',
      content: 'Are you sure you want to delete this certificate?',
      okText: 'Delete',
      okType: 'danger',
      onOk: () => { deleteCertificate(id); message.success('Certificate deleted'); },
    });
  };

  const handleSubmit = (values) => {
    if (editModal.certificate) {
      updateCertificate(editModal.certificate.id, values);
      message.success('Certificate updated!');
    } else {
      addCertificate(values);
      message.success('Certificate added!');
    }
    setEditModal({ open: false, certificate: null });
    form.resetFields();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <div className="min-h-screen relative" style={{ background: '#0a0a0f', overflow: 'hidden' }}>
      <div className="orb orb-1" />
      <div className="orb orb-3" />
      <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8 relative z-10">
        <motion.div initial="hidden" animate="visible" variants={containerVariants}>
          {/* Header */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
            <div>
              <p style={{ color: '#06d6a0', fontSize: 14, fontWeight: '500', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 12 }}>
                Achievements & Credentials
              </p>
              <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: '800', color: 'rgba(255,255,255,0.92)', letterSpacing: '-1px', margin: 0 }}>
                Certificates
              </h1>
            </div>
            {isLoggedIn && (
              <Button icon={<PlusOutlined />} type="primary" size="large"
                onClick={() => { form.resetFields(); setEditModal({ open: true, certificate: null }); }}>
                Add Certificate
              </Button>
            )}
          </motion.div>

          {/* Certificates Grid */}
          {certificates.length === 0 ? (
            <motion.div variants={itemVariants} style={{ textAlign: 'center', padding: '80px 0' }}>
              <Empty
                image={<SafetyCertificateOutlined style={{ fontSize: 64, color: 'rgba(255,255,255,0.15)' }} />}
                description={<span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 16 }}>No certificates added yet</span>}
              />
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((cert, index) => {
                const color = accentColors[index % accentColors.length];
                return (
                  <motion.div key={cert.id} variants={itemVariants}>
                    <motion.div whileHover={{ y: -6, scale: 1.02 }} transition={{ duration: 0.3 }}>
                      <Card
                        hoverable
                        onClick={() => setDetailsModal({ open: true, certificate: cert })}
                        style={{ borderRadius: 20, overflow: 'hidden', border: `1px solid ${color}18`, height: '100%', cursor: 'pointer' }}
                        styles={{ body: { padding: 0, display: 'flex', flexDirection: 'column', height: '100%' } }}
                      >
                        {/* Certificate Image */}
                        {getCertificatePreviewImage(cert, certImages[cert.id]) ? (
                          <div style={{ position: 'relative', width: '100%', height: 180, overflow: 'hidden' }}>
                            <img
                              src={getCertificatePreviewImage(cert, certImages[cert.id])}
                              alt={cert.title}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                            <div style={{
                              position: 'absolute', inset: 0,
                              background: 'linear-gradient(180deg, transparent 40%, rgba(10,10,15,0.85) 100%)',
                            }} />
                          </div>
                        ) : (
                          <div style={{
                            width: '100%', height: 80,
                            background: `linear-gradient(135deg, ${color}12, ${color}06)`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <SafetyCertificateOutlined style={{ fontSize: 28, color: `${color}40` }} />
                          </div>
                        )}

                        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                        {/* Icon & Issuer */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                          <div style={{
                            width: 44, height: 44, borderRadius: 12,
                            background: `${color}12`, border: `1px solid ${color}25`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                          }}>
                            <SafetyCertificateOutlined style={{ fontSize: 20, color }} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: '500', letterSpacing: 0.5 }}>
                              {cert.issuer}
                            </p>
                          </div>
                        </div>

                        {/* Title */}
                        <h3 style={{ fontSize: 17, fontWeight: '600', color: 'rgba(255,255,255,0.92)', marginBottom: 8, lineHeight: 1.4 }}>
                          {cert.title}
                        </h3>

                        {/* Date & Credential */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                          {cert.date && (
                            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.04)', padding: '3px 10px', borderRadius: 6 }}>
                              {cert.date}
                            </span>
                          )}
                          {cert.credentialId && (
                            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.03)', padding: '3px 10px', borderRadius: 6 }}>
                              ID: {cert.credentialId}
                            </span>
                          )}
                        </div>

                        {/* Description */}
                        {cert.description && (
                          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: 1.65, marginBottom: 14, flex: 1 }}>
                            {cert.description}
                          </p>
                        )}

                        {/* Skills Tags */}
                        {cert.skills && cert.skills.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                            {cert.skills.map((skill, i) => (
                              <Tag key={i} style={{ background: `${color}10`, border: `1px solid ${color}25`, color, borderRadius: 6, fontSize: 11 }}>
                                {skill}
                              </Tag>
                            ))}
                          </div>
                        )}

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                          {cert.url && (
                            <Button type="link" icon={<LinkOutlined />} href={cert.url} target="_blank"
                              style={{ padding: 0, color, fontSize: 13 }}>
                              View Certificate
                            </Button>
                          )}
                          {isLoggedIn && (
                            <div style={{ display: 'flex', gap: 6, marginLeft: 'auto' }}>
                              <Button icon={<EditOutlined />} size="small" onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(cert);
                              }} />
                              <Button icon={<DeleteOutlined />} size="small" danger onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(cert.id);
                              }} />
                            </div>
                          )}
                        </div>
                        </div>
                      </Card>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* Certificate Details Modal */}
      <Modal
        title={null}
        open={detailsModal.open}
        onCancel={() => setDetailsModal({ open: false, certificate: null })}
        footer={null}
        width={800}
        centered
        closeIcon={
          <span
            onMouseEnter={() => setCloseHovered(true)}
            onMouseLeave={() => setCloseHovered(false)}
            style={{
              color: closeHovered ? '#ff4d4f' : 'rgba(255,255,255,0.55)',
              fontSize: 20,
              transition: 'color 0.2s ease',
            }}
          >
            ✕
          </span>
        }
        styles={{
          mask: {
            background: 'rgba(7, 10, 16, 0.72)',
            backdropFilter: 'blur(9px)',
            WebkitBackdropFilter: 'blur(9px)',
          },
          content: {
            background: 'linear-gradient(180deg, rgba(14, 18, 27, 0.94), rgba(11, 15, 23, 0.98))',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16,
          },
          body: {
            padding: 24,
          },
        }}
      >
        {detailsModal.certificate && (
          <div>
            <div style={{
              height: '320px',
              background: `linear-gradient(135deg, rgba(6, 214, 160, 0.12), rgba(76, 201, 240, 0.12))`,
              borderRadius: '12px',
              marginBottom: '20px',
              border: '1px solid rgba(255,255,255,0.08)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {getCertificatePreviewImage(detailsModal.certificate, certImages[detailsModal.certificate.id]) ? (
                <img
                  src={getCertificatePreviewImage(detailsModal.certificate, certImages[detailsModal.certificate.id])}
                  alt={detailsModal.certificate.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <SafetyCertificateOutlined style={{ fontSize: 48, color: 'rgba(255,255,255,0.45)' }} />
              )}
            </div>
            <h2 style={{ color: 'rgba(255,255,255,0.95)', fontSize: 28, marginBottom: 8 }}>
              {detailsModal.certificate.title}
            </h2>
            <p style={{ color: '#06d6a0', fontWeight: 600, marginBottom: 16 }}>
              {detailsModal.certificate.issuer}
            </p>
            {detailsModal.certificate.date && (
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginBottom: 12 }}>
                Earned: {detailsModal.certificate.date}
              </p>
            )}
            {detailsModal.certificate.description && (
              <p style={{ fontSize: '15px', marginBottom: '16px', color: 'rgba(255, 255, 255, 0.72)', lineHeight: '1.7' }}>
                {detailsModal.certificate.description}
              </p>
            )}
            {detailsModal.certificate.credentialId && (
              <p style={{ fontSize: '13px', marginBottom: '16px', color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: 8 }}>
                Credential ID: <strong>{detailsModal.certificate.credentialId}</strong>
              </p>
            )}
            {detailsModal.certificate.skills && detailsModal.certificate.skills.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <strong style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Skills:</strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                  {detailsModal.certificate.skills.map((skill, i) => (
                    <Tag key={i} color="cyan">{skill}</Tag>
                  ))}
                </div>
              </div>
            )}
            <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
              {detailsModal.certificate.url && (
                <Button icon={<LinkOutlined />} type="primary" href={detailsModal.certificate.url} target="_blank">
                  View Certificate
                </Button>
              )}
              {isLoggedIn && (
                <>
                  <Button icon={<EditOutlined />} onClick={() => {
                    setDetailsModal({ open: false, certificate: null });
                    handleEdit(detailsModal.certificate);
                  }}>
                    Edit
                  </Button>
                  <Button icon={<DeleteOutlined />} danger onClick={() => {
                    setDetailsModal({ open: false, certificate: null });
                    handleDelete(detailsModal.certificate.id);
                  }}>
                    Delete
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Add/Edit Modal */}
      <Modal
        title={editModal.certificate ? 'Edit Certificate' : 'Add Certificate'}
        open={editModal.open}
        onCancel={() => { setEditModal({ open: false, certificate: null }); form.resetFields(); }}
        footer={null}
        width={600}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical"
          initialValues={editModal.certificate || {}}>
          {/* Hidden ID field to preserve certificate ID on edit */}
          <Form.Item name="id" style={{ display: 'none' }}>
            <Input type="hidden" />
          </Form.Item>
          <Form.Item name="title" label="Certificate Title" rules={[{ required: true, message: 'Please enter the certificate title' }]}>
            <Input placeholder="e.g. AWS Solutions Architect Associate" />
          </Form.Item>
          <Form.Item name="issuer" label="Issuing Organization" rules={[{ required: true, message: 'Please enter the issuer' }]}>
            <Input placeholder="e.g. Amazon Web Services" />
          </Form.Item>
          <Form.Item name="date" label="Date Earned">
            <Input placeholder="e.g. Jan 2025" />
          </Form.Item>
          <Form.Item name="credentialId" label="Credential ID">
            <Input placeholder="e.g. ABC123XYZ" />
          </Form.Item>
          <Form.Item name="url" label="Certificate URL">
            <Input prefix={<LinkOutlined />} placeholder="https://..." />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} placeholder="Brief description of the certificate..." />
          </Form.Item>
          <Form.Item name="image" label="Certificate Image URL (Google Drive or External)">
            <Input placeholder="https://... or Google Drive link" />
          </Form.Item>

          {/* Image Upload — shown after certificate is created */}
          {editModal.certificate && (
            <Form.Item label="Uploaded Certificate Image">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {certImages[editModal.certificate.id] ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
                    <img
                      src={certImages[editModal.certificate.id]}
                      alt="Certificate"
                      style={{ width: 80, height: 56, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)' }}
                    />
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>Image uploaded</span>
                    <Button size="small" danger onClick={() => handleDeleteImage(editModal.certificate.id)}>
                      Remove
                    </Button>
                  </div>
                ) : (
                  <Upload
                    accept="image/jpeg,image/png,image/webp"
                    showUploadList={false}
                    beforeUpload={(file) => handleImageUpload(file, editModal.certificate.id)}
                  >
                    <Button icon={<UploadOutlined />} loading={uploadingImage}>
                      Upload Image (JPEG/PNG/WebP, max 5MB)
                    </Button>
                  </Upload>
                )}
              </div>
              <p style={{ margin: '6px 0 0', color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>
                Upload a screenshot or photo of your certificate
              </p>
            </Form.Item>
          )}
          <Form.Item name="skills" label="Related Skills (comma-separated)">
            <Input placeholder="e.g. AWS, Cloud Computing, DevOps" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              {editModal.certificate ? 'Update Certificate' : 'Add Certificate'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
