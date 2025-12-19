import React from 'react';

export default function Profile() {
  let raw = localStorage.getItem('user');
  let user = null;
  try { user = raw ? JSON.parse(raw) : null; } catch(e) { user = null; }

  if (!user) return (
    <div style={{ padding:24 }}>
      <h2>Profile</h2>
      <p>You are not logged in. Please sign in to view your profile.</p>
    </div>
  );

  return (
    <div style={{ padding:24, maxWidth:720, margin:'0 auto' }}>
      <div style={{ display:'flex', gap:16, alignItems:'center' }}>
        <div style={{ width:84, height:84, borderRadius:42, background:'#0078d4', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28 }}>{(user.name||'U')[0].toUpperCase()}</div>
        <div>
          <h2 style={{ margin:0 }}>{user.name}</h2>
          <div style={{ color:'#666' }}>{user.email}</div>
          <div style={{ color:'#666' }}>Role: {user.role || 'buyer'}</div>
        </div>
      </div>

      <section style={{ marginTop:18 }}>
        <h3>Account</h3>
        <ul>
          <li>Orders: (demo)</li>
          <li>Wishlist items: (demo)</li>
        </ul>
      </section>
    </div>
  );
}
