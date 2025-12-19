import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../api';

const sampleProducts = [
  { id: 1, title: 'Silk Sari with Ikat Motif', price: 8999, img: '/images/handloom1.svg', desc: 'Hand-dyed silk sari woven using traditional ikat techniques.' },
  { id: 2, title: 'Organic Cotton Kurta', price: 2999, img: '/images/handloom2.svg', desc: 'Soft handloom cotton kurta, breathable and comfortable.' },
  { id: 3, title: 'Handwoven Shawl', price: 4999, img: '/images/handloom3.svg', desc: 'Wool shawl woven on a pit loom with natural dyes.' }
];

export default function Home({ onAdd, onToggleWishlist, wishlist = [], searchQuery = '' }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchProducts()
      .then(data => {
        if (!mounted) return;
        if (Array.isArray(data) && data.length) {
          const view = data.map(p => ({ id: p.id, title: p.title || p.name || 'Product', price: p.price || 0, img: p.img || '/images/handloom1.svg', desc: p.description || p.desc || '' }));
          setProducts(view.slice(0, 8));
        } else {
          setProducts(sampleProducts);
        }
      })
      .catch(err => {
        console.error('Error fetching products', err);
        setProducts(sampleProducts);
      })
      .finally(() => setLoading(false));
    return () => { mounted = false; };
  }, []);

  const categories = [
    { id: 'apparel', name: 'Apparel', desc: 'Sarees, Kurtas & more' },
    { id: 'home', name: 'Home Furnishings', desc: 'Bed, Bath & Table Linen' },
    { id: 'accessories', name: 'Accessories', desc: 'Bags, Scarves & Footwear' }
  ];

  // top categories are shown in the navbar now; Home receives searchQuery via props

  // slider slides
  const slides = [
    { id: 1, title: 'men fashion', subtitle: 'Crafted by artisans — ethically sourced', img: '/images/4f.jpg' },
    { id: 2, title: 'Timeless Sarees', subtitle: 'Ikat, Kanjivaram and more', img: '/images/5f.jpeg' },
    { id: 3, title: 'Bedsheets', subtitle: 'Bed, Bath & Table in handloom', img: '/images/2f.jpg' },
    { id: 4, title: 'Artisan Accessories', subtitle: 'Bags, Scarves & Jewelry', img: '/images/3f.jpg' },
    { id: 5, title: ' Fashion', subtitle: 'Slow-made, quality-first', img: '/images/1f.jpg' }
  ];

  const [slideIdx, setSlideIdx] = useState(0);
  // auto-advance using timeout so manual changes reset timing
  useEffect(() => {
    const t = setTimeout(() => setSlideIdx(s => (s + 1) % slides.length), 3000);
    return () => clearTimeout(t);
  }, [slideIdx]);

  return (
    <div className="home-root">
      <header className="home-hero slide-hero">
        <div className="slide-left">
          <div className="header-row">
            <div className="header-left">
              <div className="slide-brand">Handloom Bazaar</div>
              <div className="slide-title" style={{ marginTop:4 }}>{slides[slideIdx].title}</div>
              <div className="slide-sub">{slides[slideIdx].subtitle}</div>
            </div>
            {/* removed search and top category pills from slide header — now in navbar */}
          </div>
        </div>
        <div className="slide-right" style={{ position:'relative' }}>
          <img key={slides[slideIdx].id} className="slide-img" src={slides[slideIdx].img} alt={slides[slideIdx].title} />
          {/* left / right arrows */}
          <button className="icon-button" style={{ position:'absolute', left:8, top:'45%', transform:'translateY(-50%)', zIndex:4 }} onClick={() => setSlideIdx((slideIdx-1+slides.length)%slides.length)} aria-label="Previous slide">◀</button>
          <button className="icon-button" style={{ position:'absolute', right:8, top:'45%', transform:'translateY(-50%)', zIndex:4 }} onClick={() => setSlideIdx((slideIdx+1)%slides.length)} aria-label="Next slide">▶</button>
          {/* progress bar replaces dots */}
          <div className="slide-progress">
            <div key={slideIdx} className="slide-progress-bar animate" />
          </div>
        </div>
      </header>

      {/* inline top categories next to heading (moved into slide-left) - removed separate block */}

      <section className="home-categories">
        <h2>Shop by Category</h2>
        <div className="categories-grid">
          {categories.map(c => (
            <Link key={c.id} to={`/products?category=${encodeURIComponent(c.name)}`} className="category-card">
              <div className="category-icon">{c.name.charAt(0)}</div>
              <div className="category-body">
                <div className="category-title">{c.name}</div>
                <div className="category-desc">{c.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-featured">
        <h2>Featured Products</h2>
        {loading && <p>Loading products...</p>}
        <div className="featured-grid">
          {((products.length ? products : sampleProducts).filter(p => {
            const s = (searchQuery || '').toLowerCase();
            if (!s) return true;
            const q = s;
            return (p.title && p.title.toLowerCase().includes(q)) || (p.desc && p.desc.toLowerCase().includes(q)) || (p.subcategory && p.subcategory.toLowerCase().includes(q));
          })).map(p => (
            <div className="product-card" key={p.id} style={{ position:'relative' }}>
              <img src={p.img} alt={p.title} />
              <div className="product-info">
                <h3>{p.title}</h3>
                <p className="muted">{p.desc}</p>
                <div className="product-row">
                  <div className="price">₹{p.price}</div>
                  <div className="actions-inline">
                    <button onClick={() => onAdd && onAdd({ id: p.id, title: p.title, price: p.price, qty: 1 })} className="btn btn-sm">Add to cart</button>
                    <button className={`wish-btn ${wishlist.find(w=>w.id===p.id)?'wish-active':''}`} onClick={() => onToggleWishlist && onToggleWishlist({ id: p.id, title: p.title, price: p.price, img: p.img })} title="Add to wishlist">{wishlist.find(w=>w.id===p.id) ? '♥' : '♡'}</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="home-artisans">
        <h2>Artisan Spotlight</h2>
        <div className="artisan-card">
          <img src="/images/handloom2.svg" alt="Artisan" />
          <div>
            <h3>Rahul</h3>
            <p className="muted">Asha has been weaving Ikat sarees for over 20 years. Her work reflects generations of technique and a love for bold motifs.</p>
            <Link to="/artisan" className="btn btn-outline">View Artisan Profile</Link>
          </div>
        </div>
        <div className="artisan-card">
          <img src="/images/handloom2.svg" alt="Artisan" />
          <div>
            <h3> Sai sri</h3>
            <p className="muted">Asha has been weaving Ikat sarees for over 20 years. Her work reflects generations of technique and a love for bold motifs.</p>
            <Link to="/artisan" className="btn btn-outline">View Artisan Profile</Link>
          </div>
        </div>
        <div className="artisan-card">
          <img src="/images/handloom2.svg" alt="Artisan" />
          <div>
            <h3> Akshaya</h3>
            <p className="muted">Asha has been weaving Ikat sarees for over 20 years. Her work reflects generations of technique and a love for bold motifs.</p>
            <Link to="/artisan" className="btn btn-outline">View Artisan Profile</Link>
          </div>
        </div>
      </section>

      <section className="home-testimonials">
        <h2>What Buyers Say</h2>
        <div className="testimonials">
          <blockquote>"Beautiful craftsmanship, excellent quality — the sari I ordered arrived quickly and was even more stunning in person."</blockquote>
          <cite>- Priya, Mumbai</cite>
        </div>
        <div className="testimonials">
          <blockquote>"Hard workers of the artisans which i bought the best quality and premium clothing of the local products!!."</blockquote>
          <cite>- jaswanth, vizag</cite>
        </div>
      </section>
    </div>
  );
}