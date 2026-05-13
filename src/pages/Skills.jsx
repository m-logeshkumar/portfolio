import { motion } from 'framer-motion';
import { Card, Button, Modal, Form, Input, message } from 'antd';
import { PlusOutlined, DeleteOutlined, SaveOutlined, EditOutlined } from '@ant-design/icons';
import { usePortfolioStore } from '../store/portfolioStore';
import { useAuthStore } from '../store/authStore';
import { useEffect, useState } from 'react';

const categoryColors = {
  Languages: '#06d6a0',
  'Web Technologies': '#4cc9f0',
  Databases: '#7b5ea7',
  'Tools & Environments': '#f72585',
};

const fallbackColors = ['#06d6a0', '#4cc9f0', '#7b5ea7', '#f72585', '#ffd60a', '#ff6b6b'];

const skillDeviconMeta = {
  C: 'devicon-c-plain',
  'C++': 'devicon-cplusplus-plain',
    'C#': 'devicon-csharp-plain',
    Java: 'devicon-java-plain',
    JavaScript: 'devicon-javascript-plain',
    Python: 'devicon-python-plain',
    R: 'devicon-r-original',
    PHP: 'devicon-php-plain',
    TypeScript: 'devicon-typescript-plain',
    Go: 'devicon-go-plain',
    Rust: 'devicon-rust-plain',
    React: 'devicon-react-original',
    'Node.js': 'devicon-nodejs-line',
    'Express': 'devicon-express-original',
    'Express.js': 'devicon-express-original',
    HTML5: 'devicon-html5-plain',
    CSS3: 'devicon-css3-plain',
    'Tailwind CSS': 'devicon-tailwindcss-original',
    'Vue.js': 'devicon-vuejs-plain',
    Angular: 'devicon-angularjs-plain',
    'Next.js': 'devicon-nextjs-plain',
    'REST APIs': 'devicon-swagger-plain',
    MySQL: 'devicon-mysql-plain',
    MongoDB: 'devicon-mongodb-plain',
    'Oracle DB': 'devicon-oracle-original',
    PostgreSQL: 'devicon-postgresql-plain',
    Firebase: 'devicon-firebase-plain',
    Redis: 'devicon-redis-plain',
    DynamoDB: 'devicon-amazonwebservices-original',
    Git: 'devicon-git-plain',
    GitHub: 'devicon-github-original',
    'VS Code': 'devicon-vscode-plain',
    Docker: 'devicon-docker-plain',
    Kubernetes: 'devicon-kubernetes-plain',
    Jenkins: 'devicon-jenkins-plain',
    Linux: 'devicon-linux-plain',
    AWS: 'devicon-amazonwebservices-original',
    Azure: 'devicon-azure-plain',
    GCP: 'devicon-googlecloud-plain',
    Figma: 'devicon-figma-plain',
    Jira: 'devicon-jira-plain',
    Unity: 'devicon-unity-original',
    'Android Studio': 'devicon-android-plain',
    Postman: 'devicon-postman-plain',
    XAMPP: 'devicon-apache-plain',
    Canva: 'devicon-canva-original',
  };

  const skillDeviconTone = {
    GitHub: 'invert',
    'Express.js': 'invert',
    Express: 'invert',
    'Node.js': 'soft',
    'Oracle DB': 'invert',
    'Next.js': 'invert',
    Unity: 'invert',
    'VS Code': 'invert',
  };

  const skillFallbackLabels = {
    Express: 'EX',
    'Express.js': 'EX',
    'REST APIs': 'API',
    GitHub: 'GH',
  };

  const getSkillDeviconMeta = (skillName) => ({
    className: skillDeviconMeta[skillName] || 'devicon-code-plain',
    tone: skillDeviconTone[skillName] || 'colored',
    fallbackLabel: skillFallbackLabels[skillName] || skillName.slice(0, 2).toUpperCase(),
  });

  export default function Skills() {
    const { data, updateSkills } = usePortfolioStore();
    const { isLoggedIn } = useAuthStore();
    const { skills } = data;

    const [editingSkills, setEditingSkills] = useState(() => JSON.parse(JSON.stringify(skills)));
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [editingSkillIndex, setEditingSkillIndex] = useState(null);
    const [editingComponentIndex, setEditingComponentIndex] = useState(null);
    const [componentModalOpen, setComponentModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [componentForm] = Form.useForm();

    useEffect(() => {
      setEditingSkills(JSON.parse(JSON.stringify(skills)));
    }, [skills]);

    const handleSave = () => {
      updateSkills(editingSkills);
      message.success('Skills updated successfully!');
    };

    const handleAddSkill = (category) => {
      setEditingCategory(category);
      setEditingSkillIndex(null);
      form.resetFields();
      setIsModalOpen(true);
    };

    const handleAddComponent = () => {
      setEditingComponentIndex(null);
      componentForm.resetFields();
      componentForm.setFieldsValue({
        category: '',
        color: fallbackColors[editingSkills.length % fallbackColors.length],
      });
      setComponentModalOpen(true);
    };

    const handleEditComponent = (componentIndex) => {
      const component = editingSkills[componentIndex];
      if (!component) return;
      setEditingComponentIndex(componentIndex);
      componentForm.setFieldsValue({
        category: component.category,
        color: component.color || categoryColors[component.category] || fallbackColors[componentIndex % fallbackColors.length],
      });
      setComponentModalOpen(true);
    };

    const handleDeleteCategory = (category) => {
      Modal.confirm({
        title: 'Delete Skill Category',
        content: 'Are you sure you want to delete this entire skill category?',
        okText: 'Delete',
        okType: 'danger',
        onOk: () => {
          setEditingSkills((prev) => prev.filter((cat) => cat.category !== category));
          message.success('Category deleted');
        },
      });
    };

    const handleSubmitComponent = (values) => {
      if (editingComponentIndex !== null) {
        setEditingSkills((prev) =>
          prev.map((component, index) =>
            index === editingComponentIndex
              ? { ...component, color: values.color }
              : component
          )
        );
        message.success('Component updated!');
      } else {
        const nextComponent = {
          category: values.category.trim(),
          color: values.color,
          items: [],
        };
        setEditingSkills((prev) => [...prev, nextComponent]);
        message.success('Component added!');
      }

      setComponentModalOpen(false);
    };

    const handleEditSkill = (category, skillIndex) => {
      const skill = editingSkills.find((entry) => entry.category === category)?.items[skillIndex];
      if (skill) {
        setEditingCategory(category);
        setEditingSkillIndex(skillIndex);
        form.setFieldsValue(skill);
        setIsModalOpen(true);
      }
    };

    const handleDeleteSkill = (category, skillIndex) => {
      Modal.confirm({
        title: 'Delete Skill',
        content: 'Are you sure you want to delete this skill?',
        okText: 'Delete',
        okType: 'danger',
        onOk: () => {
          setEditingSkills((prev) =>
            prev.map((cat) =>
              cat.category === category
                ? { ...cat, items: cat.items.filter((_, i) => i !== skillIndex) }
                : cat
            )
          );
          message.success('Skill deleted');
        },
      });
    };

    const handleSubmitSkill = (values) => {
      setEditingSkills((prev) =>
        prev.map((cat) =>
          cat.category === editingCategory
            ? {
                ...cat,
                items:
                  editingSkillIndex !== null
                    ? cat.items.map((item, i) => (i === editingSkillIndex ? values : item))
                    : [...cat.items, values],
              }
            : cat
        )
      );
      setIsModalOpen(false);
      message.success(editingSkillIndex !== null ? 'Skill updated!' : 'Skill added!');
    };

    const displaySkills = isLoggedIn ? editingSkills : skills;

    return (
      <div className="min-h-screen relative" style={{ background: '#0a0a0f', overflow: 'hidden' }}>
        <div className="orb orb-1" />
        <div className="orb orb-3" />

        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
            <div className="flex justify-between items-start sm:items-center mb-12 gap-4 flex-col sm:flex-row">
              <div>
                <p style={{ color: '#06d6a0', fontSize: '14px', fontWeight: '500', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>
                  What I work with
                </p>
                <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: '800', color: 'rgba(255, 255, 255, 0.92)', letterSpacing: '-1px', margin: 0 }}>
                  Technical Skills
                </h1>
              </div>
              {isLoggedIn && (
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <Button icon={<PlusOutlined />} type="default" size="large" onClick={handleAddComponent}>
                    Add Component
                  </Button>
                  <Button icon={<SaveOutlined />} type="primary" size="large" onClick={handleSave}>
                    Save Changes
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {displaySkills.map((category, categoryIndex) => {
                const color = category.color || categoryColors[category.category] || fallbackColors[categoryIndex % fallbackColors.length];
                return (
                  <motion.div key={categoryIndex} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: categoryIndex * 0.1 }}>
                    <Card
                      title={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: color, boxShadow: `0 0 12px ${color}70` }} />
                          <span style={{ fontSize: '20px', fontWeight: '700', color: 'rgba(255, 255, 255, 0.92)' }}>
                            {category.category}
                          </span>
                        </div>
                      }
                      extra={isLoggedIn && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <Button size="small" onClick={() => handleEditComponent(categoryIndex)}>
                            Edit Component
                          </Button>
                          <Button icon={<PlusOutlined />} size="small" onClick={() => handleAddSkill(category.category)}>
                            Add
                          </Button>
                          <Button danger icon={<DeleteOutlined />} size="small" onClick={() => handleDeleteCategory(category.category)}>
                            Delete
                          </Button>
                        </div>
                      )}
                      style={{ borderRadius: '20px', border: `1px solid ${color}20`, height: '100%' }}
                      bodyStyle={{ padding: '24px' }}
                    >
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
                        gap: '12px',
                      }}>
                        {category.items.map((skill, skillIndex) => (
                          <motion.div key={skillIndex} whileHover={isLoggedIn ? { scale: 1.05 } : {}} style={{ position: 'relative' }}>
                            <div
                              className="skill-badge"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '14px 16px',
                                borderRadius: '16px',
                                background: `${color}12`,
                                border: `1.5px solid ${color}38`,
                                boxShadow: `0 0 0 1px ${color}12 inset, 0 12px 28px rgba(0,0,0,0.18)`,
                                color: 'rgba(255, 255, 255, 0.9)',
                                fontSize: '15px',
                                fontWeight: '600',
                                cursor: isLoggedIn ? 'pointer' : 'default',
                                transition: 'all 0.3s ease',
                                position: 'relative',
                                minHeight: '68px',
                              }}
                            >
                              <div style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '12px',
                                background: `linear-gradient(180deg, ${color}20, ${color}10)`,
                                border: `1.5px solid ${color}32`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                position: 'relative',
                                boxShadow: `0 8px 18px ${color}14`,
                              }}>
                                {(() => {
                                  const iconMeta = getSkillDeviconMeta(skill.name);
                                  return (
                                    <>
                                      <i
                                        className={iconMeta.className}
                                        style={{
                                          fontSize: '24px',
                                          lineHeight: 1,
                                          color:
                                            iconMeta.tone === 'invert'
                                              ? '#f5f7fb'
                                              : iconMeta.tone === 'soft'
                                                ? '#dff7ea'
                                                : color,
                                          filter:
                                            iconMeta.tone === 'invert'
                                              ? 'invert(1) brightness(1.9) contrast(1.05)'
                                              : iconMeta.tone === 'soft'
                                                ? 'saturate(0.75) brightness(1.05)'
                                                : 'none',
                                        }}
                                      />
                                      {iconMeta.className === 'devicon-code-plain' && (
                                        <span style={{
                                          position: 'absolute',
                                          inset: 0,
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          fontSize: '12px',
                                          fontWeight: '800',
                                          color,
                                          letterSpacing: '0.5px',
                                        }}>
                                          {iconMeta.fallbackLabel}
                                        </span>
                                      )}
                                    </>
                                  );
                                })()}
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
                                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{skill.name}</span>
                                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.42)', marginTop: '2px' }}>
                                  Technology
                                </span>
                              </div>

                              {isLoggedIn && (
                                <div className="skill-actions" style={{ display: 'flex', gap: '4px', marginLeft: 'auto', opacity: 0, transition: 'opacity 0.3s ease' }}>
                                  <Button
                                    icon={<EditOutlined />}
                                    size="small"
                                    type="text"
                                    onClick={() => handleEditSkill(category.category, skillIndex)}
                                    style={{ color: color, padding: '0 4px' }}
                                  />
                                  <Button
                                    icon={<DeleteOutlined />}
                                    size="small"
                                    type="text"
                                    danger
                                    onClick={() => handleDeleteSkill(category.category, skillIndex)}
                                    style={{ padding: '0 4px' }}
                                  />
                                </div>
                              )}
                            </div>

                            <style>{`
                              .skill-badge:hover .skill-actions {
                                opacity: 1 !important;
                              }
                            `}</style>
                          </motion.div>
                        ))}
                      </div>

                      {category.items.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '20px', color: 'rgba(255, 255, 255, 0.3)' }}>
                          No skills added yet
                        </div>
                      )}
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ marginTop: '48px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.04)', borderRadius: '24px', padding: '48px 32px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px', color: 'rgba(255, 255, 255, 0.92)' }}>
                Continuous Learner
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '16px', maxWidth: '600px', margin: '0 auto', lineHeight: '1.7' }}>
                Always exploring new technologies and improving existing skills through hands-on projects and real-world applications.
              </p>
            </motion.div>
          </motion.div>
        </div>

        <Modal title={editingSkillIndex !== null ? 'Edit Skill' : 'Add New Skill'} open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
          <Form form={form} onFinish={handleSubmitSkill} layout="vertical">
            <Form.Item name="name" label="Skill Name" rules={[{ required: true }]}>
              <Input placeholder="e.g., React, MongoDB, Docker" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                {editingSkillIndex !== null ? 'Update Skill' : 'Add Skill'}
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title={editingComponentIndex !== null ? 'Edit Component Color' : 'Add Component'}
          open={componentModalOpen}
          onCancel={() => setComponentModalOpen(false)}
          footer={null}
        >
          <Form form={componentForm} onFinish={handleSubmitComponent} layout="vertical">
            {editingComponentIndex === null ? (
              <Form.Item name="category" label="Component Name" rules={[{ required: true, message: 'Please enter component name' }]}>
                <Input placeholder="e.g., Cloud & DevOps" />
              </Form.Item>
            ) : (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 6 }}>Component Name</div>
                <div style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.88)', background: 'rgba(255,255,255,0.03)' }}>
                  {editingSkills[editingComponentIndex]?.category}
                </div>
              </div>
            )}

            <Form.Item name="color" label="Accent Color" rules={[{ required: true, message: 'Please choose a color' }]}>
              <Input type="color" style={{ height: 44, padding: 4, width: '100%' }} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                {editingComponentIndex !== null ? 'Update Component' : 'Add Component'}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
