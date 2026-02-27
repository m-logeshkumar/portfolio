import { motion } from 'framer-motion';
import { Card, Progress, Slider, Button, Modal, Form, Input, message } from 'antd';
import { PlusOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import { usePortfolioStore } from '../store/portfolioStore';
import { useAuthStore } from '../store/authStore';
import { useState, useEffect } from 'react';

const categoryColors = ['#06d6a0', '#4cc9f0', '#7b5ea7'];

export default function Skills() {
  const { data, updateSkills } = usePortfolioStore();
  const { isLoggedIn } = useAuthStore();
  const { skills } = data;

  const [editingSkills, setEditingSkills] = useState(() => JSON.parse(JSON.stringify(skills)));

  // Re-sync editingSkills whenever the store's skills data changes
  useEffect(() => {
    setEditingSkills(JSON.parse(JSON.stringify(skills)));
  }, [skills]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();

  const handleSave = () => {
    updateSkills(editingSkills);
    message.success('Skills updated successfully!');
  };

  const handleAddSkill = (categoryIndex) => {
    setEditingCategory(categoryIndex);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleDeleteSkill = (categoryIndex, skillIndex) => {
    setEditingSkills(prev => prev.map((cat, ci) =>
      ci === categoryIndex
        ? { ...cat, items: cat.items.filter((_, si) => si !== skillIndex) }
        : cat
    ));
  };

  const handleSubmitSkill = (values) => {
    setEditingSkills(prev => prev.map((cat, ci) =>
      ci === editingCategory
        ? { ...cat, items: [...cat.items, values] }
        : cat
    ));
    setIsModalOpen(false);
    message.success('Skill added!');
  };

  const handleLevelChange = (categoryIndex, skillIndex, value) => {
    setEditingSkills(prev => prev.map((cat, ci) =>
      ci === categoryIndex
        ? {
          ...cat, items: cat.items.map((skill, si) =>
            si === skillIndex ? { ...skill, level: value } : skill
          )
        }
        : cat
    ));
  };

  const displaySkills = isLoggedIn ? editingSkills : skills;

  return (
    <div className="min-h-screen relative" style={{ background: '#0a0a0f' }}>
      <div className="orb orb-1" />

      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex justify-between items-center mb-12">
            <div>
              <p style={{
                color: '#06d6a0',
                fontSize: '14px',
                fontWeight: '500',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                marginBottom: '12px',
              }}>
                What I work with
              </p>
              <h1 style={{
                fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                fontWeight: '800',
                color: 'rgba(255, 255, 255, 0.92)',
                letterSpacing: '-1px',
                margin: 0,
              }}>
                Technical Skills
              </h1>
            </div>
            {isLoggedIn && (
              <Button
                icon={<SaveOutlined />}
                type="primary"
                size="large"
                onClick={handleSave}
              >
                Save Changes
              </Button>
            )}
          </div>

          {/* 3-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displaySkills.map((category, categoryIndex) => {
              const color = categoryColors[categoryIndex % categoryColors.length];
              return (
                <motion.div
                  key={categoryIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: categoryIndex * 0.1 }}
                >
                  <Card
                    title={
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: color,
                          boxShadow: `0 0 10px ${color}60`,
                        }} />
                        <span style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          color: 'rgba(255, 255, 255, 0.92)',
                        }}>
                          {category.category}
                        </span>
                      </div>
                    }
                    extra={
                      isLoggedIn && (
                        <Button
                          icon={<PlusOutlined />}
                          size="small"
                          onClick={() => handleAddSkill(categoryIndex)}
                        >
                          Add
                        </Button>
                      )
                    }
                    style={{ borderRadius: '20px', height: '100%' }}
                    bodyStyle={{ padding: '24px' }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {category.items.map((skill, skillIndex) => (
                        <div key={skillIndex}>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '8px',
                          }}>
                            <span style={{
                              fontWeight: '500',
                              color: 'rgba(255, 255, 255, 0.85)',
                              fontSize: '14px',
                            }}>
                              {skill.name}
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {!isLoggedIn && (
                                <span style={{
                                  fontSize: '13px',
                                  fontWeight: '600',
                                  color: color,
                                  minWidth: '36px',
                                  textAlign: 'right',
                                }}>
                                  {skill.level}%
                                </span>
                              )}

                              {isLoggedIn && (
                                <Button
                                  icon={<DeleteOutlined />}
                                  size="small"
                                  danger
                                  type="text"
                                  onClick={() => handleDeleteSkill(categoryIndex, skillIndex)}
                                />
                              )}
                            </div>
                          </div>

                          {isLoggedIn ? (
                            <Slider
                              value={skill.level}
                              onChange={(value) => handleLevelChange(categoryIndex, skillIndex, value)}
                              tooltip={{ formatter: (value) => `${value}%` }}
                            />
                          ) : (
                            <Progress
                              percent={skill.level}
                              strokeColor={{
                                '0%': color,
                                '100%': color + '80',
                              }}
                              trailColor="rgba(255, 255, 255, 0.04)"
                              showInfo={false}
                              size="small"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              marginTop: '48px',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.04)',
              borderRadius: '24px',
              padding: '48px 32px',
              textAlign: 'center',
            }}
          >
            <h3 style={{
              fontSize: '24px',
              fontWeight: '700',
              marginBottom: '12px',
              color: 'rgba(255, 255, 255, 0.92)',
            }}>
              Continuous Learner
            </h3>
            <p style={{
              color: 'rgba(255, 255, 255, 0.4)',
              fontSize: '16px',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.7',
            }}>
              Always exploring new technologies and improving existing skills through hands-on projects and real-world applications.
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Add Skill Modal */}
      <Modal
        title="Add New Skill"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleSubmitSkill}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Skill Name"
            rules={[{ required: true, message: 'Please enter skill name' }]}
          >
            <Input placeholder="e.g., React" />
          </Form.Item>

          <Form.Item
            name="level"
            label="Proficiency Level (%)"
            rules={[{ required: true, message: 'Please set proficiency level' }]}
            initialValue={70}
          >
            <Slider min={0} max={100} />
          </Form.Item>

          <Form.Item
            name="years"
            label="Years of Experience"
            rules={[{ required: true, message: 'Please enter years' }]}
            initialValue={1}
          >
            <Input type="number" min={0} max={20} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Add Skill
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
