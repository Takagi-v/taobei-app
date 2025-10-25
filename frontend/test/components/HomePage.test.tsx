import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import HomePage from '../../src/components/HomePage';

describe('HomePage Component', () => {
  const mockOnNavigateToLogin = vi.fn();
  const mockOnNavigateToRegister = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('应该渲染欢迎标题', () => {
    render(
      <HomePage
        onNavigateToLogin={mockOnNavigateToLogin}
        onNavigateToRegister={mockOnNavigateToRegister}
      />
    );

    expect(screen.getByText('淘宝网 - 淘！我喜欢')).toBeInTheDocument();
  });

  test('应该显示登录按钮', () => {
    render(
      <HomePage
        onNavigateToLogin={mockOnNavigateToLogin}
        onNavigateToRegister={mockOnNavigateToRegister}
      />
    );

    const loginButton = screen.getByText('登录');
    expect(loginButton).toBeInTheDocument();
    expect(loginButton).toHaveClass('login-button');
  });

  test('应该显示注册按钮', () => {
    render(
      <HomePage
        onNavigateToLogin={mockOnNavigateToLogin}
        onNavigateToRegister={mockOnNavigateToRegister}
      />
    );

    const registerButton = screen.getByText('立即注册');
    expect(registerButton).toBeInTheDocument();
    expect(registerButton).toHaveClass('register-button');
  });

  test('点击登录按钮应该调用onNavigateToLogin', () => {
    render(
      <HomePage
        onNavigateToLogin={mockOnNavigateToLogin}
        onNavigateToRegister={mockOnNavigateToRegister}
      />
    );

    const loginButton = screen.getByText('登录');
    fireEvent.click(loginButton);

    expect(mockOnNavigateToLogin).toHaveBeenCalledTimes(1);
  });

  test('点击注册按钮应该调用onNavigateToRegister', () => {
    render(
      <HomePage
        onNavigateToLogin={mockOnNavigateToLogin}
        onNavigateToRegister={mockOnNavigateToRegister}
      />
    );

    const registerButton = screen.getByText('立即注册');
    fireEvent.click(registerButton);

    expect(mockOnNavigateToRegister).toHaveBeenCalledTimes(1);
  });

  test('应该有正确的CSS类名', () => {
    render(
      <HomePage
        onNavigateToLogin={mockOnNavigateToLogin}
        onNavigateToRegister={mockOnNavigateToRegister}
      />
    );

    const homePage = screen.getByText('淘宝网 - 淘！我喜欢').closest('.homepage');
    expect(homePage).toBeInTheDocument();

    const authButtons = screen.getByText('登录').closest('.auth-buttons');
    expect(authButtons).toBeInTheDocument();
  });

  test('应该正确处理props传递', () => {
    const customOnNavigateToLogin = vi.fn();
    const customOnNavigateToRegister = vi.fn();

    render(
      <HomePage
        onNavigateToLogin={customOnNavigateToLogin}
        onNavigateToRegister={customOnNavigateToRegister}
      />
    );

    fireEvent.click(screen.getByText('登录'));
    fireEvent.click(screen.getByText('立即注册'));

    expect(customOnNavigateToLogin).toHaveBeenCalledTimes(1);
    expect(customOnNavigateToRegister).toHaveBeenCalledTimes(1);
  });
});