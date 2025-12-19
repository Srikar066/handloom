const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory data stores for demo purposes
let products = [
  { id: 1, title: 'Silk Sari with Ikat Motif', price: 8999, inventory: 5, artisan: 'Asha', description: 'Hand-dyed silk sari woven using traditional ikat techniques.', img: '/images/1h.jpeg', category: 'Apparel', subcategory: 'Sarees', gender: 'Women', reviews: [] },
  { id: 2, title: 'Organic Cotton Kurta', price: 3499, inventory: 12, artisan: 'Ravi', description: 'Soft handloom organic cotton kurta from small looms.', img: '/images/2h.jpeg', category: 'Apparel', subcategory: 'Kurtas', gender: 'Men', reviews: [] },
  { id: 3, title: 'Handwoven Wool Shawl', price: 5999, inventory: 7, artisan: 'Gita', description: 'Wool shawl woven on pit looms with natural dyes.', img: '/images/3h.jpeg', category: 'Apparel', subcategory: 'Shawls & Scarves', gender: 'Women', reviews: [] },
  { id: 4, title: 'Handloom Tote Bag', price: 1299, inventory: 20, artisan: 'Suresh', description: 'Durable handloom tote bag — perfect for daily use.', img: '/images/4h.jpeg', category: 'Accessories', subcategory: 'Bags', gender: 'Accessories', reviews: [], featured: true },
  { id: 5, title: 'Embroidered Scarf', price: 1999, inventory: 15, artisan: 'Leela', description: 'Lightweight embroidered scarf with traditional patterns.', img: '/images/5h.jpeg', category: 'Accessories', subcategory: 'Scarves', gender: 'Accessories', reviews: [] },
  { id: 6, title: 'Designer Top (Handloom)', price: 2599, inventory: 8, artisan: 'Rani', description: 'Contemporary handloom top designed for comfort and style.', img: '/images/handloom3.svg', category: 'Apparel', subcategory: 'Tops', gender: 'Women', reviews: [] },
  { id: 7, title: 'Handloom Blouse', price: 1599, inventory: 10, artisan: 'Meena', description: 'Traditional handloom blouse to pair with sarees.', img: '/images/handloom2.svg', category: 'Apparel', subcategory: 'Blouses', gender: 'Women', reviews: [] },
  { id: 8, title: "Men's Handloom Shirt", price: 2899, inventory: 9, artisan: 'Ravi', description: 'Comfortable men\'s shirt woven in breathable cotton.', img: '/images/handloom3.svg', category: 'Apparel', subcategory: 'Shirts', gender: 'Men', reviews: [] },
  { id: 9, title: 'Handloom Lehenga', price: 9999, inventory: 3, artisan: 'Sita', description: 'Festive handloom lehenga with traditional motifs.', img: '/images/handloom1.svg', category: 'Apparel', subcategory: 'Lehengas', gender: 'Women', reviews: [] },
  { id: 10, title: 'Kids Kurta Set', price: 1299, inventory: 14, artisan: 'Rani', description: 'Cute handloom kurta set for children.', img: '/images/handloom2.svg', category: 'Apparel', subcategory: 'Kids Wear', gender: 'Boys', reviews: [] },
  { id: 11, title: 'Handloom Bedspread', price: 4999, inventory: 6, artisan: 'Gita', description: 'Cozy bedspread woven with traditional patterns.', img: '/images/handloom3.svg', category: 'Home Furnishings', subcategory: 'Bed Linen', gender: 'Accessories', reviews: [], featured: true },
  { id: 12, title: 'Cushion Cover Set', price: 1499, inventory: 18, artisan: 'Leela', description: 'Set of two handloom cushion covers.', img: '/images/handloom1.svg', category: 'Home Furnishings', subcategory: 'Cushion Covers', gender: 'Accessories', reviews: [] },
  { id: 13, title: 'Table Runner', price: 799, inventory: 25, artisan: 'Suresh', description: 'Handloom table runner for everyday elegance.', img: '/images/handloom2.svg', category: 'Home Furnishings', subcategory: 'Table Linen', gender: 'Accessories', reviews: [] },
  { id: 14, title: 'Kitchen Towels (Set)', price: 499, inventory: 30, artisan: 'Meena', description: 'Absorbent handloom kitchen towels, set of 4.', img: '/images/handloom3.svg', category: 'Home Furnishings', subcategory: 'Kitchen Linen', gender: 'Accessories', reviews: [] },
  { id: 15, title: 'Handloom Curtains', price: 3999, inventory: 7, artisan: 'Sita', description: 'Light-filtering handloom curtains.', img: '/images/handloom1.svg', category: 'Home Furnishings', subcategory: 'Drapes & Curtains', gender: 'Accessories', reviews: [] },
  { id: 16, title: 'Bath Towel (Handloom)', price: 699, inventory: 20, artisan: 'Rani', description: 'Soft handloom bath towel with good absorbency.', img: '/images/handloom2.svg', category: 'Home Furnishings', subcategory: 'Bath Linen', gender: 'Accessories', reviews: [] },
  { id: 17, title: 'Handloom Wallet', price: 899, inventory: 22, artisan: 'Suresh', description: 'Compact handloom wallet for everyday use.', img: '/images/handloom3.svg', category: 'Accessories', subcategory: 'Wallets', gender: 'Accessories', reviews: [], featured: true },
  { id: 18, title: 'Handmade Fabric Jewelry', price: 599, inventory: 40, artisan: 'Leela', description: 'Colorful fabric necklaces and earrings made by hand.', img: '/images/handloom1.svg', category: 'Accessories', subcategory: 'Jewelry', gender: 'Accessories', reviews: [] },
  { id: 19, title: 'Handloom Sandals', price: 2199, inventory: 11, artisan: 'Gita', description: 'Comfortable sandals with handloom straps.', img: '/images/handloom2.svg', category: 'Accessories', subcategory: 'Footwear', gender: 'Accessories', reviews: [] },
  { id: 20, title: 'Handloom Face Mask', price: 249, inventory: 120, artisan: 'Meena', description: 'Reusable handloom face masks in multiple colors.', img: '/images/handloom3.svg', category: 'Accessories', subcategory: 'Accessories', gender: 'Accessories', reviews: [] },
  { id: 21, title: 'Ikat Cotton Dress', price: 2799, inventory: 10, artisan: 'Asha', description: 'Lightweight ikat printed cotton dress for everyday wear.', img: '/images/handloom1.svg', category: 'Apparel', subcategory: 'Dresses', gender: 'Girls', reviews: [], featured: true },
  { id: 22, title: 'Handloom Anarkali', price: 7999, inventory: 4, artisan: 'Sita', description: 'Elegant anarkali suit woven in traditional handloom fabric.', img: '/images/handloom2.svg', category: 'Apparel', subcategory: 'Lehengas', gender: 'Women', reviews: [] },
  { id: 23, title: 'Silk Dupatta', price: 1199, inventory: 25, artisan: 'Rani', description: 'Soft silk dupatta with delicate borders.', img: '/images/handloom3.svg', category: 'Apparel', subcategory: 'Shawls & Scarves', gender: 'Women', reviews: [] },
  { id: 24, title: 'Quilted Bedspread', price: 6999, inventory: 6, artisan: 'Gita', description: 'Handloom quilted bedspread with traditional motifs.', img: '/images/handloom1.svg', category: 'Home Furnishings', subcategory: 'Bed Linen', gender: 'Accessories', reviews: [], featured: true },
  { id: 25, title: 'Handloom Bath Mat', price: 499, inventory: 30, artisan: 'Meena', description: 'Absorbent bath mat with handloom texture.', img: '/images/handloom2.svg', category: 'Home Furnishings', subcategory: 'Bath Linen', gender: 'Accessories', reviews: [] },
  { id: 26, title: 'Embroidered Table Cloth', price: 2499, inventory: 12, artisan: 'Leela', description: 'Table cloth with hand-embroidered borders for dining elegance.', img: '/images/handloom3.svg', category: 'Home Furnishings', subcategory: 'Table Linen', gender: 'Accessories', reviews: [] },
  { id: 27, title: 'Block Print Cushion', price: 699, inventory: 22, artisan: 'Suresh', description: 'Cushion cover with hand block print patterns.', img: '/images/handloom1.svg', category: 'Home Furnishings', subcategory: 'Cushion Covers', gender: 'Accessories', reviews: [] },
  { id: 28, title: 'Handloom Cap', price: 399, inventory: 50, artisan: 'Ravi', description: 'Casual cap with handloom fabric panel.', img: '/images/handloom2.svg', category: 'Accessories', subcategory: 'Accessories', gender: 'Accessories', reviews: [] },
  { id: 29, title: 'Fabric Belt', price: 499, inventory: 35, artisan: 'Suresh', description: 'Stylish fabric belt made from surplus handloom cloth.', img: '/images/handloom3.svg', category: 'Accessories', subcategory: 'Accessories', gender: 'Accessories', reviews: [] },
  { id: 30, title: 'Handwoven Phone Sleeve', price: 349, inventory: 45, artisan: 'Leela', description: 'Protective phone sleeve woven with traditional patterns.', img: '/images/handloom1.svg', category: 'Accessories', subcategory: 'Bags', gender: 'Accessories', reviews: [] }
];

