import { motion } from 'framer-motion';
import { useState } from 'react';
import { Card, Button, Tag, Modal, Tabs, Input, Form, Space, message, Select } from 'antd';
import {
  GithubOutlined,
  LinkOutlined,
  PictureOutlined,
  CloseOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { usePortfolioStore } from '../store/portfolioStore';
import { useAuthStore } from '../store/authStore';

const { TextArea } = Input;

export default function Projects() {
  const { data, addProject, updateProject, deleteProject } = usePortfolioStore();
  const { isLoggedIn } = useAuthStore();
  const { projects } = data;

  const [filter, setFilter] = useState('All');
  const [detailsModal, setDetailsModal] = useState({ open: false, project: null });
  const [editModal, setEditModal] = useState({ open: false, project: null });
  const [closeHovered, setCloseHovered] = useState(false);
  const [form] = Form.useForm();

  const categories = ['All', 'Featured', 'Full Stack', 'ML', 'Recent'];

  const filteredProjects = projects.filter(project => {
    if (filter === 'All') return true;
    if (filter === 'Featured') return project.featured;
    if (filter === 'Recent') return project.id > Date.now() - 90 * 24 * 60 * 60 * 1000;
    return project.category === filter;
  });

  const handleEdit = (project) => {
    form.setFieldsValue({
      ...project,
      tech: project.tech.join(', ')
    });
    setEditModal({ open: true, project });
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Delete Project',
      content: 'Are you sure you want to delete this project?',
      okText: 'Delete',
      okType: 'danger',
      onOk: () => {
        deleteProject(id);
        message.success('Project deleted');
      }
    });
  };

  const handleSubmit = (values) => {
    const projectData = {
      ...values,
      tech: values.tech.split(',').map(t => t.trim()),
      featured: values.featured === 'true'
    };

    if (editModal.project) {
      updateProject(editModal.project.id, projectData);
      message.success('Project updated!');
    } else {
      addProject(projectData);
      message.success('Project added!');
    }

    setEditModal({ open: false, project: null });
    form.resetFields();
  };

  const openAddModal = () => {
    form.resetFields();
    setEditModal({ open: true, project: null });
  };

  const getProjectImage = (url) => {
    if (!url) return '';
    if (url.startsWith('data:') || url.startsWith('/')) return url;
    return `/api/image-proxy?url=${encodeURIComponent(url)}`;
  };

  return (
    <div className="min-h-screen relative" style={{ background: '#0a0a0f' }}>
      <div className="orb orb-3" />

      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <p style={{
                color: '#06d6a0',
                fontSize: '14px',
                fontWeight: '500',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                marginBottom: '12px',
              }}>
                My work
              </p>
              <h1 style={{
                fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                fontWeight: '800',
                color: 'rgba(255, 255, 255, 0.92)',
                letterSpacing: '-1px',
                margin: 0,
              }}>
                Projects
              </h1>
            </div>
            {isLoggedIn && (
              <Button
                icon={<PlusOutlined />}
                type="primary"
                size="large"
                onClick={openAddModal}
              >
                Add Project
              </Button>
            )}
          </div>

          {/* Filter Tabs */}
          <Tabs
            activeKey={filter}
            onChange={setFilter}
            items={categories.map(cat => ({
              key: cat,
              label: cat
            }))}
            className="mb-8"
          />

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ alignItems: 'stretch' }}>
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    hoverable
                    onClick={() => setDetailsModal({ open: true, project })}
                    style={{
                      cursor: 'pointer',
                      borderRadius: '16px',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                    bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px' }}
                  >
                    <div style={{
                      height: '160px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      marginBottom: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      background: 'linear-gradient(135deg, rgba(6, 214, 160, 0.12), rgba(76, 201, 240, 0.12))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {project.image ? (
                        <img
                          src={getProjectImage(project.image)}
                          alt={project.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <PictureOutlined style={{ fontSize: '32px', color: 'rgba(255, 255, 255, 0.35)' }} />
                      )}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '12px',
                      }}>
                        <h3 style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          color: 'rgba(255, 255, 255, 0.92)',
                          margin: 0,
                        }}>
                          {project.title}
                        </h3>
                        {project.featured && (
                          <Tag color="cyan">Featured</Tag>
                        )}
                      </div>

                      <p style={{
                        color: '#06d6a0',
                        fontWeight: '500',
                        fontSize: '13px',
                        marginBottom: '8px',
                      }}>
                        {project.impact}
                      </p>

                      <p style={{
                        color: 'rgba(255, 255, 255, 0.5)',
                        fontSize: '14px',
                        lineHeight: '1.6',
                        marginBottom: '16px',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}>
                        {project.description}
                      </p>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                        {project.tech.slice(0, 5).map((tech, i) => (
                          <Tag key={i} color="blue">{tech}</Tag>
                        ))}
                        {project.tech.length > 5 && (
                          <Tag>+{project.tech.length - 5}</Tag>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', flexWrap: 'wrap' }}>
                      <Button
                        icon={<GithubOutlined />}
                        href={project.github}
                        target="_blank"
                        onClick={(e) => e.stopPropagation()}
                        style={{ flex: 1 }}
                        size="small"
                      >
                        Code
                      </Button>
                      {project.demo && (
                        <Button
                          icon={<LinkOutlined />}
                          type="primary"
                          href={project.demo}
                          target="_blank"
                          onClick={(e) => e.stopPropagation()}
                          style={{ flex: 1 }}
                          size="small"
                        >
                          Demo
                        </Button>
                      )}
                    </div>

                    {isLoggedIn && (
                      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                        <Button
                          icon={<EditOutlined />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(project);
                          }}
                          style={{ flex: 1 }}
                          size="small"
                        >
                          Edit
                        </Button>
                        <Button
                          icon={<DeleteOutlined />}
                          danger
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(project.id);
                          }}
                          style={{ flex: 1 }}
                          size="small"
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div style={{ textAlign: 'center', padding: '64px 0' }}>
              <p style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '16px' }}>
                No projects found in this category.
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Case Study Modal */}
      <Modal
        title={null}
        open={detailsModal.open}
        onCancel={() => setDetailsModal({ open: false, project: null })}
        footer={null}
        width={920}
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
            <CloseOutlined />
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
        {detailsModal.project && (
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
              {detailsModal.project.image ? (
                <img
                  src={getProjectImage(detailsModal.project.image)}
                  alt={detailsModal.project.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <PictureOutlined style={{ fontSize: 48, color: 'rgba(255,255,255,0.45)' }} />
              )}
            </div>
            <h2 style={{ color: 'rgba(255,255,255,0.95)', fontSize: 28, marginBottom: 8 }}>
              {detailsModal.project.title}
            </h2>
            <p style={{ color: '#06d6a0', fontWeight: 600, marginBottom: 16 }}>
              {detailsModal.project.impact}
            </p>
            <p style={{ fontSize: '15px', marginBottom: '16px', color: 'rgba(255, 255, 255, 0.72)', lineHeight: '1.7' }}>
              {detailsModal.project.description}
            </p>
            <p style={{ fontSize: '16px', marginBottom: '20px', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.7' }}>
              {detailsModal.project.details}
            </p>
            <div style={{ marginBottom: '20px' }}>
              <strong style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Technologies:</strong>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                {detailsModal.project.tech.map((tech, i) => (
                  <Tag key={i} color="blue">{tech}</Tag>
                ))}
              </div>
            </div>
            <Space>
              <Button icon={<GithubOutlined />} href={detailsModal.project.github} target="_blank">
                View Code
              </Button>
              {detailsModal.project.demo && (
                <Button icon={<LinkOutlined />} type="primary" href={detailsModal.project.demo} target="_blank">
                  Live Demo
                </Button>
              )}
            </Space>
          </div>
        )}
      </Modal>

      {/* Edit/Add Modal */}
      <Modal
        title={editModal.project ? 'Edit Project' : 'Add New Project'}
        open={editModal.open}
        onCancel={() => setEditModal({ open: false, project: null })}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <TextArea rows={3} />
          </Form.Item>

          <Form.Item name="details" label="Detailed Description" rules={[{ required: true }]}>
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item name="impact" label="Impact Metric" rules={[{ required: true }]}>
            <Input placeholder="e.g., Reduced load time by 80%" />
          </Form.Item>

          <Form.Item name="tech" label="Technologies (comma-separated)" rules={[{ required: true }]}>
            <Input placeholder="React, Node.js, MongoDB" />
          </Form.Item>

          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="Full Stack">Full Stack</Select.Option>
              <Select.Option value="ML">ML</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="github" label="GitHub URL" rules={[{ required: true, type: 'url' }]}>
            <Input />
          </Form.Item>

          <Form.Item name="image" label="Project Image URL" rules={[{ type: 'url', message: 'Enter a valid image URL' }]}>
            <Input placeholder="https://..." />
          </Form.Item>

          <Form.Item name="demo" label="Demo URL">
            <Input />
          </Form.Item>

          <Form.Item name="featured" label="Featured" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="true">Yes</Select.Option>
              <Select.Option value="false">No</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {editModal.project ? 'Update Project' : 'Add Project'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
