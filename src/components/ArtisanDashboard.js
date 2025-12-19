import React, { useState, useEffect } from 'react';
import { createProduct, fetchProducts } from '../api';

export default function ArtisanDashboard({ user }) {
  const [form, setForm] = useState({ title: '', price: '', inventory: 1, artisan: '', description: '' });
  const [msg, setMsg] = useState('');
  const [myProducts, setMyProducts] = useState([]);

  useEffect(() => {
    fetchProducts().then(list => {
      if (Array.isArray(list) && user && user.email) {
        setMyProducts(list.filter(p => (p.artisan || '').toLowerCase() === (user.name || user.email).toLowerCase() || (p.artisan || '').toLowerCase() === (user.email || '').toLowerCase()));
      } else {
        setMyProducts([]);
      }
    }).catch(() => setMyProducts([]));
  }, [user]);

  const submit = async e => {
    e.preventDefault();
    try {
      const payload = { ...form, price: Number(form.price), inventory: Number(form.inventory), artisan: form.artisan || (user && user.name) || '' };
      const res = await createProduct(payload);
      setMsg('Product created');
      setForm({ title: '', price: '', inventory: 1, artisan: '', description: '' });
      setMyProducts(prev => [res, ...prev]);
    } catch (err) {
      console.error(err);
      setMsg('Error creating product');
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: '18px auto', padding: 12 }}>
      <h2>Artisan Dashboard</h2>
      <p>Welcome{user && user.name ? `, ${user.name}` : ''}. List new products and manage inventory.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 18 }}>
        <div style={{ background: '#fff', padding: 16, borderRadius: 10 }}>
          <h3>Add New Product</h3>
          <form onSubmit={submit} style={{ display: 'grid', gap: 8 }}>
            <input placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
            <input placeholder="Price (₹)" type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} />
            <input placeholder="Inventory" type="number" value={form.inventory} onChange={e=>setForm({...form,inventory:Number(e.target.value)})} />
            <input placeholder="Artisan name (optional)" value={form.artisan} onChange={e=>setForm({...form,artisan:e.target.value})} />
            <textarea placeholder="Short description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
            <button type="submit" className="btn btn-primary">Create Product</button>
            {msg && <p style={{ marginTop:8 }}>{msg}</p>}
          </form>
        </div>

        <div>
          <h3>Your Products</h3>
          <div style={{ display:'grid', gap:10 }}>
            {myProducts.length === 0 && <p>No products yet.</p>}
            {myProducts.map(p => (
              <div key={p.id} style={{ background:'#fff', padding:10, borderRadius:8 }}>
                <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                  <img src={p.img || '/images/handloom1.svg'} alt={p.title} style={{ width:72, height:72, objectFit:'cover', borderRadius:6 }} />
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700 }}>{p.title}</div>
                    <div style={{ color:'#666' }}>₹{p.price} • {p.inventory} in stock</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
