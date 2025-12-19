import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../api';
import { Link } from 'react-router-dom';

export default function ProductList({ onAdd, onToggleWishlist, wishlist = [] }) {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('featured');

  useEffect(() => {
    fetchProducts().then(data => {
      setProducts(Array.isArray(data) ? data : []);
    }).catch(console.error);
  }, []);

  // sizes mapping for gendered products
  const sizesFor = {
    'Men': ['S','M','L','XL','XXL'],
    'Women': ['XS','S','M','L','XL'],
    'Boys': ['10','12','13','15'],
    'Girls': ['10','12','13','15']
  };

  // filter by search
  const filtered = products.filter(p => {
    if (!searchQuery) return true;
    const s = searchQuery.toLowerCase();
    return (p.title || '').toLowerCase().includes(s) || (p.description || '').toLowerCase().includes(s) || (p.subcategory || '').toLowerCase().includes(s);
  });

  // sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortOption === 'price-asc') return Number(a.price) - Number(b.price);
    if (sortOption === 'price-desc') return Number(b.price) - Number(a.price);
    if (sortOption === 'newest') return Number(b.id) - Number(a.id);
    // featured default: show featured first, then by id desc
    if (sortOption === 'featured') {
      const fa = a.featured ? 0 : 1;
      const fb = b.featured ? 0 : 1;
      if (fa !== fb) return fa - fb;
      return Number(b.id) - Number(a.id);
    }
    return 0;
  });

  const list = sorted;

  return (
    <div className="products-page business-style" style={{ display:'block' }}>
      <main>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
          <h2 style={{ color: '#000', margin:0 }}>Products</h2>
          <div style={{ color:'#666' }}>{list.length} products</div>
        </div>

        <div style={{ display:'flex', gap:12, marginBottom:12, flexWrap:'wrap' }}>
          <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Search products" className="form-input" style={{ maxWidth:360 }} />
          <select value={sortOption} onChange={e=>setSortOption(e.target.value)} className="form-select" style={{ width:200 }}>
            <option value="featured">Sort: Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
        </div>

        {/* Business product table */}
        <div className="product-table">
          <div className="product-table-head">
            <div className="col image-col">Image</div>
            <div className="col title-col">Product</div>
            <div className="col category-col">Category</div>
            <div className="col price-col">Price</div>
            <div className="col stock-col">Stock</div>
            <div className="col actions-col">Actions</div>
          </div>

          <div className="product-table-body">
            {list.map(p => (
              <div key={p.id} className="product-row">
                <div className="col image-col"><img src={p.img || '/images/handloom1.svg'} alt={p.title} style={{ width:72, height:72, objectFit:'cover', borderRadius:6 }} /></div>
                <div className="col title-col">
                    <div style={{ fontWeight:700 }}>{p.title}</div>
                    <div style={{ color:'#666', fontSize:12 }}>{p.description}</div>
                    {/* show sizes when product has a known gender */}
                    {(p.gender && sizesFor[p.gender]) && (
                      <div style={{ marginTop:6 }}>
                        <strong style={{ fontSize:12, color:'#333' }}>Sizes:</strong>
                        <div style={{ display:'inline-flex', gap:6, marginLeft:8 }}>
                          {sizesFor[p.gender].map(s => (
                            <span key={s} style={{ padding:'4px 8px', borderRadius:6, border:'1px solid #e6e6e6', background:'#fff', fontSize:12 }}>{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
                <div className="col category-col">{p.category} / {p.subcategory}</div>
                <div className="col price-col">₹{p.price}</div>
                <div className="col stock-col">{p.inventory}</div>
                <div className="col actions-col">
                  <Link to={`/products/${p.id}`} className="btn btn-outline" style={{ marginRight:8 }}>View</Link>
                  <button onClick={() => onAdd && onAdd({ id: p.id, title: p.title, price: p.price, qty: 1 })} disabled={p.inventory<=0} className="btn btn-primary">Add</button>
                  <button className={`btn btn-outline wish-btn ${wishlist.find(w=>w.id===p.id)?'wish-active':''}`} onClick={() => onToggleWishlist && onToggleWishlist({ id: p.id, title: p.title, price: p.price, img: p.img })} style={{ marginLeft:8 }}>{wishlist.find(w=>w.id===p.id) ? '♥' : '♡'}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
