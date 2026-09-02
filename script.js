const WA_NUMBER = "6285159977358";
const WA_TEMPLATE = "Halo kak aku mau order hampers 1packet ya";
let cart = [];

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

const cartDrawer = $("#cartDrawer");
const overlay = $("#overlay");
const cartCount = $("#cartCount");
const cartItems = $("#cartItems");
const cartTotal = $("#cartTotal");

function rupiah(value){
  return new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(value);
}

function openCart(){
  cartDrawer.classList.add("open");
  overlay.classList.add("show");
}
function closeCart(){
  cartDrawer.classList.remove("open");
  overlay.classList.remove("show");
}
function renderCart(){
  cartCount.textContent = cart.reduce((sum,item)=>sum+item.qty,0);
  if(!cart.length){
    cartItems.innerHTML = '<p class="cart-empty">Keranjang masih kosong.<br>Pilih hampers favoritmu dulu ✦</p>';
    cartTotal.textContent = "Rp 0";
    return;
  }
  cartItems.innerHTML = cart.map((item,i)=>`
    <div class="cart-row">
      <div>
        <p>${item.name}</p>
        <small>${rupiah(item.price)} × ${item.qty}</small>
        <button class="remove-item" data-remove="${i}">Hapus</button>
      </div>
      <strong>${rupiah(item.price*item.qty)}</strong>
    </div>`).join("");
  const total = cart.reduce((sum,item)=>sum + item.price*item.qty,0);
  cartTotal.textContent = rupiah(total);
  $$("[data-remove]").forEach(btn=>btn.addEventListener("click",()=>{
    cart.splice(Number(btn.dataset.remove),1);
    renderCart();
  }));
}

$$(".add-cart").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const name=btn.dataset.product;
    const price=Number(btn.dataset.price);
    const existing=cart.find(x=>x.name===name);
    if(existing) existing.qty++;
    else cart.push({name,price,qty:1});
    renderCart();
    openCart();
  });
});

$("#cartToggle").addEventListener("click",openCart);
$("#cartClose").addEventListener("click",closeCart);
overlay.addEventListener("click",closeCart);

$("#checkoutBtn").addEventListener("click",()=>{
  if(!cart.length){
    alert("Keranjang masih kosong. Silakan pilih hampers terlebih dahulu.");
    return;
  }
  const lines = cart.map((x,i)=>`${i+1}. ${x.name} — ${x.qty} packet (${rupiah(x.price*x.qty)})`);
  const total = cart.reduce((sum,x)=>sum+x.price*x.qty,0);
  const text = `${WA_TEMPLATE}\n\nDetail pesanan:\n${lines.join("\n")}\n\nTotal: ${rupiah(total)}\n\nMohon info ketersediaan dan detail customnya ya kak.`;
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`,"_blank");
});

const searchPanel=$("#searchPanel");
$("#searchToggle").addEventListener("click",()=>{
  searchPanel.classList.toggle("open");
  if(searchPanel.classList.contains("open")) $("#searchInput").focus();
});
$("#searchClose").addEventListener("click",()=>searchPanel.classList.remove("open"));

$("#searchInput").addEventListener("input",(e)=>{
  const q=e.target.value.toLowerCase().trim();
  let visible=0;
  $$(".product-card").forEach(card=>{
    const text=(card.dataset.name+" "+card.dataset.category).toLowerCase();
    const show=!q || text.includes(q);
    card.style.display=show ? "" : "none";
    if(show) visible++;
  });
  $("#emptyState").style.display=visible ? "none" : "block";
});

$("#menuBtn").addEventListener("click",()=>$("#nav").classList.toggle("open"));
$$(".nav a").forEach(a=>a.addEventListener("click",()=>$("#nav").classList.remove("open")));

renderCart();
