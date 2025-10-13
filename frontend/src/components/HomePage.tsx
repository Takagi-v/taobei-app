import React from 'react';

interface HomePageProps {
  user: any;
  onNavigateToLogin: () => void;
  onNavigateToRegister: () => void;
  onLogout: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ 
  user, 
  onNavigateToLogin, 
  onNavigateToRegister, 
  onLogout 
}) => {
  const categories = [
    { name: '女装', icon: '👗', color: '#ff6b9d' },
    { name: '男装', icon: '👔', color: '#4ecdc4' },
    { name: '手机', icon: '📱', color: '#45b7d1' },
    { name: '家电', icon: '🏠', color: '#96ceb4' },
    { name: '美妆', icon: '💄', color: '#feca57' },
    { name: '母婴', icon: '👶', color: '#ff9ff3' },
    { name: '食品', icon: '🍎', color: '#54a0ff' },
    { name: '运动', icon: '⚽', color: '#5f27cd' },
  ];

  const hotProducts = [
    { id: 1, name: 'iPhone 15 Pro', price: '¥7999', image: '📱', sales: '10万+' },
    { id: 2, name: '小米电视', price: '¥2999', image: '📺', sales: '5万+' },
    { id: 3, name: '戴森吹风机', price: '¥2690', image: '💨', sales: '3万+' },
    { id: 4, name: 'AirPods Pro', price: '¥1999', image: '🎧', sales: '8万+' },
  ];

  return (
    <div className="homepage">
      {/* 轮播图区域 */}
      <section className="hero-section">
        <div className="hero-banner">
          <div className="banner-content">
            <h1 className="banner-title">淘宝网 - 淘！我喜欢</h1>
            <p className="banner-subtitle">亚洲较大的网上交易平台，提供各类服饰、美容、家居、数码、话费/点卡充值... 数亿优质商品，同时提供担保交易(先收货后付款)等安全交易保障服务</p>
            {!user && (
              <div className="banner-actions">
                <button className="btn btn-primary" onClick={onNavigateToRegister}>
                  立即注册
                </button>
                <button className="btn btn-secondary" onClick={onNavigateToLogin}>
                  登录
                </button>
              </div>
            )}
          </div>
          <div className="banner-image">
            <div className="floating-elements">
              <div className="floating-item" style={{top: '20%', left: '10%'}}>🛍️</div>
              <div className="floating-item" style={{top: '60%', left: '20%'}}>💎</div>
              <div className="floating-item" style={{top: '30%', right: '15%'}}>🎁</div>
              <div className="floating-item" style={{bottom: '20%', right: '25%'}}>⭐</div>
            </div>
          </div>
        </div>
      </section>

      {/* 分类导航 */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">热门分类</h2>
          <div className="categories-grid">
            {categories.map((category, index) => (
              <div key={index} className="category-item" style={{'--category-color': category.color} as any}>
                <div className="category-icon">{category.icon}</div>
                <span className="category-name">{category.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 热门商品 */}
      <section className="products-section">
        <div className="container">
          <h2 className="section-title">热门商品</h2>
          <div className="products-grid">
            {hotProducts.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image">{product.image}</div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-price">{product.price}</div>
                  <div className="product-sales">已售 {product.sales}</div>
                </div>
                <button className="btn btn-primary product-btn">立即购买</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 用户信息区域 */}
      {user && (
        <section className="user-section">
          <div className="container">
            <div className="user-welcome">
              <h2>欢迎回来，{user.phone}！</h2>
              <p>继续您的购物之旅</p>
            </div>
          </div>
        </section>
      )}

      <style jsx>{`
        .homepage {
          min-height: calc(100vh - 60px);
        }

        .hero-section {
          background: linear-gradient(135deg, #ff6600 0%, #ff9a56 100%);
          color: white;
          padding: 60px 0;
        }

        .hero-banner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }

        .banner-content {
          max-width: 500px;
        }

        .banner-title {
          font-size: 48px;
          font-weight: bold;
          margin-bottom: 20px;
          line-height: 1.2;
        }

        .banner-subtitle {
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 32px;
          opacity: 0.9;
        }

        .banner-actions {
          display: flex;
          gap: 16px;
        }

        .banner-actions .btn {
          padding: 12px 24px;
          font-size: 16px;
          font-weight: 500;
        }

        .banner-actions .btn-secondary {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
        }

        .banner-actions .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .banner-image {
          position: relative;
          height: 400px;
        }

        .floating-elements {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .floating-item {
          position: absolute;
          font-size: 48px;
          animation: float 3s ease-in-out infinite;
        }

        .floating-item:nth-child(2) {
          animation-delay: -1s;
        }

        .floating-item:nth-child(3) {
          animation-delay: -2s;
        }

        .floating-item:nth-child(4) {
          animation-delay: -0.5s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .categories-section,
        .products-section {
          padding: 60px 0;
        }

        .section-title {
          font-size: 32px;
          font-weight: bold;
          text-align: center;
          margin-bottom: 40px;
          color: var(--taobao-gray);
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 24px;
          max-width: 800px;
          margin: 0 auto;
        }

        .category-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 24px;
          background: white;
          border-radius: 12px;
          box-shadow: var(--shadow);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .category-item:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-hover);
        }

        .category-icon {
          font-size: 48px;
          margin-bottom: 12px;
          padding: 16px;
          border-radius: 50%;
          background: var(--category-color, var(--taobao-orange));
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .category-name {
          font-size: 16px;
          font-weight: 500;
          color: var(--taobao-gray);
        }

        .products-section {
          background: var(--taobao-bg);
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }

        .product-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: var(--shadow);
          transition: all 0.3s ease;
        }

        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-hover);
        }

        .product-image {
          height: 200px;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 64px;
        }

        .product-info {
          padding: 20px;
        }

        .product-name {
          font-size: 18px;
          font-weight: 500;
          margin-bottom: 8px;
          color: var(--taobao-gray);
        }

        .product-price {
          font-size: 24px;
          font-weight: bold;
          color: var(--taobao-red);
          margin-bottom: 4px;
        }

        .product-sales {
          font-size: 14px;
          color: var(--taobao-light-gray);
          margin-bottom: 16px;
        }

        .product-btn {
          width: 100%;
          padding: 10px;
          font-size: 14px;
        }

        .user-section {
          background: var(--taobao-orange-light);
          padding: 40px 0;
        }

        .user-welcome {
          text-align: center;
        }

        .user-welcome h2 {
          font-size: 28px;
          color: var(--taobao-orange);
          margin-bottom: 8px;
        }

        .user-welcome p {
          font-size: 16px;
          color: var(--taobao-gray);
        }

        @media (max-width: 768px) {
          .hero-banner {
            grid-template-columns: 1fr;
            gap: 40px;
            text-align: center;
          }

          .banner-title {
            font-size: 36px;
          }

          .banner-image {
            height: 300px;
          }

          .categories-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 16px;
          }

          .category-item {
            padding: 16px;
          }

          .category-icon {
            font-size: 32px;
            padding: 12px;
          }

          .products-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }

          .section-title {
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;