let users = [
  { id: 1, name: 'Admin User', role: 'admin', email: 'admin@example.com', password: 'admin' },
  { id: 2, name: 'Artisan Asha', role: 'artisan', email: 'asha@example.com', password: 'asha', phone: '9990001111' },
  { id: 3, name: 'Buyer Bob', role: 'buyer', email: 'bob@example.com', password: 'bob', phone: '9990002222' }
];

let orders = [];
// simple in-memory OTP store: phone -> { code, expires }
let otpStore = {};

app.get('/api/products', (req, res) => {
  const { gender } = req.query;
  if (gender) {
    const g = String(gender).toLowerCase();
    const filtered = products.filter(p => (p.gender || '').toLowerCase() === g);
    return res.json(filtered);
  }
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const p = products.find(x => x.id === id);
  if (!p) return res.status(404).json({ error: 'Not found' });
  res.json(p);
});

// product reviews
app.get('/api/products/:id/reviews', (req, res) => {
  const id = Number(req.params.id);
  const p = products.find(x => x.id === id);
  if (!p) return res.status(404).json({ error: 'Not found' });
  res.json(Array.isArray(p.reviews) ? p.reviews : []);
});

app.post('/api/products/:id/reviews', (req, res) => {
  const id = Number(req.params.id);
  const { name, rating, comment } = req.body;
  if (!name || !rating) return res.status(400).json({ error: 'Name and rating required' });
  const p = products.find(x => x.id === id);
  if (!p) return res.status(404).json({ error: 'Product not found' });
  const review = { id: Date.now(), name, rating: Number(rating), comment: comment || '', createdAt: new Date() };
  p.reviews = p.reviews || [];
  p.reviews.push(review);
  res.status(201).json(review);
});

