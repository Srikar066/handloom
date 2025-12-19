import React, { useState } from 'react';
import { register, sendOtp, verifyOtp } from '../api';
import { useNavigate } from 'react-router-dom';

export default function Register({ onRegister }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'buyer', phone: '' });
  const [msg, setMsg] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);
  const nav = useNavigate();

  const sendOtpToPhone = async () => {
    if (!form.phone) return setMsg('Enter phone number');
    try {
      const res = await sendOtp({ phone: form.phone });
      if (res && res.ok) {
        setOtpSent(true);
        setMsg('OTP sent to ' + form.phone + ' (check server logs in dev)');
      } else setMsg(res.error || 'Failed to send OTP');
    } catch (e) { console.error(e); setMsg('Failed to send OTP'); }
  };

  const verifyPhoneOtp = async () => {
    try {
      const res = await verifyOtp({ phone: form.phone, code: otpCode });
      if (res && res.ok) {
        setPhoneVerified(true);
        setMsg('Phone verified');
      } else {
        setMsg(res.error || 'Invalid OTP');
      }
    } catch (e) { console.error(e); setMsg('Verify failed'); }
  };

  const submit = async e => {
    e.preventDefault();
    if (form.phone && !phoneVerified) return setMsg('Please verify phone via OTP');
    try {
      const res = await register(form);
      if (res && res.user) {
        setMsg('Registered.');
        onRegister && onRegister(res.user);
        nav('/');
      } else if (res && res.error) {
        setMsg(res.error);
      }
    } catch (err) {
      console.error(err);
      setMsg('Registration failed');
    }
  };

  return (
    <div className="auth-card">
      <h2 style={{ marginTop: 0 }}>Create an account</h2>
      <form onSubmit={submit} style={{ display:'grid', gap:10 }}>
        <input className="form-input" placeholder="Full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
        <input className="form-input" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
        <input className="form-input" placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
        <input className="form-input" placeholder="Phone (optional)" value={form.phone} onChange={e=>{ setForm({...form,phone:e.target.value}); setPhoneVerified(false); setOtpSent(false); }} />
        <div style={{ display:'flex', gap:8 }}>
          <button type="button" onClick={sendOtpToPhone} className="btn btn-outline">Send OTP</button>
          <input className="form-input" placeholder="Enter OTP" value={otpCode} onChange={e=>setOtpCode(e.target.value)} style={{ width:140 }} />
          <button type="button" onClick={verifyPhoneOtp} className="btn btn-sm">Verify</button>
        </div>
        <select className="form-select" value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
          <option value="buyer">Buyer</option>
          <option value="artisan">Artisan</option>
        </select>
        <div className="auth-actions">
          <button type="submit" className="btn btn-primary">Create account</button>
          <div style={{ marginLeft:'auto' }} className="auth-note">By creating an account you agree to the Terms.</div>
        </div>
      </form>
      {msg && <p style={{ marginTop:12 }}>{msg}</p>}
    </div>
  );
}
