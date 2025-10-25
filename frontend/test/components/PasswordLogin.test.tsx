import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import LoginForm from '../../src/components/LoginForm';

// Mock fetch API
global.fetch = vi.fn();

describe('密码登录功能测试', () => {
  const mockOnLoginSuccess = vi.fn();
  const mockOnNavigateToRegister = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (fetch as any).mockClear();
  });

  test('应该显示密码登录表单', () => {
    render(
      <LoginForm
        onLoginSuccess={mockOnLoginSuccess}
        onNavigateToRegister={mockOnNavigateToRegister}
      />
    );

    // 默认应该显示密码登录模式
    expect(screen.getByPlaceholderText('输入登录密码')).toBeInTheDocument();
    // 使用getAllByText来处理多个"短信登录"文本的情况
    expect(screen.getAllByText('短信登录').length).toBeGreaterThan(0);
  });

  test('应该能够切换到短信登录模式', () => {
    render(
      <LoginForm
        onLoginSuccess={mockOnLoginSuccess}
        onNavigateToRegister={mockOnNavigateToRegister}
      />
    );

    // 点击短信登录按钮 - 使用getAllByText获取所有"短信登录"文本，然后选择第二个（按钮）
    const smsLoginElements = screen.getAllByText('短信登录');
    // 第一个是标签页，第二个是按钮
    const smsLoginButton = smsLoginElements[1];
    fireEvent.click(smsLoginButton);

    // 应该显示验证码输入框
    expect(screen.getByPlaceholderText('输入验证码')).toBeInTheDocument();
    expect(screen.getByText('获取验证码')).toBeInTheDocument();
  });

  test('应该能够输入手机号和密码', () => {
    render(
      <LoginForm
        onLoginSuccess={mockOnLoginSuccess}
        onNavigateToRegister={mockOnNavigateToRegister}
      />
    );

    // 默认应该显示密码登录模式（因为我们设置了默认为password模式）
    expect(screen.getByPlaceholderText('输入登录密码')).toBeInTheDocument();
    // 使用getAllByText来处理多个"短信登录"文本的情况
    expect(screen.getAllByText('短信登录').length).toBeGreaterThan(0);

    const phoneInput = screen.getByPlaceholderText('账号名/邮箱/手机号');
    const passwordInput = screen.getByPlaceholderText('输入登录密码');

    fireEvent.change(phoneInput, { target: { value: '13800138000' } });
    fireEvent.change(passwordInput, { target: { value: 'test123456' } });

    expect(phoneInput.value).toBe('13800138000');
    expect(passwordInput.value).toBe('test123456');
  });

  test('成功的密码登录应该调用正确的API', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({
        success: true,
        data: {
          token: 'mock-token',
          user: { id: '1', phoneNumber: '13800138000' }
        }
      })
    };
    
    (global.fetch as any).mockResolvedValueOnce(mockResponse);

    render(
      <LoginForm
        onLoginSuccess={mockOnLoginSuccess}
        onNavigateToRegister={mockOnNavigateToRegister}
      />
    );

    const phoneInput = screen.getByPlaceholderText('账号名/邮箱/手机号');
    const passwordInput = screen.getByPlaceholderText('输入登录密码');
    const loginButton = screen.getByText('登录');

    fireEvent.change(phoneInput, { target: { value: '13800138000' } });
    fireEvent.change(passwordInput, { target: { value: 'test123456' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/auth/login-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: '13800138000',
          password: 'test123456'
        }),
      });
    });

    await waitFor(() => {
      expect(mockOnLoginSuccess).toHaveBeenCalledWith({
        token: 'mock-token',
        user: { id: '1', phoneNumber: '13800138000' }
      });
    });
  });

  test('密码登录失败应该显示错误信息', async () => {
    const mockResponse = {
      ok: false,
      json: async () => ({
        success: false,
        message: '用户名或密码错误'
      })
    };
    
    (global.fetch as any).mockResolvedValueOnce(mockResponse);

    render(
      <LoginForm
        onLoginSuccess={mockOnLoginSuccess}
        onNavigateToRegister={mockOnNavigateToRegister}
      />
    );

    const phoneInput = screen.getByPlaceholderText('账号名/邮箱/手机号');
    const passwordInput = screen.getByPlaceholderText('输入登录密码');
    const loginButton = screen.getByText('登录');

    fireEvent.change(phoneInput, { target: { value: '13800138000' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('用户名或密码错误')).toBeInTheDocument();
    });
  });

  test('应该验证必填字段', async () => {
    render(
      <LoginForm
        onLoginSuccess={mockOnLoginSuccess}
        onNavigateToRegister={mockOnNavigateToRegister}
      />
    );

    const loginButton = screen.getByText('登录');

    // 不填写任何信息直接点击登录
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('手机号不能为空')).toBeInTheDocument();
    });

    // 只填写手机号
    const phoneInput = screen.getByPlaceholderText('账号名/邮箱/手机号');
    fireEvent.change(phoneInput, { target: { value: '13800138000' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('密码不能为空')).toBeInTheDocument();
    });
  });

  test('应该验证手机号格式', async () => {
    render(
      <LoginForm
        onLoginSuccess={mockOnLoginSuccess}
        onNavigateToRegister={mockOnNavigateToRegister}
      />
    );

    const phoneInput = screen.getByPlaceholderText('账号名/邮箱/手机号');
    const passwordInput = screen.getByPlaceholderText('输入登录密码');
    const loginButton = screen.getByText('登录');

    // 输入无效的手机号
    fireEvent.change(phoneInput, { target: { value: '123' } });
    fireEvent.change(passwordInput, { target: { value: 'test123456' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('手机号格式不正确')).toBeInTheDocument();
    });
  });

  test('网络错误应该显示相应提示', async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

    render(
      <LoginForm
        onLoginSuccess={mockOnLoginSuccess}
        onNavigateToRegister={mockOnNavigateToRegister}
      />
    );

    const phoneInput = screen.getByPlaceholderText('账号名/邮箱/手机号');
    const passwordInput = screen.getByPlaceholderText('输入登录密码');
    const loginButton = screen.getByText('登录');

    fireEvent.change(phoneInput, { target: { value: '13800138000' } });
    fireEvent.change(passwordInput, { target: { value: 'test123456' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('网络错误，请重试')).toBeInTheDocument();
    });
  });
});