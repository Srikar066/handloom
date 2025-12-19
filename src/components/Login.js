import React, { useState } from 'react';
import { login, resetPassword } from '../api';
import { Link, useNavigate } from 'react-router-dom';
import Register from './Register';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetPasswordValue, setResetPasswordValue] = useState('');
  const [resetPhone, setResetPhone] = useState('');
  const [resetOtpSent, setResetOtpSent] = useState(false);
  const [resetOtp, setResetOtp] = useState('');
  const nav = useNavigate();

  const submit = async e => {
    e.preventDefault();
    try {
      const res = await login({ email, password });
      if (res && res.user) {
        onLogin(res.user);
        nav('/');
      } else if (res && res.error) {
        setMsg(res.error || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      setMsg('Login failed');
    }
  };

  const doReset = async () => {
    // open reset modal
    setResetEmail(email || '');
    setShowReset(true);
  };

  const submitReset = async () => {
    // support reset by phone+otp or email
    try {
      if (resetPhone && resetOtp) {
        const res = await resetPassword({ phone: resetPhone, newPassword: resetPasswordValue, code: resetOtp });
        if (res && res.ok) {
          setMsg('Password has been reset (mock). Please log in.');
          setShowReset(false);
          setResetPasswordValue('');
          setResetOtp('');
          setResetOtpSent(false);
          return;
        }
        setMsg(res.error || 'Reset failed');
        return;
      }
      if (!resetEmail || !resetPasswordValue) return setMsg('Provide email or phone and new password');
      const res = await resetPassword({ email: resetEmail, newPassword: resetPasswordValue });
      if (res && res.ok) {
        setMsg('Password has been reset (mock). Please log in.');
        setShowReset(false);
        setResetPasswordValue('');
      } else {
        setMsg(res.error || 'Reset failed');
      }
    } catch (e) {
      console.error(e);
      setMsg('Reset failed');
    }
  };

  const sendResetOtp = async () => {
    if (!resetPhone) return setMsg('Enter phone');
    try {
      const res = await fetch((process.env.REACT_APP_API_BASE || 'http://localhost:5000') + '/api/send-otp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone: resetPhone }) });
        const data = await res.json();
        if (data && data.ok) {
          setResetOtpSent(true);
          setMsg('OTP sent to ' + resetPhone);
        } else setMsg(data.error || 'Failed to send OTP');
    } catch (e) { console.error(e); setMsg('Send OTP failed'); }
  };

  return (
    <div style={{ maxWidth:420, margin:'24px auto', padding:16 }}>
      <h2>Login</h2>
      <div className="auth-card">
        <form onSubmit={submit} style={{ display:'grid', gap:10 }}>
          <input className="form-input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="form-input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <button type="submit" className="btn btn-primary">Sign in</button>
            <div style={{ marginLeft: 'auto' }}>
              <button type="button" onClick={() => setShowRegister(true)} className="btn btn-outline" style={{ marginRight:8 }}>Create account</button>
              <button type="button" onClick={doReset} className="btn btn-outline">Reset password</button>
            </div>
          </div>
        </form>
      </div>
      {msg && <p style={{ marginTop:12 }}>{msg}</p>}

      {showRegister && (
        <div className="modal-overlay" onClick={() => setShowRegister(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowRegister(false)}>×</button>
            <Register onRegister={(u) => { setShowRegister(false); onLogin && onLogin(u); }} />
          </div>
        </div>
      )}

      {showReset && (
        <div className="modal-overlay" onClick={() => setShowReset(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowReset(false)}>×</button>
            <div className="auth-card">
              <h3 style={{ marginTop:0 }}>Reset Password</h3>
              <div style={{ display:'grid', gap:8 }}>
                <input className="form-input" placeholder="Email" value={resetEmail} onChange={e=>setResetEmail(e.target.value)} />
                <input className="form-input" placeholder="Phone (optional) e.g. +911234567890" value={resetPhone} onChange={e=>setResetPhone(e.target.value)} />
                <div style={{ display:'flex', gap:8 }}>
                  <button className="btn btn-outline" onClick={sendResetOtp} disabled={!resetPhone}>Send OTP</button>
                  {resetOtpSent && <input className="form-input" placeholder="Enter OTP" value={resetOtp} onChange={e=>setResetOtp(e.target.value)} style={{ flex:1 }} />}
                </div>
                <input className="form-input" placeholder="New password" type="password" value={resetPasswordValue} onChange={e=>setResetPasswordValue(e.target.value)} />
                <div style={{ display:'flex', gap:8 }}>
                  <button className="btn btn-primary" onClick={submitReset}>Reset password</button>
                  <button className="btn btn-outline" onClick={() => setShowReset(false)}>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
