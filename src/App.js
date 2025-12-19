import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Login from './components/Login';
import Wishlist from './components/Wishlist';
import Orders from './components/Orders';
import AdminDashboard from './components/AdminDashboard';
import ArtisanDashboard from './components/ArtisanDashboard';
import MarketingDashboard from './components/MarketingDashboard';
import Footer from './components/Footer';
import Profile from './components/Profile';

function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart') || '[]'));
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem('wishlist') || '[]'));
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => localStorage.setItem('cart', JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem('user', JSON.stringify(user)), [user]);
  useEffect(() => localStorage.setItem('wishlist', JSON.stringify(wishlist)), [wishlist]);

  const onAdd = item => {
    setCart(prev => {
      const found = prev.find(p => p.id === item.id);
      if (found) return prev.map(p => p.id === item.id ? { ...p, qty: p.qty + 1 } : p);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const logout = () => setUser(null);

  const toggleWishlist = (item) => {
    setWishlist(prev => {
      const exists = prev.find(p => p.id === item.id);
      if (exists) return prev.filter(p => p.id !== item.id);
      return [...prev, item];
    });
  };

  const clearWishlist = () => setWishlist([]);

  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef();

  useEffect(() => {
    const onDoc = e => { if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false); };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  return (
    <BrowserRouter>
      <div className="App">
        <nav className="main-nav">
          <div className="nav-left">
            <Link to="/" className="brand-left">
              <picture>
                <source srcSet="/logo-hd.avif" type="image/avif" />
                <img src="/logo192.png" alt="Handloom Bazaar" className="brand-logo" />
              </picture>
              <span style={{ marginLeft:8 }}>Handloom Bazaar</span>
            </Link>
            {/* top categories next to brand, with search immediately after pills */}
            <div className="nav-topcats">
              {['Men','Women','Boys','Girls','Accessories'].map(tc => (
                <Link key={tc} to={`/products?subcategory=${encodeURIComponent(tc)}`} className="topcat-pill">{tc}</Link>
              ))}
              <div className="nav-search-inline">
                <input placeholder="Search products, categories or artisans" value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="nav-right">
            <div className="nav-item">
              <Link to="/" className="icon-button" title="Home">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 11.5L12 4l9 7.5" stroke="#0b3f2f" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 21V11h14v10" stroke="#0b3f2f" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
              <div className="nav-label">Home</div>
            </div>

            <div className="nav-item">
              <Link to="/products" className="icon-button" title="Products">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 2h12l1 6H5L6 2z" stroke="#0b3f2f" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 8h18l-1 10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2L3 8z" stroke="#0b3f2f" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
              <div className="nav-label">Products</div>
            </div>

            <div className="nav-item">
              <Link to="/cart" className="icon-button" title="Cart">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6h18l-1.5 9h-12L3 6z" stroke="#0b3f2f" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 6L1 2" stroke="#0b3f2f" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span className="cart-badge">{cart.reduce((s,i)=>s+i.qty,0)}</span>
              </Link>
              <div className="nav-label">Cart</div>
            </div>

            <div className="nav-item">
              <Link to="/wishlist" className="icon-button" title="Wishlist">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.8 4.6a5 5 0 0 0-7.07 0L12 6.35l-1.73-1.75a5 5 0 0 0-7.07 7.07L12 21l8.8-9.33a5 5 0 0 0 0-7.07z" stroke="#0b3f2f" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span className="cart-badge" style={{ background:'#0b6b4f' }}>{wishlist.length}</span>
              </Link>
              <div className="nav-label">Wishlist</div>
            </div>

            <div ref={profileRef} style={{ position:'relative' }} className="nav-item">
              <button className="profile-icon" onClick={() => setProfileOpen(o => !o)} title="Profile">
                {user ? (
                  <span className="avatar-initial">{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5z" stroke="#0b3f2f" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 20c0-3.31 2.69-6 6-6h4c3.31 0 6 2.69 6 6" stroke="#0b3f2f" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
              <div className="nav-label">Account</div>
              {profileOpen && (
                <div className="profile-menu">
                  {user ? (
                    <>
                      <Link to="/orders" className="profile-menu-item">My Orders</Link>
                      <Link to="/profile" className="profile-menu-item">Profile</Link>
                      <button className="profile-menu-item" onClick={() => { logout(); setProfileOpen(false); }}>Logout</button>
                    </>
                  ) : (
                    <Link to="/login" className="profile-menu-item">Login / Register</Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </nav>

        <main style={{ padding: 12 }}>
          <Routes>
            <Route path="/" element={<Home onAdd={onAdd} onToggleWishlist={toggleWishlist} wishlist={wishlist} searchQuery={searchQuery} />} />
            <Route path="/products" element={<ProductList onAdd={onAdd} onToggleWishlist={toggleWishlist} wishlist={wishlist} />} />
            <Route path="/products/:id" element={<ProductDetail onAdd={onAdd} onToggleWishlist={toggleWishlist} wishlist={wishlist} />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/cart" element={<Cart items={cart} setItems={setCart} user={user} />} />
            <Route path="/wishlist" element={<Wishlist items={wishlist} onRemove={(it)=>toggleWishlist(it)} onAddToCart={(it)=>{ onAdd(it); toggleWishlist(it); }} />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/login" element={<Login onLogin={setUser} />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/artisan" element={<ArtisanDashboard />} />
            <Route path="/marketing" element={<MarketingDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
