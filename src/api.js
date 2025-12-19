const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

export async function fetchProducts() {
  const res = await fetch(`${API_BASE}/api/products`);
  return res.json();
}

export async function fetchProduct(id) {
  const res = await fetch(`${API_BASE}/api/products/${id}`);
  return res.json();
}

export async function fetchProductReviews(id) {
  const res = await fetch(`${API_BASE}/api/products/${id}/reviews`);
  return res.json();
}

export async function postProductReview(id, review) {
  const res = await fetch(`${API_BASE}/api/products/${id}/reviews`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(review) });
  return res.json();
}

export async function createOrder(order) {
  const res = await fetch(`${API_BASE}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order)
  });
  return res.json();
}

export async function login(email) {
  const res = await fetch(`${API_BASE}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(email && typeof email === 'object' ? email : { email })
  });
  return res.json();
}

export async function createProduct(product) {
  const res = await fetch(`${API_BASE}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  });
  return res.json();
}

export async function sendOtp(payload) {
  const res = await fetch(`${API_BASE}/api/send-otp`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  return res.json();
}

export async function verifyOtp(payload) {
  const res = await fetch(`${API_BASE}/api/verify-otp`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  return res.json();
}

export async function register(user) {
  const res = await fetch(`${API_BASE}/api/register`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(user)
  });
  return res.json();
}

export async function resetPassword(payload) {
  const res = await fetch(`${API_BASE}/api/reset-password`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  return res.json();
}

export async function changePassword(payload) {
  const res = await fetch(`${API_BASE}/api/change-password`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  return res.json();
}

export default { fetchProducts, fetchProduct, fetchProductReviews, postProductReview, createOrder, login, createProduct };
