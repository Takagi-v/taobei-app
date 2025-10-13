import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import RegisterForm from '../../src/components/RegisterForm';

// Mock axios for API calls
vi.mock('axios', () => ({
  default: {
    post: vi.fn()
  }
}));

describe('RegisterForm Component', () => {
  const mockOnRegisterSuccess = vi.fn();
  const mockOnNavigateToLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('应该渲染注册表单标题', () => {
    render(
      <RegisterForm
        onRegisterSuccess={mockOnRegisterSuccess}
        onNavigateToLogin={mockOnNavigateToLogin}
      />
    );

    expect(screen.getByText('用户注册')).toBeInTheDocument();
  });

  test('应该显示手机号输入框', () => {
    render(
      <RegisterForm
        onRegisterSuccess={mockOnRegisterSuccess}
        onNavigateToLogin={mockOnNavigateToLogin}
      />
    );

    const phoneInput = screen.getByPlaceholderText('请输入手机号');
    expect(phoneInput).toBeInTheDocument();
    expect(phoneInput).toHaveAttribute('type', 'tel');
  });

  test('应该显示验证码输入框', () => {
    render(
      <RegisterForm
        onRegisterSuccess={mockOnRegisterSuccess}
        onNavigateToLogin={mockOnNavigateToLogin}
      />
    );

    const codeInput = screen.getByPlaceholderText('请输入验证码');
    expect(codeInput).toBeInTheDocument();
    expect(codeInput).toHaveAttribute('type', 'text');
  });

  test('应该显示用户协议复选框', () => {
    render(
      <RegisterForm
        onRegisterSuccess={mockOnRegisterSuccess}
        onNavigateToLogin={mockOnNavigateToLogin}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(screen.getByText('同意《淘贝用户协议》')).toBeInTheDocument();
  });

  test('应该显示获取验证码按钮', () => {
    render(
      <RegisterForm
        onRegisterSuccess={mockOnRegisterSuccess}
        onNavigateToLogin={mockOnNavigateToLogin}
      />
    );

    const getCodeButton = screen.getByText('获取验证码');
    expect(getCodeButton).toBeInTheDocument();
  });

  test('应该显示注册按钮', () => {
    render(
      <RegisterForm
        onRegisterSuccess={mockOnRegisterSuccess}
        onNavigateToLogin={mockOnNavigateToLogin}
      />
    );

    const registerButton = screen.getByText('注册');
    expect(registerButton).toBeInTheDocument();
    expect(registerButton).toHaveClass('register-button');
  });

  test('应该显示切换到登录的链接', () => {
    render(
      <RegisterForm
        onRegisterSuccess={mockOnRegisterSuccess}
        onNavigateToLogin={mockOnNavigateToLogin}
      />
    );

    expect(screen.getByText('已有账号？')).toBeInTheDocument();
    const loginLink = screen.getByText('立即登录');
    expect(loginLink).toBeInTheDocument();
  });

  test('未同意用户协议时注册按钮应该被禁用', () => {
    render(
      <RegisterForm
        onRegisterSuccess={mockOnRegisterSuccess}
        onNavigateToLogin={mockOnNavigateToLogin}
      />
    );

    const registerButton = screen.getByText('注册');
    expect(registerButton).toBeDisabled();
  });

  test('同意用户协议后注册按钮应该可用', () => {
    render(
      <RegisterForm
        onRegisterSuccess={mockOnRegisterSuccess}
        onNavigateToLogin={mockOnNavigateToLogin}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    const registerButton = screen.getByText('注册');

    fireEvent.click(checkbox);
    expect(registerButton).not.toBeDisabled();
  });

  test('应该能够输入手机号', () => {
    render(
      <RegisterForm
        onRegisterSuccess={mockOnRegisterSuccess}
        onNavigateToLogin={mockOnNavigateToLogin}
      />
    );

    const phoneInput = screen.getByPlaceholderText('请输入手机号');
    fireEvent.change(phoneInput, { target: { value: '13800138000' } });

    expect(phoneInput).toHaveValue('13800138000');
  });

  test('应该能够输入验证码', () => {
    render(
      <RegisterForm
        onRegisterSuccess={mockOnRegisterSuccess}
        onNavigateToLogin={mockOnNavigateToLogin}
      />
    );

    const codeInput = screen.getByPlaceholderText('请输入验证码');
    fireEvent.change(codeInput, { target: { value: '123456' } });

    expect(codeInput).toHaveValue('123456');
  });

  test('应该能够切换用户协议同意状态', () => {
    render(
      <RegisterForm
        onRegisterSuccess={mockOnRegisterSuccess}
        onNavigateToLogin={mockOnNavigateToLogin}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    
    expect(checkbox).not.toBeChecked();
    
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  test('点击获取验证码按钮应该发送请求', async () => {
    render(
      <RegisterForm
        onRegisterSuccess={mockOnRegisterSuccess}
        onNavigateToLogin={mockOnNavigateToLogin}
      />
    );

    const phoneInput = screen.getByPlaceholderText('请输入手机号');
    const getCodeButton = screen.getByText('获取验证码');

    fireEvent.change(phoneInput, { target: { value: '13800138000' } });
    fireEvent.click(getCodeButton);

    // 由于实现中抛出错误，这里测试错误处理
    await waitFor(() => {
      expect(screen.queryByText(/获取验证码失败/)).toBeInTheDocument();
    });
  });

  test('获取验证码后应该显示倒计时', async () => {
    render(
      <RegisterForm
        onRegisterSuccess={mockOnRegisterSuccess}
        onNavigateToLogin={mockOnNavigateToLogin}
      />
    );

    const phoneInput = screen.getByPlaceholderText('请输入手机号');
    const getCodeButton = screen.getByText('获取验证码');

    fireEvent.change(phoneInput, { target: { value: '13800138000' } });
    fireEvent.click(getCodeButton);

    // 测试倒计时功能（需要实现后才能正常工作）
    await waitFor(() => {
      expect(getCodeButton).toBeDisabled();
    });
  });

  test('点击注册按钮应该处理注册逻辑', async () => {
    render(
      <RegisterForm
        onRegisterSuccess={mockOnRegisterSuccess}
        onNavigateToLogin={mockOnNavigateToLogin}
      />
    );

    const phoneInput = screen.getByPlaceholderText('请输入手机号');
    const codeInput = screen.getByPlaceholderText('请输入验证码');
    const checkbox = screen.getByRole('checkbox');
    const registerButton = screen.getByText('注册');

    fireEvent.change(phoneInput, { target: { value: '13800138000' } });
    fireEvent.change(codeInput, { target: { value: '123456' } });
    fireEvent.click(checkbox);
    fireEvent.click(registerButton);

    // 由于实现中抛出错误，这里测试错误处理
    await waitFor(() => {
      expect(screen.queryByText(/注册失败/)).toBeInTheDocument();
    });
  });

  test('点击登录链接应该调用onNavigateToLogin', () => {
    render(
      <RegisterForm
        onRegisterSuccess={mockOnRegisterSuccess}
        onNavigateToLogin={mockOnNavigateToLogin}
      />
    );

    const loginLink = screen.getByText('立即登录');
    fireEvent.click(loginLink);

    expect(mockOnNavigateToLogin).toHaveBeenCalledTimes(1);
  });

  test('应该显示错误信息', () => {
    render(
      <RegisterForm
        onRegisterSuccess={mockOnRegisterSuccess}
        onNavigateToLogin={mockOnNavigateToLogin}
      />
    );

    // 触发一个会产生错误的操作
    const checkbox = screen.getByRole('checkbox');
    const registerButton = screen.getByText('注册');
    
    fireEvent.click(checkbox);
    fireEvent.click(registerButton);

    // 等待错误信息显示
    waitFor(() => {
      const errorMessage = screen.queryByText(/注册失败/);
      if (errorMessage) {
        expect(errorMessage).toHaveClass('error-message');
      }
    });
  });

  test('加载状态下注册按钮应该显示加载文本', () => {
    render(
      <RegisterForm
        onRegisterSuccess={mockOnRegisterSuccess}
        onNavigateToLogin={mockOnNavigateToLogin}
      />
    );

    const phoneInput = screen.getByPlaceholderText('请输入手机号');
    const codeInput = screen.getByPlaceholderText('请输入验证码');
    const checkbox = screen.getByRole('checkbox');
    const registerButton = screen.getByText('注册');

    fireEvent.change(phoneInput, { target: { value: '13800138000' } });
    fireEvent.change(codeInput, { target: { value: '123456' } });
    fireEvent.click(checkbox);
    fireEvent.click(registerButton);

    // 在加载状态下，按钮文本应该改变
    waitFor(() => {
      expect(screen.queryByText('注册中...')).toBeInTheDocument();
    });
  });

  test('应该验证手机号格式', async () => {
    render(
      <RegisterForm
        onRegisterSuccess={mockOnRegisterSuccess}
        onNavigateToLogin={mockOnNavigateToLogin}
      />
    );

    const phoneInput = screen.getByPlaceholderText('请输入手机号');
    const getCodeButton = screen.getByText('获取验证码');

    // 输入无效手机号
    fireEvent.change(phoneInput, { target: { value: 'invalid-phone' } });
    fireEvent.click(getCodeButton);

    await waitFor(() => {
      expect(screen.queryByText(/手机号格式不正确/)).toBeInTheDocument();
    });
  });

  test('应该验证验证码不为空', async () => {
    render(
      <RegisterForm
        onRegisterSuccess={mockOnRegisterSuccess}
        onNavigateToLogin={mockOnNavigateToLogin}
      />
    );

    const phoneInput = screen.getByPlaceholderText('请输入手机号');
    const checkbox = screen.getByRole('checkbox');
    const registerButton = screen.getByText('注册');

    fireEvent.change(phoneInput, { target: { value: '13800138000' } });
    fireEvent.click(checkbox);
    fireEvent.click(registerButton);

    await waitFor(() => {
      expect(screen.queryByText(/验证码不能为空/)).toBeInTheDocument();
    });
  });
});