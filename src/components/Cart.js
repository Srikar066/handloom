import React, { useState, useEffect } from 'react';
import { createOrder } from '../api';

export default function Cart({ items, setItems, user }) {
  const [status, setStatus] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [paymentDetails, setPaymentDetails] = useState({ cardNumber: '', upiId: '' });
  const [processing, setProcessing] = useState(false);

  useEffect(() => setStatus(null), [items]);

  const total = items.reduce((s, it) => s + it.price * it.qty, 0);

  const validatePayment = () => {
    if (paymentMethod === 'card') {
      return paymentDetails.cardNumber && paymentDetails.cardNumber.replace(/\s+/g, '').length >= 12;
    }
    if (paymentMethod === 'upi') {
      return paymentDetails.upiId && paymentDetails.upiId.includes('@');
    }
    return true;
  };

  const updateQty = (id, delta) => {
    setItems(prev => prev.map(it => it.id === id ? { ...it, qty: Math.max(1, it.qty + delta) } : it));
  };

  const removeItem = id => {
    setItems(prev => prev.filter(it => it.id !== id));
  };

  const checkout = async () => {
    if (!items.length) return setStatus('Cart is empty');
    if (!validatePayment()) return setStatus('Please provide valid payment details');

    const order = { items, buyer: user || { email: 'guest' }, payment: { method: paymentMethod, details: paymentDetails }, total };
    setProcessing(true);
    setStatus('Processing payment...');
    try {
      await new Promise(r => setTimeout(r, 800));
      const res = await createOrder(order);
      setStatus('Order created: #' + res.id + ' — Payment: ' + paymentMethod.toUpperCase());
      setItems([]);
      setPaymentDetails({ cardNumber: '', upiId: '' });
    } catch (e) {
      console.error(e);
      setStatus('Error creating order');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="cart-container">
      <div className="cart-header">
        <img src="/images/cart.svg" alt="Cart" className="cart-logo" />
        <div>
          <h2 style={{ margin: 0 }}>Your Cart</h2>
          <p style={{ margin: 0, color: '#666' }}>{items.length} item(s)</p>
        </div>
      </div>

      {items.length === 0 && <p>Your cart is empty.</p>}

      {items.length > 0 && (
        <div className="cart-list">
          {items.map((it) => (
            <div key={it.id} className="cart-item">
              <img src={it.img || '/images/handloom1.svg'} alt={it.title} className="cart-item-image" />
              <div className="cart-item-body">
                <div className="cart-item-title">{it.title}</div>
                <div className="cart-item-desc">Qty: {it.qty} • ₹{it.price}</div>
                <div className="cart-item-controls">
                  <button onClick={() => updateQty(it.id, -1)} className="qty-btn">-</button>
                  <span className="qty-value">{it.qty}</span>
                  <button onClick={() => updateQty(it.id, 1)} className="qty-btn">+</button>
                  <button onClick={() => removeItem(it.id)} className="remove-btn">Remove</button>
                </div>
              </div>
              <div className="cart-item-right">₹{it.price * it.qty}</div>
            </div>
          ))}

          <div className="cart-summary">
            <div><strong>Total</strong></div>
            <div><strong>₹{total}</strong></div>
          </div>

          <div className="payment-block">
            <h4>Payment</h4>
            <div>
              <label><input type="radio" name="pay" value="cod" checked={paymentMethod==='cod'} onChange={() => setPaymentMethod('cod')} /> Cash on Delivery</label>
            </div>
            <div>
              <label><input type="radio" name="pay" value="upi" checked={paymentMethod==='upi'} onChange={() => setPaymentMethod('upi')} /> UPI</label>
              {paymentMethod === 'upi' && (
                <div><input placeholder="your-vpa@bank" value={paymentDetails.upiId} onChange={e => setPaymentDetails({...paymentDetails, upiId: e.target.value})} /></div>
              )}
            </div>
            <div>
              <label><input type="radio" name="pay" value="card" checked={paymentMethod==='card'} onChange={() => setPaymentMethod('card')} /> Card</label>
              {paymentMethod === 'card' && (
                <div><input placeholder="Card number" value={paymentDetails.cardNumber} onChange={e => setPaymentDetails({...paymentDetails, cardNumber: e.target.value})} /></div>
              )}
            </div>
            <div style={{ marginTop: 12 }}>
              <button onClick={checkout} disabled={!items.length || processing} className="place-order-btn">{processing ? 'Processing...' : 'Place Order'}</button>
            </div>
          </div>
        </div>
      )}

      {status && <p className="cart-status">{status}</p>}
    </div>
  );
}
