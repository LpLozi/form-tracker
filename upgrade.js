/* FORM v1.5 — nutrition diary + motivation upgrade */
(function(){
const logo='./assets/form-logo.svg';
const motivations=[
  'Bugün dünden biraz daha güçlü ol.',
  'Mükemmel olman gerekmiyor. Tutarlı olman yeterli.',
  'İyi antrenmanlar motivasyonla değil, devamlılıkla birikir.',
  'Bugünkü işini yap. Sonuç zaten peşinden gelir.',
  'Küçük ilerleme de ilerlemedir.',
  'Disiplin, canın istemediği günlerde çalışır.',
  'Hedef uzakta değil; bugünkü seçimlerinin toplamında.'
];
function motivation(){return motivations[new Date().getDay()%motivations.length]}
function pct(v,t){return t?Math.max(0,Math.min(100,(Number(v)||0)/Number(t)*100)):0}
function foodGram(item,f){return item.unit==='g'?Number(item.qty):Number(item.qty)*Number(f.servingG||100)}
function mealTotals(items){return nutrientTotals(items||[])}
function foodLine(item,meal,idx){const f=db.foods[item.foodIndex];if(!f)return '';const t=nutrientTotals([item]);const grams=foodGram(item,f);return `<div class="food-line"><div><strong>${f.name}</strong><small>${item.unit==='g'?fmt(grams)+' g':item.qty+' '+(f.unit||'porsiyon')} • P ${fmt(t.protein,1)} • K ${fmt(t.carb,1)} • Y ${fmt(t.fat,1)}</small></div><div class="food-kcal">${fmt(t.kcal)} kcal</div><button class="food-delete" onclick="removeFood('${meal}',${idx})" aria-label="Sil">×</button></div>`}
function categoryChips(){const cats=['Tümü',...new Set(db.foods.map(f=>f.category||'Diğer'))];return cats.map(c=>`<button class="diary-chip ${((window._diaryCat||'Tümü')===c)?'active':''}" onclick="window._diaryCat='${c.replace(/'/g,"\\'")}';renderNutrition()">${c}</button>`).join('')}
function favoriteFoods(){const usage=db.settings?.foodUsage||{};return db.foods.map((f,i)=>({f,i,n:usage[f.name]||0})).sort((a,b)=>b.n-a.n||a.i-b.i).slice(0,10)}
function renderSearchResults(query=''){const box=document.getElementById('diaryResults');if(!box)return;const q=(query||'').trim().toLocaleLowerCase('tr-TR');const cat=window._diaryCat||'Tümü';let rows=db.foods.map((f,i)=>({f,i,n:(db.settings?.foodUsage||{})[f.name]||0}));if(cat!=='Tümü')rows=rows.filter(x=>(x.f.category||'Diğer')===cat);if(q)rows=rows.filter(x=>`${x.f.name} ${x.f.brand||''} ${x.f.category||''}`.toLocaleLowerCase('tr-TR').includes(q));else rows=rows.sort((a,b)=>b.n-a.n||a.i-b.i).slice(0,18);rows=rows.slice(0,45);box.innerHTML=rows.map(({f,i})=>`<button class="diary-result" onclick="openFoodAdder(${i})"><span><strong>${f.name}</strong><small>${f.brand&&f.brand!=='Genel'?f.brand+' • ':''}${f.category||'Diğer'} • ${fmt(f.kcal)} kcal /100g</small></span><span class="diary-add">+</span></button>`).join('')||'<div class="muted" style="padding:10px">Eşleşen besin bulunamadı.</div>'}
window.formFoodSearch=function(el){renderSearchResults(el.value)};
window.focusDiary=function(meal){window._meal=meal;renderNutrition();setTimeout(()=>{const e=document.getElementById('diarySearch');if(e){e.focus();e.scrollIntoView({behavior:'smooth',block:'center'})}},30)};

const oldPanel=renderPanel;
renderPanel=function(){oldPanel();const hero=document.querySelector('.hero-brand');if(hero){hero.classList.add('form-hero-v15');const planTag=hero.querySelector('.hero-tag')?.textContent||'';hero.innerHTML=`<div class="form-mark"><img src="${logo}" alt="FORM"></div><div><h1>FORM</h1><p>Antrenmanını, beslenmeni ve gelişimini takip et. Gürültüyü azalt; yaptığın işi görünür hale getir.</p><div class="motivation-line">${motivation()}</div><span class="hero-tag">${planTag}</span></div>`}}

renderNutrition=function(){const meals=['Kahvaltı','Öğle','Akşam','Ara Öğün','Antrenman Öncesi','Antrenman Sonrası'];const dayMeals=db.meals[today]||{};const t=nutrientTotals(allMealsForDay(today));window._meal=window._meal||'Kahvaltı';window._diaryCat=window._diaryCat||'Tümü';const rem=db.targets.kcal-t.kcal;const favorites=favoriteFoods();app.innerHTML=`
<div class="nutri-shell">
  <div class="nutri-top">
    <div class="card nutri-hero">
      <div class="nutri-eyebrow">Bugün kalan</div>
      <div class="nutri-remaining">${fmt(rem)} <small>kcal</small></div>
      <div class="nutri-equation"><div><span>Hedef</span><b>${fmt(db.targets.kcal)}</b></div><div><span>Yenen</span><b>${fmt(t.kcal)}</b></div><div><span>Kalan</span><b>${fmt(rem)}</b></div></div>
    </div>
    <div class="card nutri-ring-wrap"><div class="nutri-ring" style="--pct:${pct(t.kcal,db.targets.kcal)}"><div class="nutri-ring-copy"><b>%${fmt(pct(t.kcal,db.targets.kcal))}</b><span>günlük kalori</span></div></div></div>
  </div>
  <div class="macro-board">
    <div class="macro-tile"><div class="macro-head"><strong>Protein</strong><span>${fmt(t.protein)} / ${db.targets.protein} g</span></div><div class="macro-bar"><i style="width:${pct(t.protein,db.targets.protein)}%"></i></div></div>
    <div class="macro-tile"><div class="macro-head"><strong>Karbonhidrat</strong><span>${fmt(t.carb)} / ${db.targets.carb} g</span></div><div class="macro-bar"><i style="width:${pct(t.carb,db.targets.carb)}%"></i></div></div>
    <div class="macro-tile"><div class="macro-head"><strong>Yağ</strong><span>${fmt(t.fat)} / ${db.targets.fat} g</span></div><div class="macro-bar"><i style="width:${pct(t.fat,db.targets.fat)}%"></i></div></div>
  </div>
  <div class="card">
    <div style="display:flex;justify-content:space-between;gap:10px;align-items:end;flex-wrap:wrap"><div><h2 style="margin-bottom:4px">Besin ekle</h2><div class="muted">Seçili öğün: <b>${window._meal}</b></div></div><button class="secondary small" onclick="go('Ayarlar')">+ Özel besin</button></div>
    <div class="diary-toolbar" style="margin-top:12px"><div class="diary-search"><input id="diarySearch" placeholder="Besin ara: tavuk, pirinç, whey..." oninput="formFoodSearch(this)"></div></div>
    <div class="quick-favs" style="margin-top:10px">${favorites.map(({f,i})=>`<button class="quick-fav" onclick="openFoodAdder(${i})">+ ${f.name}</button>`).join('')}</div>
    <div class="quick-favs" style="margin-top:10px">${categoryChips()}</div>
    <div class="diary-results open"><div id="diaryResults" class="diary-result-list"></div></div>
  </div>
  <div class="meal-diary">
    ${meals.map(m=>{const items=dayMeals[m]||[],mt=mealTotals(items);return `<div class="meal-row"><div class="meal-row-head"><div><h3>${m}</h3><div class="meal-summary">P ${fmt(mt.protein)} • K ${fmt(mt.carb)} • Y ${fmt(mt.fat)}</div></div><div class="meal-row-actions"><span class="meal-kcal">${fmt(mt.kcal)} kcal</span><button class="meal-plus" onclick="focusDiary('${m}')">+</button></div></div>${items.length?`<div class="meal-items">${items.map((it,idx)=>foodLine(it,m,idx)).join('')}</div>`:'<div class="meal-empty">Henüz kayıt yok. + ile bu öğüne besin ekle.</div>'}</div>`}).join('')}
  </div>
  <div class="diary-footer"><div class="diary-stat"><span>Lif</span><b>${fmt(t.fiber)} g</b></div><div class="diary-stat"><span>Protein</span><b>${fmt(t.protein)} g</b></div><div class="diary-stat"><span>Toplam</span><b>${fmt(t.kcal)} kcal</b></div><div class="diary-stat"><span>Kalan</span><b>${fmt(rem)} kcal</b></div></div>
</div>`;setTimeout(()=>renderSearchResults(''),0)};

function upgradeBrand(){const first=document.querySelector('.topbar>div:first-child');if(!first||first.dataset.v15)return;first.dataset.v15='1';first.innerHTML=`<div class="top-brand-wrap"><img class="top-brand-logo" src="${logo}" alt="FORM"><div class="top-brand-copy"><div class="brand">F<span>O</span>RM</div><div class="brand-sub">Dünden güçlü. Bugün işini yap.</div></div></div>`}
upgradeBrand();
if(typeof render==='function')render();
})();
