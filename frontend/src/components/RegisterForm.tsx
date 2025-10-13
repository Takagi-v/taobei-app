import React, { useState, useEffect } from 'react';

interface RegisterFormProps {
  onRegisterSuccess: (userInfo: any) => void;
  onNavigateToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegisterSuccess, onNavigateToLogin }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // 倒计时效果
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // 手机号格式验证
  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const handleGetVerificationCode = async () => {
    setError('');
    
    // 校验手机号格式
    if (!phoneNumber) {
      setError('请输入手机号');
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 校验输入
    if (!phoneNumber) {
      setError('请输入手机号');
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

    if (!agreeToTerms) {
      setError('请同意服务协议和隐私政策');
      return;
    }

    try {
      setIsLoading(true);

      // 调用注册API
      const response = await fetch('/api/auth/register', {
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
        // 注册成功
        onRegisterSuccess(data.user);
      } else {
        setError(data.message || '注册失败');
      }
    } catch (error) {
      setError('网络错误，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h2 className="register-title">注册淘宝账号</h2>
          <p className="register-subtitle">一个账号，畅享所有淘宝服务</p>
        </div>

        <form onSubmit={handleRegister} className="register-form">
          <div className="form-group">
            <label className="form-label">手机号</label>
            <div className="phone-input-group">
              <span className="country-code">+86</span>
              <input
                type="tel"
                className="form-input phone-input"
                placeholder="请输入手机号"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                maxLength={11}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">验证码</label>
            <div className="verification-group">
              <input
                type="text"
                className="form-input verification-input"
                placeholder="请输入验证码"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
              />
              <button
                type="button"
                className="btn btn-secondary get-code-btn"
                onClick={handleGetVerificationCode}
                disabled={countdown > 0 || isLoading || !phoneNumber}
              >
                {countdown > 0 ? `${countdown}s后重新获取` : '获取验证码'}
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="agreement-section">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
              />
              <span className="checkmark"></span>
              <span className="agreement-text">
                我已阅读并同意
                <a href="#" className="link">《淘宝服务协议》</a>
                、
                <a href="#" className="link">《隐私权政策》</a>
                和
                <a href="#" className="link">《芝麻服务协议》</a>
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary register-btn"
            disabled={isLoading || !agreeToTerms}
          >
            {isLoading && <span className="loading"></span>}
            同意协议并注册
          </button>

          <div className="login-link">
            <span>已有账号？</span>
            <button type="button" className="btn btn-link" onClick={onNavigateToLogin}>
              登录
            </button>
          </div>
        </form>

        <div className="register-benefits">
          <h3 className="benefits-title">注册即享</h3>
          <div className="benefits-list">
            <div className="benefit-item">
              <span className="benefit-icon">🎁</span>
              <span className="benefit-text">新人专享优惠券</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">🚚</span>
              <span className="benefit-text">包邮特权</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">⭐</span>
              <span className="benefit-text">会员积分奖励</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .register-container {
          min-height: calc(100vh - 60px);
          background: linear-gradient(135deg, #ff9a56 0%, #ff6600 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .register-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 480px;
          overflow: hidden;
        }

        .register-header {
          background: linear-gradient(135deg, #ff6600, #ff9a56);
          color: white;
          padding: 32px;
          text-align: center;
        }

        .register-title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 8px;
        }

        .register-subtitle {
          font-size: 14px;
          opacity: 0.9;
        }

        .register-form {
          padding: 32px;
        }

        .form-group {
          margin-bottom: 24px;
        }

        .form-label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: var(--taobao-gray);
          margin-bottom: 8px;
        }

        .phone-input-group {
          display: flex;
          border: 1px solid var(--taobao-border);
          border-radius: 4px;
          overflow: hidden;
        }

        .country-code {
          background: var(--taobao-bg);
          padding: 12px 16px;
          font-size: 14px;
          color: var(--taobao-gray);
          border-right: 1px solid var(--taobao-border);
        }

        .phone-input {
          border: none;
          flex: 1;
        }

        .phone-input:focus {
          box-shadow: none;
        }

        .phone-input-group:focus-within {
          border-color: var(--taobao-orange);
          box-shadow: 0 0 0 2px rgba(255, 102, 0, 0.1);
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
          min-width: 140px;
          font-size: 14px;
        }

        .agreement-section {
          margin-bottom: 24px;
        }

        .checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          cursor: pointer;
          font-size: 13px;
          line-height: 1.4;
        }

        .checkbox-label input[type="checkbox"] {
          margin: 0;
          margin-top: 2px;
        }

        .agreement-text {
          color: var(--taobao-gray);
        }

        .link {
          color: var(--taobao-orange);
          text-decoration: none;
        }

        .link:hover {
          text-decoration: underline;
        }

        .register-btn {
          width: 100%;
          padding: 14px;
          font-size: 16px;
          font-weight: 500;
          margin-bottom: 24px;
        }

        .login-link {
          text-align: center;
          font-size: 14px;
          color: var(--taobao-gray);
        }

        .register-benefits {
          background: var(--taobao-bg);
          padding: 24px 32px;
          border-top: 1px solid var(--taobao-border);
        }

        .benefits-title {
          font-size: 16px;
          font-weight: 500;
          color: var(--taobao-gray);
          margin-bottom: 16px;
          text-align: center;
        }

        .benefits-list {
          display: flex;
          justify-content: space-around;
          gap: 16px;
        }

        .benefit-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          flex: 1;
        }

        .benefit-icon {
          font-size: 24px;
        }

        .benefit-text {
          font-size: 12px;
          color: var(--taobao-gray);
          text-align: center;
        }

        @media (max-width: 480px) {
          .register-container {
            padding: 12px;
          }

          .register-header {
            padding: 24px;
          }

          .register-title {
            font-size: 20px;
          }

          .register-form {
            padding: 24px;
          }

          .register-benefits {
            padding: 20px 24px;
          }

          .benefits-list {
            flex-direction: column;
            gap: 12px;
          }

          .benefit-item {
            flex-direction: row;
            justify-content: flex-start;
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default RegisterForm;