app.post('/api/products', (req, res) => {
  const { title, price, inventory, artisan, description } = req.body;
  const id = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
  const newP = { id, title, price: Number(price), inventory: Number(inventory), artisan, description };
  products.push(newP);
  res.status(201).json(newP);
});

app.delete('/api/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = products.findIndex(p => p.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const removed = products.splice(idx, 1)[0];
  res.json({ removed });
});

app.put('/api/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = products.findIndex(x => x.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  products[idx] = { ...products[idx], ...req.body };
  res.json(products[idx]);
});

app.post('/api/orders', (req, res) => {
  const { items, buyer } = req.body;
  const id = orders.length ? Math.max(...orders.map(o => o.id)) + 1 : 1;
  const total = items.reduce((s, it) => s + it.price * it.qty, 0);
  const order = { id, items, buyer, total, status: 'created', createdAt: new Date() };
  // reduce inventory
  items.forEach(it => {
    const p = products.find(x => x.id === it.id);
    if (p) p.inventory = Math.max(0, p.inventory - it.qty);
  });
  orders.push(order);
  res.status(201).json(order);
});

app.get('/api/orders', (req, res) => {
  res.json(orders);
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) {
    // allow guest-like login if user unknown
    return res.json({ user: { id: 0, name: 'Guest', role: 'buyer', email }, token: 'mock-token' });
  }
  // if user has a password, validate (mock)
  if (user.password && password && user.password === password) {
    return res.json({ user: { id: user.id, name: user.name, role: user.role, email: user.email }, token: 'mock-token' });
  }
  if (!user.password) {
    return res.json({ user: { id: user.id, name: user.name, role: user.role, email: user.email }, token: 'mock-token' });
  }
  return res.status(401).json({ error: 'Invalid credentials' });
});

// send otp to phone (mock)
app.post('/api/send-otp', (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone required' });
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = Date.now() + 5 * 60 * 1000; // 5 minutes
  otpStore[phone] = { code, expires };
  console.log(`OTP for ${phone}: ${code}`); // in real app you'd SMS this
  res.json({ ok: true, sentTo: phone });
});

app.post('/api/verify-otp', (req, res) => {
  const { phone, code } = req.body;
  if (!phone || !code) return res.status(400).json({ error: 'Phone and code required' });
  const rec = otpStore[phone];
  if (!rec) return res.status(400).json({ error: 'No OTP found' });
  if (Date.now() > rec.expires) return res.status(400).json({ error: 'OTP expired' });
  if (rec.code !== String(code)) return res.status(400).json({ error: 'Invalid OTP' });
  // mark verified (you can delete or keep)
  delete otpStore[phone];
  return res.json({ ok: true });
});

app.post('/api/register', (req, res) => {
  const { name, email, password, role } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });
  if (users.find(u => u.email === email)) return res.status(400).json({ error: 'User exists' });
  const id = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
  const user = { id, name: name || email.split('@')[0], email, role: role || 'buyer', password: password || '' };
  users.push(user);
  res.status(201).json({ user: { id: user.id, name: user.name, role: user.role, email: user.email }, token: 'mock-token' });
});

app.post('/api/reset-password', (req, res) => {
  const { email, phone, newPassword, code } = req.body;
  if (phone && code) {
    const rec = otpStore[phone];
    if (!rec || rec.code !== String(code) || Date.now() > rec.expires) return res.status(400).json({ error: 'Invalid or expired OTP' });
    const user = users.find(u => u.phone === phone || u.email === email);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.password = newPassword || '';
    delete otpStore[phone];
    return res.json({ ok: true });
  }
  if (!email) return res.status(400).json({ error: 'Email or phone required' });
  const user = users.find(u => u.email === email);
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.password = newPassword || '';
  return res.json({ ok: true });
});

app.post('/api/change-password', (req, res) => {
  const { email, oldPassword, newPassword } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (user.password && user.password !== oldPassword) return res.status(401).json({ error: 'Invalid current password' });
  user.password = newPassword || '';
  return res.json({ ok: true });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
