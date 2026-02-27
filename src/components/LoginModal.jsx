import { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useAuthStore } from '../store/authStore';
import { usePortfolioStore } from '../store/portfolioStore';

export default function LoginModal({ open, onClose, onSuccess }) {
  const { login } = useAuthStore();
  const { setEditMode } = usePortfolioStore();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleLogin = async (values) => {
    setLoading(true);

    setTimeout(() => {
      const success = login(values.username, values.password);

      if (success) {
        message.success('Login successful! Edit mode activated.');
        setEditMode(true);
        form.resetFields();
        if (onSuccess) {
          onSuccess();
        } else {
          onClose();
        }
      } else {
        message.error('Invalid credentials.');
      }

      setLoading(false);
    }, 600);
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={null}
      centered
      width={400}
      closable={true}
      styles={{
        mask: { backdropFilter: 'blur(8px)', background: 'rgba(0, 0, 0, 0.6)' },
      }}
    >
      <div style={{ padding: '16px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(6, 214, 160, 0.15), rgba(76, 201, 240, 0.15))',
              border: '1px solid rgba(6, 214, 160, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <LockOutlined style={{ fontSize: '24px', color: '#06d6a0' }} />
          </div>
          <h2 style={{
            color: 'rgba(255, 255, 255, 0.92)',
            fontSize: '20px',
            fontWeight: '700',
            margin: '0 0 4px 0',
          }}>
            Admin Access
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '14px', margin: 0 }}>
            Enter your credentials to continue
          </p>
        </div>

        <Form
          form={form}
          onFinish={handleLogin}
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please enter username' }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: 'rgba(255, 255, 255, 0.3)' }} />}
              placeholder="Username"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter password' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: 'rgba(255, 255, 255, 0.3)' }} />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <Form.Item className="mb-0">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              block
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}
