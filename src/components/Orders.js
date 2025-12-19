import React, { useEffect, useState } from 'react';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    fetch((process.env.REACT_APP_API_BASE || 'http://localhost:5000') + '/api/orders')
      .then(r => r.json()).then(setOrders).catch(console.error);
  }, []);
  return (
    <div style={{ maxWidth:1000, margin:'18px auto' }}>
      <h2>Orders</h2>
      {orders.length===0 ? <div className="auth-card">No orders yet.</div> : (
        <div style={{ display:'grid', gap:12 }}>
          {orders.map(o => (
            <div key={o.id} style={{ background:'#fff', padding:12, borderRadius:8 }}>
              <div style={{ display:'flex', justifyContent:'space-between' }}>
                <div><strong>Order #{o.id}</strong></div>
                <div>{new Date(o.createdAt).toLocaleString()}</div>
              </div>
              <div style={{ marginTop:8 }}>
                {o.items.map(it => (
                  <div key={it.id} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0' }}>{it.title} x {it.qty} <span>₹{it.price*it.qty}</span></div>
                ))}
              </div>
              <div style={{ marginTop:8, fontWeight:800 }}>Total: ₹{o.total}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
