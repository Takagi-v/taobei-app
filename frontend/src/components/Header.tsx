import React from 'react';

interface HeaderProps {
  user: any;
  currentPage: string;
  onNavigateToHome: () => void;
  onNavigateToLogin: () => void;
  onNavigateToRegister: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({
  user,
  currentPage,
  onNavigateToHome,
  onNavigateToLogin,
  onNavigateToRegister,
  onLogout
}) => {
  return (
    <header className="header">
      <div className="header-container">
        {/* Logo区域 */}
        <div className="header-logo" onClick={onNavigateToHome}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="6" fill="#ff6600"/>
            <path d="M8 12h16v2H8v-2zm0 4h16v2H8v-2zm0 4h12v2H8v-2z" fill="white"/>
          </svg>
          <span className="logo-text">淘宝</span>
        </div>

        {/* 导航菜单 */}
        <nav className="header-nav">
          <button 
            className={`nav-item ${currentPage === 'home' ? 'active' : ''}`}
            onClick={onNavigateToHome}
          >
            首页
          </button>
        </nav>

        {/* 用户区域 */}
        <div className="header-user">
          {user ? (
            <div className="user-info">
              <span className="user-greeting">
                你好，<span className="username">{user.phoneNumber}</span>
              </span>
              <button className="btn btn-link logout-btn" onClick={onLogout}>
                退出登录
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <button 
                className={`btn btn-link ${currentPage === 'login' ? 'active' : ''}`}
                onClick={onNavigateToLogin}
              >
                登录
              </button>
              <span className="separator">|</span>
              <button 
                className={`btn btn-link ${currentPage === 'register' ? 'active' : ''}`}
                onClick={onNavigateToRegister}
              >
                注册
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .header {
          background: white;
          border-bottom: 1px solid var(--taobao-border);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .header-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 16px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .header-logo {
          display: flex;
          align-items: center;
          cursor: pointer;
          transition: opacity 0.3s ease;
        }

        .header-logo:hover {
          opacity: 0.8;
        }

        .logo-text {
          margin-left: 8px;
          font-size: 20px;
          font-weight: bold;
          color: var(--taobao-orange);
        }

        .header-nav {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .nav-item {
          background: none;
          border: none;
          color: var(--taobao-gray);
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          padding: 8px 16px;
          border-radius: 4px;
          transition: all 0.3s ease;
        }

        .nav-item:hover,
        .nav-item.active {
          color: var(--taobao-orange);
          background-color: var(--taobao-orange-light);
        }

        .header-user {
          display: flex;
          align-items: center;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-greeting {
          color: var(--taobao-gray);
          font-size: 14px;
        }

        .username {
          color: var(--taobao-orange);
          font-weight: 500;
        }

        .logout-btn {
          font-size: 14px;
          padding: 4px 8px;
        }

        .auth-buttons {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .auth-buttons .btn {
          font-size: 14px;
          padding: 6px 12px;
        }

        .auth-buttons .btn.active {
          color: var(--taobao-orange);
          font-weight: 500;
        }

        .separator {
          color: var(--taobao-light-gray);
          font-size: 12px;
        }

        @media (max-width: 768px) {
          .header-container {
            padding: 0 12px;
            height: 56px;
          }

          .logo-text {
            font-size: 18px;
          }

          .nav-item {
            font-size: 14px;
            padding: 6px 12px;
          }

          .user-greeting {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;