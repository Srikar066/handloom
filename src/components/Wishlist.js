import React from 'react';
import { Link } from 'react-router-dom';

export default function Wishlist({ items = [], onRemove, onAddToCart }) {
  return (
    <div style={{ maxWidth:1000, margin:'18px auto' }}>
      <h2>Wishlist</h2>
      {items.length === 0 ? (
        <div className="auth-card">Your wishlist is empty. <Link to="/products">Browse products</Link></div>
      ) : (
        <div style={{ display:'grid', gap:12 }}>
          {items.map(it => (
            <div key={it.id} style={{ display:'flex', gap:12, alignItems:'center', padding:12, background:'#fff', borderRadius:8 }}>
              <img src={it.img || '/images/handloom1.svg'} alt={it.title} style={{ width:84, height:84, objectFit:'cover', borderRadius:6 }} />
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700 }}>{it.title}</div>
                <div style={{ color:'#666' }}>₹{it.price}</div>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <button className="btn btn-outline" onClick={() => onAddToCart && onAddToCart(it)}>Add to cart</button>
                <button className="btn btn-primary" onClick={() => onRemove && onRemove(it)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
