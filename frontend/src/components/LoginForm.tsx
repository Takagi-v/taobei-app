import React, { useState, useEffect } from 'react';

interface LoginFormProps {
  onLoginSuccess: (userInfo: any) => void;
  onNavigateToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, onNavigateToRegister }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [loginType, setLoginType] = useState<'sms' | 'qr'>('sms');

  // 倒计时效果
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // 手机号格式验证
  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const handleGetVerificationCode = async () => {
    setError('');
    
    // 校验手机号格式
    if (!phoneNumber) {
      setError('手机号不能为空');
      return;
    }
    
    if (!validatePhoneNumber(phoneNumber)) {
      setError('手机号格式不正确');
      return;
    }

    try {
      setIsLoading(true);
      
      // 调用API发送验证码
      const response = await fetch('/api/auth/send-verification-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();

      if (response.ok) {
        setCountdown(60); // 开始60秒倒计时
      } else {
        setError(data.message || '发送验证码失败');
      }
    } catch (error) {
      setError('网络错误，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 校验输入
    if (!phoneNumber) {
      setError('手机号不能为空');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setError('手机号格式不正确');
      return;
    }

    if (!verificationCode) {
      setError('验证码不能为空');
      return;
    }

    try {
      setIsLoading(true);

      // 调用登录API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
          verificationCode,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // 登录成功
        onLoginSuccess(data.user);
      } else {
        setError(data.message || '登录失败');
      }
    } catch (error) {
      setError('网络错误，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* 登录方式切换 */}
        <div className="login-tabs">
          <button 
            className={`tab-button ${loginType === 'qr' ? 'active' : ''}`}
            onClick={() => setLoginType('qr')}
          >
            扫码登录
          </button>
          <button 
            className={`tab-button ${loginType === 'sms' ? 'active' : ''}`}
            onClick={() => setLoginType('sms')}
          >
            短信登录
          </button>
        </div>

        {loginType === 'qr' ? (
          /* 二维码登录 */
          <div className="qr-login">
            <div className="qr-code">
              <svg width="200" height="200" viewBox="0 0 200 200">
                <rect width="200" height="200" fill="white"/>
                {/* 简化的二维码图案 */}
                <rect x="20" y="20" width="20" height="20" fill="black"/>
                <rect x="60" y="20" width="20" height="20" fill="black"/>
                <rect x="100" y="20" width="20" height="20" fill="black"/>
                <rect x="140" y="20" width="20" height="20" fill="black"/>
                <rect x="20" y="60" width="20" height="20" fill="black"/>
                <rect x="100" y="60" width="20" height="20" fill="black"/>
                <rect x="160" y="60" width="20" height="20" fill="black"/>
                <rect x="60" y="100" width="20" height="20" fill="black"/>
                <rect x="140" y="100" width="20" height="20" fill="black"/>
                <rect x="20" y="140" width="20" height="20" fill="black"/>
                <rect x="80" y="140" width="20" height="20" fill="black"/>
                <rect x="160" y="140" width="20" height="20" fill="black"/>
                <rect x="40" y="180" width="20" height="20" fill="black"/>
                <rect x="120" y="180" width="20" height="20" fill="black"/>
                
                {/* 中心logo */}
                <rect x="85" y="85" width="30" height="30" rx="4" fill="#ff6600"/>
                <rect x="90" y="90" width="20" height="20" rx="2" fill="white"/>
              </svg>
            </div>
            <p className="qr-tip">打开手机淘宝，扫一扫登录</p>
            <p className="qr-subtitle">免输入，更安全</p>
          </div>
        ) : (
          /* 短信登录 */
          <form onSubmit={handleLogin} className="sms-login">
            <div className="form-group">
              <input
                type="tel"
                className="form-input"
                placeholder="账号名/邮箱/手机号"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                maxLength={11}
              />
            </div>

            <div className="form-group verification-group">
              <input
                type="text"
                className="form-input verification-input"
                placeholder="输入登录密码"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
              />
              <button
                type="button"
                className="btn btn-secondary get-code-btn"
                onClick={handleGetVerificationCode}
                disabled={countdown > 0 || isLoading}
              >
                {countdown > 0 ? `${countdown}s` : '忘记密码'}
              </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button
              type="submit"
              className="btn btn-primary login-btn"
              disabled={isLoading}
            >
              {isLoading && <span className="loading"></span>}
              登录
            </button>

            <div className="login-options">
              <div className="quick-login">
                <span className="quick-login-icon">📱</span>
                <span className="quick-login-icon">💬</span>
                <span>快捷登录</span>
                <span className="quick-login-icon">🔒</span>
                <span>免密登录</span>
              </div>
            </div>

            <div className="register-link">
              <span>还没有账号？</span>
              <button type="button" className="btn btn-link" onClick={onNavigateToRegister}>
                免费注册
              </button>
            </div>

            <div className="agreement">
              <label className="checkbox-label">
                <input type="checkbox" defaultChecked />
                <span className="checkmark"></span>
                登录即表示同意
                <a href="#" className="link">《淘宝服务协议》</a>
                和
                <a href="#" className="link">《隐私权政策》</a>
              </label>
            </div>
          </form>
        )}
      </div>

      <style jsx>{`
        .login-container {
          min-height: calc(100vh - 60px);
          background: linear-gradient(135deg, #ff9a56 0%, #ff6600 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .login-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
          overflow: hidden;
        }

        .login-tabs {
          display: flex;
          border-bottom: 1px solid var(--taobao-border);
        }

        .tab-button {
          flex: 1;
          padding: 16px;
          border: none;
          background: none;
          font-size: 16px;
          font-weight: 500;
          color: var(--taobao-gray);
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .tab-button.active {
          color: var(--taobao-orange);
        }

        .tab-button.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--taobao-orange);
        }

        .qr-login {
          padding: 40px;
          text-align: center;
        }

        .qr-code {
          display: inline-block;
          padding: 20px;
          border: 1px solid var(--taobao-border);
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .qr-tip {
          font-size: 16px;
          color: var(--taobao-gray);
          margin-bottom: 8px;
        }

        .qr-subtitle {
          font-size: 14px;
          color: var(--taobao-light-gray);
        }

        .sms-login {
          padding: 32px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .verification-group {
          display: flex;
          gap: 12px;
        }

        .verification-input {
          flex: 1;
        }

        .get-code-btn {
          white-space: nowrap;
          min-width: 100px;
        }

        .login-btn {
          width: 100%;
          padding: 14px;
          font-size: 16px;
          font-weight: 500;
          margin-bottom: 24px;
        }

        .login-options {
          display: flex;
          justify-content: center;
          margin-bottom: 24px;
        }

        .quick-login {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: var(--taobao-gray);
        }

        .quick-login-icon {
          font-size: 16px;
        }

        .register-link {
          text-align: center;
          margin-bottom: 24px;
          font-size: 14px;
          color: var(--taobao-gray);
        }

        .agreement {
          font-size: 12px;
          color: var(--taobao-light-gray);
          line-height: 1.4;
        }

        .checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          cursor: pointer;
        }

        .checkbox-label input[type="checkbox"] {
          margin: 0;
        }

        .link {
          color: var(--taobao-orange);
          text-decoration: none;
        }

        .link:hover {
          text-decoration: underline;
        }

        @media (max-width: 480px) {
          .login-container {
            padding: 12px;
          }

          .sms-login {
            padding: 24px;
          }

          .qr-login {
            padding: 24px;
          }

          .qr-code svg {
            width: 160px;
            height: 160px;
          }
        }
      `}</style>
    </div>
  );
};
export default LoginForm;