import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProduct, fetchProductReviews, postProductReview } from '../api';

export default function ProductDetail({ onAdd, onToggleWishlist, wishlist = [] }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [qty, setQty] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  useEffect(() => {
    if (!id) return;
    fetchProduct(id).then(setProduct).catch(console.error);
    fetchProductReviews(id).then(data => { if (Array.isArray(data)) setReviews(data); }).catch(()=>{});
  }, [id]);

  const sizesFor = {
    Men: ['S','M','L','XL','XXL'],
    Women: ['XS','S','M','L','XL'],
    Boys: ['XS','S','M','L'],
    Girls: ['XS','S','M']
  };

  if (!product) return <div style={{ padding:24 }}>Loading...</div>;

  const sizes = product.sizes || (product.gender ? sizesFor[product.gender] : null);

  const handleAdd = () => {
    if (sizes && sizes.length && !selectedSize) {
      alert('Please select a size');
      return;
    }
    const item = { id: product.id, title: product.title + (selectedSize ? ` (${selectedSize})` : ''), price: product.price, qty };
    onAdd && onAdd(item);
    navigate('/cart');
  };

  const submitReview = async () => {
    if (!reviewName || !reviewRating) return;
    try {
      const res = await postProductReview(id, { name: reviewName, rating: reviewRating, comment: reviewComment });
      if (res && res.id) {
        setReviews(prev => [res, ...prev]);
        setReviewName(''); setReviewRating(5); setReviewComment('');
      }
    } catch (e) { console.error(e); }
  };

  const avgRating = reviews.length ? (reviews.reduce((s,r)=>s+r.rating,0)/reviews.length).toFixed(1) : null;

  return (
    <div style={{ padding:24, maxWidth:980, margin:'0 auto', display:'grid', gridTemplateColumns:'420px 1fr', gap:24 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
        <img src={product.img || '/images/handloom1.svg'} alt={product.title} style={{ width:'100%', maxWidth:380, height:'auto', objectFit:'contain', borderRadius:8, boxShadow:'0 6px 18px rgba(0,0,0,0.08)' }} />
      </div>

      <div>
        <h2 style={{ marginTop:0 }}>{product.title}</h2>
        <div style={{ color:'#666', marginBottom:8 }}>{product.description}</div>
        <div style={{ fontWeight:700, fontSize:20, marginBottom:8 }}>₹{product.price}</div>
        <div style={{ marginBottom:12 }}><strong>Stock:</strong> {product.inventory}</div>

        {sizes && (
          <div style={{ marginBottom:12 }}>
            <div style={{ marginBottom:6 }}><strong>Choose size</strong></div>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {sizes.map(s => (
                <button key={s} onClick={() => setSelectedSize(s)} className={`chip ${selectedSize===s?'chip-active':''}`} style={{ padding:'8px 12px' }}>{s}</button>
              ))}
            </div>
          </div>
        )}

        <div style={{ display:'flex', gap:12, alignItems:'center', marginBottom:12 }}>
          <label style={{ display:'flex', alignItems:'center', gap:8 }}>
            Qty
            <input type="number" min={1} max={product.inventory} value={qty} onChange={e=>setQty(Number(e.target.value))} style={{ width:64 }} />
          </label>
          <button className="btn btn-primary" onClick={handleAdd} disabled={product.inventory<=0}>Buy / Add to Cart</button>
          <button className="btn btn-outline" onClick={() => navigate(-1)}>Back</button>
          <button className={`btn btn-outline wish-btn ${wishlist.find(w=>w.id===product.id)?'wish-active':''}`} onClick={() => onToggleWishlist && onToggleWishlist({ id: product.id, title: product.title, price: product.price, img: product.img })}>{wishlist.find(w=>w.id===product.id) ? '♥ Remove' : '♡ Wishlist'}</button>
        </div>

        <div style={{ marginTop:18 }}>
          <h4 style={{ margin:0 }}>About this product</h4>
          <div style={{ color:'#555', marginTop:8 }}>{product.description}</div>
        </div>

        <section style={{ marginTop:24 }}>
          <h3>Reviews</h3>
          {reviews.length === 0 && <div className="muted">No reviews yet — be the first to review.</div>}
          <div style={{ display:'grid', gap:12, marginTop:8 }}>
            {reviews.map(r => (
              <div key={r.id} style={{ padding:10, borderRadius:8, background:'#fff', boxShadow:'0 4px 10px rgba(0,0,0,0.03)' }}>
                <div style={{ display:'flex', justifyContent:'space-between' }}>
                  <strong>{r.name}</strong>
                  <span style={{ color:'#ffb400' }}>★ {r.rating}</span>
                </div>
                <div style={{ color:'#666', marginTop:6 }}>{r.comment}</div>
                <div style={{ color:'#aaa', fontSize:12, marginTop:6 }}>{new Date(r.createdAt).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <aside>
        <div className="auth-card">
          <h4 style={{ marginTop:0 }}>Add a review</h4>
          <input className="form-input" placeholder="Your name" value={reviewName} onChange={e=>setReviewName(e.target.value)} />
          <label style={{ fontSize:13 }}>Rating</label>
          <select className="form-input" value={reviewRating} onChange={e=>setReviewRating(Number(e.target.value))}>
            {[5,4,3,2,1].map(v => <option key={v} value={v}>{v} star{v>1?'s':''}</option>)}
          </select>
          <textarea className="form-input" placeholder="Write a short review" value={reviewComment} onChange={e=>setReviewComment(e.target.value)} />
          <div style={{ display:'flex', gap:8 }}>
            <button className="btn btn-primary" onClick={submitReview}>Submit review</button>
          </div>
        </div>
      </aside>
    </div>
  );
}
