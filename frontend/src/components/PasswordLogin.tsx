import React, { useState } from 'react';

interface PasswordLoginProps {
  onLoginSuccess: (loginData: any) => void;
  onSwitchToSms: () => void;
}

const PasswordLogin: React.FC<PasswordLoginProps> = ({ onLoginSuccess, onSwitchToSms }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 验证手机号格式
  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      // 必填字段验证
      if (!phoneNumber) {
        setErrorMessage('手机号不能为空');
        setIsLoading(false);
        return;
      }

      if (!password) {
        setErrorMessage('密码不能为空');
        setIsLoading(false);
        return;
      }

      // 手机号格式验证
      if (!validatePhoneNumber(phoneNumber)) {
        setErrorMessage('手机号格式不正确');
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/auth/login-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // 保存token和用户信息到localStorage
        localStorage.setItem('authToken', data.data.token);
        localStorage.setItem('userInfo', JSON.stringify(data.data.user));
        onLoginSuccess(data.data);
      } else {
        setErrorMessage(data.message || '登录失败');
      }
    } catch (error) {
      console.error('登录失败:', error);
      setErrorMessage('网络错误，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="password-login">
      <form onSubmit={handleSubmit} className="password-login-form">
        {/* 错误信息显示 */}
        {errorMessage && (
          <div className="error-message">
            {errorMessage}
          </div>
        )}

        <div className="form-group">
          <input
            type="text"
            className="form-input"
            placeholder="账号名/邮箱/手机号"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            className="form-input"
            placeholder="输入登录密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="login-btn" disabled={isLoading}>
          {isLoading ? '登录中...' : '登录'}
        </button>

        <div className="switch-mode">
          <button type="button" className="switch-btn" onClick={onSwitchToSms}>
            切换到短信登录
          </button>
        </div>
      </form>

      <style jsx>{`
        .password-login {
          width: 100%;
        }

        .password-login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .error-message {
          background: #fff2f0;
          border: 1px solid #ffccc7;
          color: #ff4d4f;
          padding: 12px 16px;
          border-radius: 6px;
          font-size: 14px;
        }

        .form-group {
          position: relative;
        }

        .form-input {
          width: 100%;
          padding: 16px 20px;
          border: 2px solid #e8e8e8;
          border-radius: 8px;
          font-size: 16px;
          color: #1a1a1a;
          background: #fafafa;
          box-sizing: border-box;
          transition: all 0.3s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: #ff6600;
          background: white;
          box-shadow: 0 0 0 3px rgba(255, 102, 0, 0.1);
        }

        .form-input::placeholder {
          color: #bbb;
          font-weight: 400;
        }

        .login-btn {
          width: 100%;
          padding: 16px;
          background: #ff6600;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .login-btn:hover:not(:disabled) {
          background: #e55a00;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(255, 102, 0, 0.3);
        }

        .login-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .switch-mode {
          text-align: center;
        }

        .switch-btn {
          background: none;
          border: none;
          color: #ff6600;
          font-size: 14px;
          cursor: pointer;
          text-decoration: underline;
        }

        .switch-btn:hover {
          color: #e55a00;
        }
      `}</style>
    </div>
  );
};

export default PasswordLogin;