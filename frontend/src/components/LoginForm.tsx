import React, { useState } from 'react';

interface LoginFormProps {
  onLoginSuccess: (loginData: any) => void;
  onNavigateToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, onNavigateToRegister }) => {
  const [loginType, setLoginType] = useState<'password' | 'sms'>('password');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [countryCode, setCountryCode] = useState('+86');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleSendCode = async () => {
    if (!phoneNumber) {
      alert('请输入手机号');
      return;
    }

    try {
      const response = await fetch('/api/auth/send-verification-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });

      if (response.ok) {
        setIsCodeSent(true);
        setCountdown(60);
        
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        const error = await response.json();
        alert(error.message || '发送验证码失败');
      }
    } catch (error) {
      console.error('发送验证码失败:', error);
      alert('发送验证码失败，请重试');
    }
  };

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (loginType === 'password') {
        if (!phoneNumber || !password) {
          alert('请填写完整信息');
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
          alert(data.message || '登录失败');
        }
      } else if (loginType === 'sms') {
        if (!phoneNumber || !verificationCode) {
          alert('请填写完整信息');
          return;
        }
        
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
           // 保存token和用户信息到localStorage
           localStorage.setItem('authToken', data.data.token);
           localStorage.setItem('userInfo', JSON.stringify(data.data.user));
           onLoginSuccess(data.data);
         } else {
           alert(data.message || '登录失败');
         }
      }
    } catch (error) {
      console.error('登录失败:', error);
      alert('登录失败，请重试');
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        {/* 左侧：手机扫码登录区 */}
        <div className="qr-section">
          <h2 className="qr-title">手机扫码登录</h2>
          <div className="qr-container">
            <div className="qr-code">
              <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="160" height="160" fill="white"/>
                {/* 二维码图案 */}
                <rect x="10" y="10" width="30" height="30" fill="black"/>
                <rect x="50" y="10" width="10" height="10" fill="black"/>
                <rect x="70" y="10" width="10" height="10" fill="black"/>
                <rect x="90" y="10" width="10" height="10" fill="black"/>
                <rect x="120" y="10" width="30" height="30" fill="black"/>
                <rect x="10" y="20" width="10" height="10" fill="white"/>
                <rect x="30" y="20" width="10" height="10" fill="white"/>
                <rect x="120" y="20" width="10" height="10" fill="white"/>
                <rect x="140" y="20" width="10" height="10" fill="white"/>
                <rect x="10" y="30" width="10" height="10" fill="white"/>
                <rect x="30" y="30" width="10" height="10" fill="white"/>
                <rect x="50" y="30" width="10" height="10" fill="black"/>
                <rect x="70" y="30" width="10" height="10" fill="black"/>
                <rect x="90" y="30" width="10" height="10" fill="black"/>
                <rect x="120" y="30" width="10" height="10" fill="white"/>
                <rect x="140" y="30" width="10" height="10" fill="white"/>
                <rect x="50" y="50" width="10" height="10" fill="black"/>
                <rect x="70" y="50" width="10" height="10" fill="black"/>
                <rect x="90" y="50" width="10" height="10" fill="black"/>
                <rect x="10" y="70" width="10" height="10" fill="black"/>
                <rect x="30" y="70" width="10" height="10" fill="black"/>
                <rect x="50" y="70" width="10" height="10" fill="black"/>
                <rect x="70" y="70" width="10" height="10" fill="black"/>
                <rect x="90" y="70" width="10" height="10" fill="black"/>
                <rect x="110" y="70" width="10" height="10" fill="black"/>
                <rect x="130" y="70" width="10" height="10" fill="black"/>
                <rect x="10" y="90" width="10" height="10" fill="black"/>
                <rect x="30" y="90" width="10" height="10" fill="black"/>
                <rect x="50" y="90" width="10" height="10" fill="black"/>
                <rect x="70" y="90" width="10" height="10" fill="black"/>
                <rect x="90" y="90" width="10" height="10" fill="black"/>
                <rect x="110" y="90" width="10" height="10" fill="black"/>
                <rect x="130" y="90" width="10" height="10" fill="black"/>
                <rect x="10" y="120" width="30" height="30" fill="black"/>
                <rect x="50" y="120" width="10" height="10" fill="black"/>
                <rect x="70" y="120" width="10" height="10" fill="black"/>
                <rect x="90" y="120" width="10" height="10" fill="black"/>
                <rect x="120" y="120" width="30" height="30" fill="black"/>
                <rect x="10" y="130" width="10" height="10" fill="white"/>
                <rect x="30" y="130" width="10" height="10" fill="white"/>
                <rect x="120" y="130" width="10" height="10" fill="white"/>
                <rect x="140" y="130" width="10" height="10" fill="white"/>
                <rect x="10" y="140" width="10" height="10" fill="white"/>
                <rect x="30" y="140" width="10" height="10" fill="white"/>
                <rect x="120" y="140" width="10" height="10" fill="white"/>
                <rect x="140" y="140" width="10" height="10" fill="white"/>
                {/* 中心区域 */}
                <rect x="65" y="65" width="30" height="30" fill="black"/>
                <rect x="70" y="70" width="20" height="20" fill="white"/>
                {/* 中心橙色淘字标识 */}
                <circle cx="80" cy="80" r="8" fill="#ff6600"/>
                <text x="80" y="85" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">淘</text>
              </svg>
            </div>
          </div>
          <p className="qr-description">
            打开<span className="taobao-link">淘宝APP</span>——点击左上角扫一扫
          </p>
          <p className="qr-help">怎么扫码登录？</p>
        </div>

        {/* 分割线 */}
        <div className="divider"></div>

        {/* 右侧：表单登录区 */}
        <div className="form-section">
          {/* 标签页 */}
          <div className="login-tabs">
            <button
              className={`tab-button ${loginType === 'password' ? 'active' : ''}`}
              onClick={() => setLoginType('password')}
            >
              密码登录
            </button>
            <button
              className={`tab-button ${loginType === 'sms' ? 'active' : ''}`}
              onClick={() => setLoginType('sms')}
            >
              短信登录
            </button>
          </div>

          {/* 表单 */}
          <form onSubmit={handleSubmit} className="login-form">
            {loginType === 'password' ? (
              <>
                {/* 密码登录表单 */}
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
                <div className="form-group password-group">
                  <input
                    type="password"
                    className="form-input"
                    placeholder="请输入登录密码"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button 
                    type="button" 
                    className="forgot-password"
                    onClick={() => setLoginType('sms')}
                  >
                    忘记密码
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* 短信登录表单 */}
                <div className="form-group">
                  <div className="phone-input-group">
                    <select 
                      className="country-code"
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                    >
                      <option value="+86">+86</option>
                      <option value="+1">+1</option>
                      <option value="+44">+44</option>
                      <option value="+81">+81</option>
                    </select>
                    <input
                      type="tel"
                      className="form-input phone-input"
                      placeholder="手机号"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      maxLength={11}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <div className="verification-group">
                    <input
                      type="text"
                      className="form-input verification-input"
                      placeholder="请输入验证码"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      maxLength={6}
                      required
                    />
                    <button
                      type="button"
                      className="get-code-btn"
                      onClick={handleSendCode}
                      disabled={countdown > 0}
                    >
                      {countdown > 0 ? `${countdown}s` : '获取验证码'}
                    </button>
                  </div>
                </div>
              </>
            )}

            <button type="submit" className="login-btn">
              登录
            </button>

            {/* <div className="login-options">
              <div className="quick-login">
                <span className="quick-login-icon">📱</span>
                <span>免密登录</span>
              </div>
            </div> */}

            <div className="register-link">
              <span>还没有账号？</span>
              <button type="button" className="btn-link" onClick={onNavigateToRegister}>立即注册</button>
            </div>

            <div className="agreement">
              登录即表示您同意<a href="#" className="link">《用户协议》</a>和<a href="#" className="link">《隐私政策》</a>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          padding: 20px;
        }

        .login-wrapper {
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 40px rgba(0, 0, 0, 0.12);
          overflow: hidden;
          display: flex;
          width: 100%;
          max-width: 900px;
          min-height: 550px;
        }

        /* 左侧二维码区域 */
        .qr-section {
          flex: 1;
          padding: 50px 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #fafbfc 0%, #f5f6f7 100%);
          border-right: 1px solid #e8e8e8;
        }

        .qr-title {
          font-size: 24px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 40px;
          text-align: center;
          letter-spacing: 0.5px;
        }

        .qr-container {
          margin-bottom: 24px;
        }

        .qr-code {
          padding: 24px;
          background: white;
          border: 2px solid #f0f0f0;
          border-radius: 12px;
          display: inline-block;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
        }

        .qr-description {
          font-size: 14px;
          color: #666;
          text-align: center;
          margin-bottom: 10px;
          line-height: 1.5;
        }

        .taobao-link {
          color: #ff6600;
          cursor: pointer;
        }

        .taobao-link:hover {
          text-decoration: underline;
        }

        .qr-help {
          font-size: 12px;
          color: #999;
          text-align: center;
          cursor: pointer;
        }

        .qr-help:hover {
          color: #ff6600;
          text-decoration: underline;
        }

        /* 分割线 */
        .divider {
          width: 1px;
          background: #e8e8e8;
          margin: 20px 0;
        }

        /* 右侧表单区域 */
        .form-section {
          flex: 1;
          padding: 50px 45px;
          display: flex;
          flex-direction: column;
          background: white;
        }

        .login-tabs {
          display: flex;
          margin-bottom: 35px;
          border-bottom: 2px solid #f5f5f5;
        }

        .tab-button {
          padding: 16px 24px;
          border: none;
          background: none;
          font-size: 18px;
          color: #8c8c8c;
          cursor: pointer;
          position: relative;
          margin-right: 40px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .tab-button.active {
          color: #ff6600;
          font-weight: 700;
        }

        .tab-button.active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 3px;
          background: #ff6600;
          border-radius: 2px 2px 0 0;
        }

        .tab-button:hover {
          color: #ff6600;
        }

        .login-form {
          flex: 1;
        }

        .form-group {
          margin-bottom: 24px;
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

        .password-group {
          position: relative;
        }

        .forgot-password {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #ff6600;
          font-size: 12px;
          cursor: pointer;
        }

        .forgot-password:hover {
          text-decoration: underline;
        }

        .phone-input-group {
          display: flex;
          gap: 8px;
        }

        .country-code {
          width: 80px;
          padding: 12px 8px;
          border: 1px solid #e8e8e8;
          border-radius: 4px;
          font-size: 14px;
          background: #f8f8f8;
          color: #333;
        }

        .country-code:focus {
          outline: none;
          border-color: #ff6600;
          background: white;
        }

        .phone-input {
          flex: 1;
        }

        .verification-group {
          display: flex;
          gap: 8px;
        }

        .verification-input {
          flex: 1;
        }

        .get-code-btn {
          white-space: nowrap;
          min-width: 120px;
          padding: 16px 20px;
          font-size: 14px;
          border: 2px solid #ff6600;
          background: #fff;
          color: #ff6600;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .get-code-btn:hover {
          background: #ff6600;
          color: white;
          transform: translateY(-1px);
        }

        .get-code-btn:disabled {
          background: #f5f5f5;
          color: #ccc;
          border-color: #e8e8e8;
          cursor: not-allowed;
          transform: none;
        }

        .login-btn {
          width: 100%;
          padding: 18px;
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 30px;
          background: linear-gradient(135deg, #ff6600 0%, #e55a00 100%);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 16px rgba(255, 102, 0, 0.3);
        }

        .login-btn:hover {
          background: linear-gradient(135deg, #e55a00 0%, #cc4f00 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 102, 0, 0.4);
        }

        .login-options {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 20px;
        }

        .quick-login {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #999;
        }

        .quick-login-icon {
          font-size: 14px;
        }

        .register-link {
          text-align: center;
          margin-bottom: 20px;
          font-size: 12px;
          color: #666;
        }

        .btn-link {
          color: #ff6600;
          text-decoration: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          font-size: 12px;
        }

        .btn-link:hover {
          text-decoration: underline;
        }

        .agreement {
          font-size: 11px;
          color: #999;
          line-height: 1.4;
          text-align: center;
        }

        .agreement .link {
          color: #ff6600;
          text-decoration: none;
        }

        .agreement .link:hover {
          text-decoration: underline;
        }

        /* 响应式设计 */
        @media (max-width: 768px) {
          .login-wrapper {
            flex-direction: column;
            max-width: 400px;
          }

          .divider {
            width: 100%;
            height: 1px;
            margin: 0;
          }

          .qr-section,
          .form-section {
            padding: 30px;
          }
        }
      `}</style>
    </div>
  );
};
export default LoginForm;