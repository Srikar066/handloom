// Single-file SPA logic (vanilla JS)
(() => {
  const slides = [
    { id:1, title:'Handloom Bazaar', subtitle:'Crafted by artisans — ethically sourced', img:'https://images.unsplash.com/photo-1520975698517-c060f32d5b3b?auto=format&fit=crop&w=1200&q=60' },
    { id:2, title:'Timeless Sarees', subtitle:'Ikat, Kanjivaram and more', img:'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1200&q=60' },
    { id:3, title:'Cozy Home Linens', subtitle:'Bed, Bath & Table in handloom', img:'https://images.unsplash.com/photo-1520975698517-c060f32d5b3b?auto=format&fit=crop&w=1200&q=60' }
  ];

  const products = [
    { id:101, title:'Silk Sari - Ikat', price:8999, img:'https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=800&q=60', desc:'Hand-dyed silk sari woven using ikat.'},
    { id:102, title:'Cotton Kurta', price:2999, img:'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=60', desc:'Soft handloom cotton kurta.'},
    { id:103, title:'Wool Shawl', price:4999, img:'https://images.unsplash.com/photo-1503342452485-86f7f8f0f1b9?auto=format&fit=crop&w=800&q=60', desc:'Pit loom wool shawl with natural dyes.'},
    { id:104, title:'Table Runner', price:1299, img:'https://images.unsplash.com/photo-1516686345024-8cbb5a1d3d3c?auto=format&fit=crop&w=800&q=60', desc:'Handloom table runner.'},
    { id:105, title:'Handbag - Woven', price:2499, img:'https://images.unsplash.com/photo-1526178611729-0e7b2b3aa6e7?auto=format&fit=crop&w=800&q=60', desc:'Woven artisan handbag.'},
    { id:106, title:'Scarf - Cotton', price:799, img:'https://images.unsplash.com/photo-1519744792095-2f2205e87b6f?auto=format&fit=crop&w=800&q=60', desc:'Lightweight handloom scarf.'}
  ];

  // Storage helpers
  const read = (k) => { try { return JSON.parse(localStorage.getItem(k) || '[]'); } catch(e){ return []; } };
  const write = (k,v) => localStorage.setItem(k, JSON.stringify(v));

  let state = {
    slideIdx: 0,
    search: '',
    wishlist: read('wishlist'),
    cart: read('cart')
  };

  // elements
  const slideImg = document.getElementById('slideImg');
  const slideSubtitle = document.getElementById('slideSubtitle');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const progressBar = document.getElementById('progressBar');
  const topCatsEl = document.getElementById('topCats');
  const featuredGrid = document.getElementById('featuredGrid');
  const searchInput = document.getElementById('searchInput');
  const navHome = document.getElementById('navHome');
  const navCart = document.getElementById('navCart');
  const navWishlist = document.getElementById('navWishlist');
  const cartCount = document.getElementById('cartCount');
  const wishCount = document.getElementById('wishCount');
  const homeView = document.getElementById('homeView');
  const cartView = document.getElementById('cartView');
  const wishView = document.getElementById('wishView');
  const cartList = document.getElementById('cartList');
  const wishList = document.getElementById('wishList');
  const clearCart = document.getElementById('clearCart');

  const topCategories = ['Men','Women','Boys','Girls','Accessories'];

  // render top categories beside title
  function renderTopCats(){
    topCatsEl.innerHTML = '';
    topCategories.forEach(tc => {
      const b = document.createElement('button');
      b.className = 'pill';
      b.textContent = tc;
      b.onclick = () => { state.search = tc; searchInput.value = tc; renderFeatured(); showView('home'); };
      topCatsEl.appendChild(b);
    });
  }

  // carousel
  let progressTimer = null;
  function showSlide(i){
    state.slideIdx = (i + slides.length) % slides.length;
    const s = slides[state.slideIdx];
    slideImg.src = s.img;
    slideSubtitle.textContent = s.subtitle;
    restartProgress();
  }
  function restartProgress(){
    progressBar.style.width = '0%';
    progressBar.style.transition = 'none';
    // allow paint
    requestAnimationFrame(()=>{
      requestAnimationFrame(()=>{
        progressBar.style.transition = 'width 3s linear';
        progressBar.style.width = '100%';
      });
    });
    if(progressTimer) clearTimeout(progressTimer);
    progressTimer = setTimeout(()=>{
      showSlide(state.slideIdx+1);
    },3000);
  }

  prevBtn.addEventListener('click', ()=> showSlide(state.slideIdx-1));
  nextBtn.addEventListener('click', ()=> showSlide(state.slideIdx+1));

  // featured products
  function filteredProducts(){
    const q = (state.search||'').toLowerCase();
    if(!q) return products;
    return products.filter(p => (p.title + ' ' + p.desc).toLowerCase().includes(q) || String(p.price).includes(q));
  }

  function isWish(id){ return state.wishlist.find(w=>w.id===id); }
  function toggleWish(item){
    if(isWish(item.id)){
      state.wishlist = state.wishlist.filter(w=>w.id!==item.id);
    } else {
      state.wishlist.unshift(item);
    }
    write('wishlist', state.wishlist);
    renderCounts();
    renderFeatured();
    renderWishList();
  }

  function addToCart(item){
    const found = state.cart.find(c=>c.id===item.id);
    if(found) found.qty += 1; else state.cart.push({ ...item, qty:1 });
    write('cart', state.cart);
    renderCounts();
    renderCart();
  }

  function renderFeatured(){
    const list = filteredProducts();
    featuredGrid.innerHTML = '';
    list.forEach(p => {
      const c = document.createElement('div'); c.className='card';
      c.innerHTML = `
        <img src="${p.img}" alt="${p.title}" />
        <h3>${p.title}</h3>
        <div class="muted">${p.desc}</div>
        <div class="price">₹${p.price}</div>
      `;
      const actions = document.createElement('div'); actions.className='actions-inline';
      const addBtn = document.createElement('button'); addBtn.className='btn sm'; addBtn.textContent='Add to cart'; addBtn.onclick = ()=> addToCart(p);
      const wishBtn = document.createElement('button'); wishBtn.className = 'wish-btn '+(isWish(p.id)?'wish-active':''); wishBtn.innerHTML = isWish(p.id)?'♥':'♡'; wishBtn.onclick = ()=> toggleWish(p);
      actions.appendChild(addBtn); actions.appendChild(wishBtn);
      c.appendChild(actions);
      featuredGrid.appendChild(c);
    });
  }

  // cart & wishlist rendering
  function renderCounts(){
    const cartQty = state.cart.reduce((s,i)=>s + (i.qty||0),0);
    cartCount.textContent = cartQty;
    wishCount.textContent = state.wishlist.length;
  }

  function renderCart(){
    cartList.innerHTML = '';
    if(state.cart.length===0) cartList.innerHTML = '<div class="muted">Cart is empty</div>';
    state.cart.forEach(item=>{
      const el = document.createElement('div'); el.className='card';
      el.innerHTML = `<div style="display:flex;gap:12px;align-items:center"><img src='${item.img}' style='width:84px;height:64px;object-fit:cover;border-radius:6px' /><div style='flex:1'><strong>${item.title}</strong><div class='muted'>₹${item.price} x ${item.qty}</div></div></div>`;
      const rem = document.createElement('button'); rem.className='btn outline'; rem.textContent='Remove'; rem.onclick = ()=> { state.cart = state.cart.filter(c=>c.id!==item.id); write('cart', state.cart); renderCart(); renderCounts(); };
      el.appendChild(rem);
      cartList.appendChild(el);
    });
  }

  function renderWishList(){
    wishList.innerHTML = '';
    if(state.wishlist.length===0) wishList.innerHTML = '<div class="muted">Wishlist is empty</div>';
    state.wishlist.forEach(item=>{
      const el = document.createElement('div'); el.className='card';
      el.innerHTML = `<div style="display:flex;gap:12px;align-items:center"><img src='${item.img}' style='width:84px;height:64px;object-fit:cover;border-radius:6px' /><div style='flex:1'><strong>${item.title}</strong><div class='muted'>₹${item.price}</div></div></div>`;
      const add = document.createElement('button'); add.className='btn'; add.textContent='Add to cart'; add.onclick = ()=> { addToCart(item); };
      const rem = document.createElement('button'); rem.className='btn outline'; rem.textContent='Remove'; rem.onclick = ()=> { state.wishlist = state.wishlist.filter(w=>w.id!==item.id); write('wishlist', state.wishlist); renderWishList(); renderFeatured(); renderCounts(); };
      el.appendChild(add); el.appendChild(rem);
      wishList.appendChild(el);
    });
  }

  // view switching
  function showView(name){
    homeView.classList.toggle('hidden', name!=='home');
    cartView.classList.toggle('hidden', name!=='cart');
    wishView.classList.toggle('hidden', name!=='wish');
    document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
    if(name==='home') navHome.classList.add('active');
    if(name==='cart') navCart.classList.add('active');
    if(name==='wish') navWishlist.classList.add('active');
  }

  // events
  searchInput.addEventListener('input', (e)=>{ state.search = e.target.value; renderFeatured(); showView('home'); });
  navHome.addEventListener('click', ()=> showView('home'));
  navCart.addEventListener('click', ()=> { showView('cart'); renderCart(); });
  navWishlist.addEventListener('click', ()=> { showView('wish'); renderWishList(); });
  clearCart.addEventListener('click', ()=> { state.cart = []; write('cart', state.cart); renderCart(); renderCounts(); });

  // initial render
  function init(){
    renderTopCats();
    renderFeatured();
    renderCounts();
    renderWishList();
    showSlide(0);
  }

  init();
})();
