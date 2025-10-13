import React, { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Header from './components/Header';

type Page = 'home' | 'login' | 'register';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [user, setUser] = useState(null);

  // 页面加载时检查localStorage中的用户信息
  useEffect(() => {
    const savedUserInfo = localStorage.getItem('userInfo');
    if (savedUserInfo) {
      try {
        const userInfo = JSON.parse(savedUserInfo);
        setUser(userInfo);
      } catch (error) {
        console.error('解析用户信息失败:', error);
        localStorage.removeItem('userInfo');
      }
    }
  }, []);

  const handleLoginSuccess = (loginData: any) => {
    // 处理登录成功逻辑
    console.log('登录成功，接收到的数据:', loginData);
    if (loginData && loginData.user) {
      setUser(loginData.user);
      // token已经在LoginForm中保存到localStorage了
      setCurrentPage('home');
    } else {
      console.error('登录数据格式错误:', loginData);
    }
  };

  const handleRegisterSuccess = (registerData: any) => {
    // 处理注册成功逻辑
    console.log('注册成功，接收到的数据:', registerData);
    if (registerData && registerData.user) {
      setUser(registerData.user);
      // token已经在RegisterForm中保存到localStorage了
      setCurrentPage('home');
    } else {
      console.error('注册数据格式错误:', registerData);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
    localStorage.removeItem('authToken');
    setCurrentPage('home');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'login':
        return (
          <LoginForm
            onLoginSuccess={handleLoginSuccess}
            onNavigateToRegister={() => setCurrentPage('register')}
          />
        );
      case 'register':
        return (
          <RegisterForm
            onRegisterSuccess={handleRegisterSuccess}
            onNavigateToLogin={() => setCurrentPage('login')}
          />
        );
      default:
        return (
          <HomePage
            user={user}
            onNavigateToLogin={() => setCurrentPage('login')}
            onNavigateToRegister={() => setCurrentPage('register')}
            onLogout={handleLogout}
          />
        );
    }
  };

  return (
    <div className="app">
      <Header 
        user={user}
        currentPage={currentPage}
        onNavigateToHome={() => setCurrentPage('home')}
        onNavigateToLogin={() => setCurrentPage('login')}
        onNavigateToRegister={() => setCurrentPage('register')}
        onLogout={handleLogout}
      />
      <main className="main-content">
        {renderCurrentPage()}
      </main>
    </div>
  );
}

export default App;