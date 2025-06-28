;(function(){
  const PER_BOX = 1;  
  const API_URL = 'https://shipping-app-two.vercel.app/api/calcShipping.js'; // Updated API URL to match testApi.js

  // Mapping for country names to ISO 2-letter codes
  // Add more mappings here if other country names are used in Telda UI
  const countryCodeMap = {
    "Polska": "PL",
    // Example: "Germany": "DE",
    // Example: "France": "FR",
  };

  window.recalc = async function recalc() { // Expose recalc globally
    const sumEl = document.querySelector('.t706__price_total span')
               || document.querySelector('.t706__cartwin-totalamount-wrap')
               || Array.from(document.querySelectorAll('div,p,span'))
                       .find(el=>el.textContent.trim().startsWith('Suma'));
    if (!sumEl) return;

    let b = document.getElementById('boxes-info'),
        c = document.getElementById('shipping-cost'),
        t = document.getElementById('total-sum');
    if (!b) {
      b = document.createElement('div'); b.id='boxes-info'; b.style.margin='6px 0';
      c = document.createElement('div'); c.id='shipping-cost'; c.style.margin='6px 0';
      t = document.createElement('div'); t.id='total-sum'; t.style.margin='6px 0'; t.style.fontWeight='bold';
      sumEl.insertAdjacentElement('afterend', b);
      b.insertAdjacentElement( 'afterend', c);
      c.insertAdjacentElement( 'afterend', t);
    }

    const items = Array.from(document.querySelectorAll('span.t706__product-quantity'))
                   .reduce((s,el)=>s+(parseInt(el.textContent,10)||0),0);
    const boxes = Math.ceil(items / PER_BOX);
    b.textContent = `Liczba paczek: ${boxes}`;

    const popup   = document.querySelector('.t706__window, .t706__cart');
    const uiRegion  = popup?.querySelector('select[name="region"]')?.value.trim() || '';
    const postcode= popup?.querySelector('input[name="postcode"]')?.value.replace(/\D/g,'') || '';
    const address = popup?.querySelector('input[name="address"]')?.value.trim() || '';

    // Convert UI region name to 2-letter ISO code if a mapping exists, otherwise use as is
    // This matches the behavior of testApi.js which uses "PL" for Poland.
    const region = countryCodeMap[uiRegion] || uiRegion;

    let cost = 0;
    if (region && postcode && address) {
      try {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ region, boxes, postcode, address })
        });
        if (res.ok) {
          const { shippingCost } = await res.json();
          cost = shippingCost || 0;
        } else {
          const errorText = await res.text();
          console.warn('calcShipping failed', `Status: ${res.status}, Error: ${errorText}`);
        }
      } catch(e){ console.error('Ошибка доставки:',e); }
    }
    c.textContent = `Koszt dostawy: ${cost} PLN`;

    const prod = parseInt(sumEl.textContent.replace(/[^\d]/g,''),10)||0;
    t.textContent = `Suma łącznie: ${prod + cost} zł`;
  }

  window.addEventListener('load', () => { recalc(); setInterval(recalc,1000); });
})();
