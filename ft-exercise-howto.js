/* FORM 2.1.12 — Ertuğ programı için her hareketin Türkçe ekipman ve uygulama rehberi */
(()=>{'use strict';
const GUIDES={
  "Barbell Incline Bench Press": {
    "tr": "Eğimli barbell göğüs press",
    "gear": "Barbell + eğimli sehpa",
    "how": "Sehpayı yaklaşık 20–35° ayarla. Barı üst göğse kontrollü indir, kürek kemiklerin sabitken yukarı it.",
    "icon": "bar"
  },
  "Dumbbell Bench Press": {
    "tr": "Dambıl göğüs press",
    "gear": "Düz sehpa + iki dambıl",
    "how": "Sehpaya sırtüstü uzan. Dambılları göğsünün iki yanında indir, dirsekleri aşırı açmadan yukarı it.",
    "icon": "db"
  },
  "Leverage Decline Chest Press": {
    "tr": "Makinede alt göğüs press",
    "gear": "Decline göğüs press makinesi",
    "how": "Koltuğu tutacaklar alt göğüs hizasına gelecek şekilde ayarla. Sırtını sabitle, tutacakları öne itip kontrollü dön.",
    "icon": "machine"
  },
  "Cable Low Fly": {
    "tr": "Aşağıdan yukarı kablo fly",
    "gear": "Çift ayarlı kablo istasyonu",
    "how": "Makaraları aşağıya getir. Dirsekleri hafif bükülü tutarak kollarını aşağıdan yukarı, göğüs önünde birbirine yaklaştır.",
    "icon": "cable"
  },
  "Lever Seated Fly": {
    "tr": "Pec deck / makinede göğüs açış",
    "gear": "Pec deck (butterfly) makinesi",
    "how": "Sırtını dayayıp dirsek veya tutacakları göğüs önünde birleştir. Açarken göğsü kontrollü esnet.",
    "icon": "machine"
  },
  "Standing One Arm Chest Stretch": {
    "tr": "Tek kol duvarda göğüs esnetme",
    "gear": "Duvar veya kapı kenarı",
    "how": "Avucunu duvara koy, kolun sabitken gövdeni yavaşça aksi yöne çevir. Göğüste hafif gerilme hisset.",
    "icon": "stretch"
  },
  "Straight Arms Backward Chest Stretch": {
    "tr": "Düz kollarla geriye göğüs esnetme",
    "gear": "Ekipmansız",
    "how": "Kollarını arkaya uzatıp omuzları hafifçe geriye aç. Belini aşırı çukurlaştırmadan göğsü esnet.",
    "icon": "stretch"
  },
  "Lever Seated Dip": {
    "tr": "Makinede oturarak dip",
    "gear": "Seated dip makinesi",
    "how": "Koltuğa otur, dirsekleri gövdeye yakın tut. Tutacakları aşağı bastır, dirsekleri kontrollü bükerek geri dön.",
    "icon": "machine"
  },
  "Cable Pushdown (Bar)": {
    "tr": "Bar ile arka kol itiş",
    "gear": "Üst makara + düz bar",
    "how": "Dirsekleri yanlarında sabitle. Barı aşağı iterek dirseklerini aç, omuzlarını sallamadan yavaşça geri dön.",
    "icon": "cable"
  },
  "Cable Overhead Triceps Extension Straight Bar": {
    "tr": "Baş üstü kabloda arka kol açış",
    "gear": "Kablo istasyonu + düz bar",
    "how": "Makarayı arkana al ve barı başının arkasından ileri-yukarı uzat. Dirsekleri sabit tut, boynunu sıkıştırma.",
    "icon": "cable"
  },
  "Overhead Triceps Stretch": {
    "tr": "Baş üstü arka kol esnetme",
    "gear": "Ekipmansız",
    "how": "Bir kolunu başının arkasına bük. Diğer elinle dirseğine hafif destek ver, zorlamadan esnet.",
    "icon": "stretch"
  },
  "Cable Wide Neutral Grip PullDown": {
    "tr": "Geniş nötr tutuş lat pulldown",
    "gear": "Lat pulldown + nötr tutuş aparat",
    "how": "Avuçların birbirine bakacak şekilde tut. Dirsekleri aşağıya çekerek tutacağı üst göğse yaklaştır; arkaya savrulma.",
    "icon": "cable"
  },
  "Cable Reverse Grip Straight Back Row": {
    "tr": "Ters tutuş oturarak kablo row",
    "gear": "Alt kablo / row istasyonu + bar",
    "how": "Avuçların yukarı bakacak şekilde barı tut. Göğsünü açık tutup dirsekleri geriye çek, barı karın üstüne yaklaştır.",
    "icon": "cable"
  },
  "Dumbbell Bent Over Row with Chest Support": {
    "tr": "Göğüs destekli dambıl row",
    "gear": "Eğimli sehpa + iki dambıl",
    "how": "Göğsünü eğimli sehpaya daya. Dambılları dirseklerini arkaya sürerek çek, aşağıda kolları kontrollü uzat.",
    "icon": "db"
  },
  "Cable Palm Rotational Row Back": {
    "tr": "Dönüşlü tek kol kablo row",
    "gear": "Kablo istasyonu + tekli tutacak",
    "how": "Kolunu öne uzat. Dirseğini kalçana doğru çekerken avucunu kontrollü çevir, gövdeni savurma.",
    "icon": "cable"
  },
  "Seated Row": {
    "tr": "Oturarak kablo row",
    "gear": "Seated cable row makinesi",
    "how": "Ayaklarını desteğe koy, sırtını nötr tut. Tutacağı göbeğine doğru çek, kontrollü uzatarak sırtını esnet.",
    "icon": "cable"
  },
  "Side Lat Stretch Back": {
    "tr": "Yan kanat (lat) esnetme",
    "gear": "Sabit bar / direk",
    "how": "Bir elinle sabit bir noktadan tut, kalçanı yana ve geriye vererek koltuk altı–kanat bölgesini esnet.",
    "icon": "stretch"
  },
  "Bar Back Stretch": {
    "tr": "Bardan destek alarak sırt esnetme",
    "gear": "Sabit bar / direk",
    "how": "Barı iki elinle tut. Kalçanı geriye verip gövdeni öne eğ, sırtı uzat; bele yük bindirecek şekilde asılma.",
    "icon": "stretch"
  },
  "Barbell Prone Incline Curl": {
    "tr": "Yüzüstü eğimli sehpada biceps curl",
    "gear": "Eğimli sehpa + barbell",
    "how": "Göğsünü eğimli sehpaya yasla, kolların aşağı sarksın. Dirsekleri oynatmadan barı kıvır, yavaşça indir.",
    "icon": "bar"
  },
  "Cable Close Grip Curl": {
    "tr": "Dar tutuş kablo biceps curl",
    "gear": "Alt kablo + dar düz/EZ bar",
    "how": "Dirsekleri gövde yanında sabitle. Barı omuzlara doğru kıvır, bilekleri kırmadan kontrollü indir.",
    "icon": "cable"
  },
  "Hammer Curl (Rope)": {
    "tr": "Halatla hammer curl",
    "gear": "Alt kablo + halat",
    "how": "Halatın uçlarını avuçlar birbirine bakarken tut. Dirsekleri sabit tutup halatı omuzlarına doğru kaldır.",
    "icon": "cable"
  },
  "Elbow Flexor Stretch": {
    "tr": "Biceps / dirsek önü esnetme",
    "gear": "Duvar veya düz zemin",
    "how": "Kolunu gövdenin hafif arkasına uzatıp avuç içini duvara yerleştir. Dirseği kilitlemeden hafifçe esnet.",
    "icon": "stretch"
  },
  "Lever Military Press (plate loaded)": {
    "tr": "Plaka yüklü omuz press",
    "gear": "Plaka yüklü omuz press makinesi",
    "how": "Sırtını dayayıp tutacakları omuz hizasından yukarı it. Boynu nötr, kaburgaları sabit tut; ağrıya zorlama.",
    "icon": "machine"
  },
  "Dumbbell Arnold Press": {
    "tr": "Arnold omuz press",
    "gear": "Sırt destekli sehpa + dambıl",
    "how": "Avuçlar yüzüne dönük başla. Dambılları yukarı iterken avuçlarını dışa çevir; kontrollü geri dön.",
    "icon": "db"
  },
  "Dumbbell Seated Lateral to Front Raise": {
    "tr": "Oturarak yan–ön omuz kaldırış",
    "gear": "Sehpa + hafif dambıllar",
    "how": "Oturup dirsekleri hafif bük. Dambılları yana kaldırıp kontrollü öne taşı; omuzları kulaklara çekme.",
    "icon": "db"
  },
  "Lever Lateral Raise": {
    "tr": "Makinede yana omuz açış",
    "gear": "Lateral raise makinesi",
    "how": "Koltuğu dirsek yastıkları uygun konuma gelecek şekilde ayarla. Dirsekleri yanlara kaldırıp kontrollü indir.",
    "icon": "machine"
  },
  "Dumbbell Seated Bent Over Alternate Rear Delt Fly": {
    "tr": "Öne eğilerek dönüşümlü arka omuz açış",
    "gear": "Sehpa + hafif dambıllar",
    "how": "Oturarak gövdeni öne eğ ve boynunu nötr tut. Kolları dönüşümlü yanlara aç, omuzlarını silkeleme.",
    "icon": "db"
  },
  "Bent Arm Shoulder Stretch": {
    "tr": "Bükülü kolla omuz esnetme",
    "gear": "Ekipmansız",
    "how": "Bir kolunu göğsünün önüne getir. Diğer elinle üst koldan hafif destek vererek arka omzu esnet.",
    "icon": "stretch"
  },
  "Standing Reverse Shoulder Stretch": {
    "tr": "Ayakta arkaya omuz esnetme",
    "gear": "Ekipmansız",
    "how": "Kollarını gövdenin arkasına doğru uzat, omuzları geriye aç. Boynu ve beli zorlamadan kısa süre tut.",
    "icon": "stretch"
  },
  "Cable Shrug": {
    "tr": "Kablo ile trapez shrug",
    "gear": "Alt kablo + bar",
    "how": "Barı kollar düzken tut. Omuzlarını kulaklarına doğru hafifçe yükselt, üstte durup yavaşça indir; boynu oynatma.",
    "icon": "cable"
  },
  "Dumbbell Upright Row": {
    "tr": "Dambılla dikey çekiş",
    "gear": "İki dambıl",
    "how": "Dambılları gövdenin önünden dirsekleri yönlendirerek yukarı çek. Omuz hizasını aşmaya zorlama, boynu sabit tut.",
    "icon": "db"
  },
  "Cable Standing Crunch": {
    "tr": "Ayakta kabloyla karın sıkıştırma",
    "gear": "Üst kablo + halat/bar",
    "how": "Kablonun önünde sabit dur. Kaburgaları leğen kemiğine yaklaştırarak gövdeyi kıvır; boyundan çekme.",
    "icon": "cable"
  },
  "Seated Leg Rise": {
    "tr": "Oturarak bacak kaldırış",
    "gear": "Düz sehpa",
    "how": "Sehpanın kenarında ellerinle destek al. Dizlerini veya bacaklarını karna doğru kaldır, gövdeyi sallama.",
    "icon": "body"
  },
  "Seated 8 Point Leg Crunch": {
    "tr": "Oturarak bacaklı karın crunch",
    "gear": "Düz sehpa",
    "how": "Sehpanın kenarında dengeyi sağla. Dizleri kontrollü göğse yaklaştırıp uzat; hareketi belden savurma.",
    "icon": "body"
  },
  "Lying Abdominal Stretch": {
    "tr": "Yüzüstü karın esnetme",
    "gear": "Mat / zemin",
    "how": "Yüzüstü yat, ellerinle gövdeni rahat bir yüksekliğe kaldır. Belini ve boynunu geriye zorlamadan esnet.",
    "icon": "stretch"
  },
  "Smith Full Squat": {
    "tr": "Smith makinesinde squat",
    "gear": "Smith makinesi",
    "how": "Barı üst sırtına yerleştir. Ayaklarını rahat bir açıklığa al, karın kaslarını sıkıp diz–ayak hattını koruyarak çömel.",
    "icon": "machine"
  },
  "Hack Squat": {
    "tr": "Hack squat",
    "gear": "Hack squat makinesi",
    "how": "Omuz pedlerine gir, bel ve kalçayı desteğe yasla. Dizleri ayak yönünde bükerek in, topuklardan iterek kalk.",
    "icon": "machine"
  },
  "Leg Wide Press": {
    "tr": "Geniş ayaklı leg press",
    "gear": "Leg press makinesi",
    "how": "Ayaklarını platforma omuzdan biraz geniş yerleştir. Dizleri ayakların yönünde bük, kalçayı minderden kaldırma.",
    "icon": "machine"
  },
  "Walking Lunge": {
    "tr": "Yürüyerek lunge",
    "gear": "Boş alan; isteğe bağlı dambıl",
    "how": "Öne uzun bir adım at, iki dizi kontrollü bük. Ön ayaktan güç alarak diğer bacağa geç; gövdeni dengede tut.",
    "icon": "body"
  },
  "Lever Leg Extension": {
    "tr": "Makinede ön bacak açış",
    "gear": "Leg extension makinesi",
    "how": "Diz eklemini makinenin dönüş noktasına hizala. Ayak bileği yastığını yukarı kaldır, yavaşça indir.",
    "icon": "machine"
  },
  "Lever Seated Leg Curl": {
    "tr": "Oturarak arka bacak curl",
    "gear": "Seated leg curl makinesi",
    "how": "Dizini makine eksenine hizala, uylukları sabitle. Topukları geriye–aşağıya çekip hamstringi sık, yavaş dön.",
    "icon": "machine"
  },
  "Smith Calf Raise": {
    "tr": "Smith makinesinde baldır yükselişi",
    "gear": "Smith makinesi + yükselti",
    "how": "Ayak önlerini sağlam bir yükseltiye koy. Topukları kontrollü indirip parmak uçlarında yüksel; sekme yapma.",
    "icon": "machine"
  },
  "Standing Quadriceps Stretch": {
    "tr": "Ayakta ön bacak esnetme",
    "gear": "Duvar desteği (isteğe bağlı)",
    "how": "Bir ayağını arkadan tutup topuğu kalçaya yaklaştır. Dizleri yan yana, gövdeyi dik tut.",
    "icon": "stretch"
  },
  "Lying Crossover Knee Pull Up Stretch": {
    "tr": "Yatarak çapraz diz çekme",
    "gear": "Mat / zemin",
    "how": "Sırtüstü uzan, bir dizini hafifçe karşı tarafa götür. Omuzları yerde ve hareketi ağrısız aralıkta tut.",
    "icon": "stretch"
  },
  "Calf Stretch with Hands Against Wall": {
    "tr": "Duvara dayanarak baldır esnetme",
    "gear": "Duvar",
    "how": "Ellerini duvara koy. Bir bacağı geriye alıp topuğu yerde tut, öndeki dizi bükerek baldırı esnet.",
    "icon": "stretch"
  }
};
const ICONS={
 bar:'<svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M5 18h26M9 11v14M13 9v18M23 9v18M27 11v14"/></svg>',
 db:'<svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M8 27 28 9M8 18l9 9M5 21l9 9M19 6l10 10M22 3l11 11"/></svg>',
 cable:'<svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 32V4h20v28M10 9h10M15 12v12M15 24l-5 6m5-6 5 6M27 9h5v17h-5"/></svg>',
 machine:'<svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 31V5h24v26M9 10h15M15 10v12M10 23h17M11 23v7M25 23v7M28 9h5"/></svg>',
 stretch:'<svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="18" cy="8" r="3"/><path d="M18 12v11M18 15 8 20m10-5 10-5M18 23l-8 9m8-9 8 9"/></svg>',
 body:'<svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="18" cy="8" r="3"/><path d="M18 12v12M18 17l-8 5m8-5 8 5m-8 2-7 8m7-8 7 8"/></svg>'
};
function safe(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]))}
function records(){try{return (db.program?.[window._wk]||[]).map(x=>typeof normalizeExercise==='function'?normalizeExercise(x):x)}catch{return []}}
const isExact=e=>e?.source==='exact-screenshots-2026-10-20';
function register(){
 if(typeof exerciseGuides==='undefined')return;
 for(const [name,g] of Object.entries(GUIDES)){
  const stretching=g.icon==='stretch',rest=stretching?35:g.icon==='machine'?100:90;
  exerciseGuides[name]={
   rest,form:g.how,
   load:stretching?'Esnemeyi zorlamadan, rahat bir gerilmede 15 saniye tut.':"Koçun programındaki set ve tekrar hedefini esas al; hareketi kontrol edemiyorsan ağırlığı azalt."
  };
 }
}
function decorate(){
 const rows=records();
 const cards=[...document.querySelectorAll('.workout-card')];
 if(!cards.length||!rows.some(isExact))return;
 for(let i=0;i<Math.min(rows.length,cards.length);i++){
  const e=rows[i],g=GUIDES[e.name],card=cards[i];
  if(!isExact(e)||!g||!card)continue;
  const head=card.querySelector('.exercise-head');if(!head)continue;
  let box=card.querySelector('.ft-howto');
  if(!box){box=document.createElement('section');box.className='ft-howto';head.insertAdjacentElement('afterend',box)}
  const url='https://www.youtube.com/results?search_query='+encodeURIComponent(e.name+' exercise demonstration');
  const neck=/Military Press|Arnold Press|Upright Row|Cable Shrug|Overhead Triceps/.test(e.name);
  box.innerHTML='<div class="ft-howto-row"><span class="ft-howto-icon" aria-hidden="true">'+(ICONS[g.icon]||ICONS.body)+'</span><div class="ft-howto-body"><strong>'+safe(g.tr)+'</strong><div class="ft-howto-equipment">ALETLER: '+safe(g.gear)+'</div></div></div>'+
    '<p class="ft-howto-how">'+safe(g.how)+'</p>'+
    (neck?'<div class="ft-howto-care">Boyun veya kola yayılan ağrı/uyuşma artarsa hareketi bırak.</div>':'')+
    '<a class="ft-howto-video" href="'+url+'" target="_blank" rel="noopener noreferrer" aria-label="'+safe(g.tr)+' için video örnekleri aç">▶ Video örnekleri</a>';
  const original=card.querySelector('.form-guide .guide-grid');
  if(original){
   const form=original.querySelector('.guide-box:first-child .muted');
   const load=original.querySelector('.guide-box:nth-child(2) .muted');
   if(form)form.textContent=g.how;
   if(load)load.textContent=g.icon==='stretch'?'15 saniye rahat esneme; ağrıya zorlama.':'Set ve tekrarları koçun verdiği şekilde uygula. Teknik bozuluyorsa ağırlığı düşür.';
  }
 }
}
const css=document.createElement('style');css.id='ft-howto-styles';css.textContent=`
.ft-howto{margin:4px 0 11px;padding:10px 11px 9px;border:1px solid #d8e4f2;background:#f7fbff;border-radius:11px;color:#223047}
.ft-howto-row{display:flex;align-items:center;gap:9px}.ft-howto-icon{flex:none;width:34px;height:34px;border:1px solid #d0e2f4;border-radius:10px;background:#e9f2fd;color:#2460a3;display:grid;place-items:center}.ft-howto-icon svg{width:25px;height:25px}
.ft-howto-body{min-width:0;flex:1}.ft-howto-body strong{display:block;font-size:13px;line-height:1.25;font-weight:850}.ft-howto-equipment{color:#4b6685;font-weight:750;font-size:10px;letter-spacing:.012em;margin-top:3px}
.ft-howto-how{font-size:12px;line-height:1.48;margin:8px 0 0;color:#303e51}.ft-howto-care{color:#87561b;background:#fff8ed;border:1px solid #f6dfbf;border-radius:7px;padding:5px 7px;font-size:10.5px;margin-top:7px}
.ft-howto-video{display:inline-flex;align-items:center;margin-top:7px;font-size:11px;font-weight:850;color:#1459a1;text-decoration:none;min-height:25px}
@media(max-width:600px){.ft-howto{padding:9px 10px;margin-bottom:8px}.ft-howto-how{font-size:11.5px}.ft-howto-body strong{font-size:12.5px}}
`;
document.head.appendChild(css);
register();
const original=window.renderWorkout;
if(typeof original==='function'){
 window.renderWorkout=function(){register();const result=original.apply(this,arguments);decorate();[70,250,750,1250].forEach(ms=>setTimeout(decorate,ms));return result};
}
decorate();setTimeout(decorate,300);setTimeout(decorate,1100);
window.FT_HOWTO={version:'2.1.12',count:Object.keys(GUIDES).length,coverage:()=>{const r=records();return{total:r.length,covered:r.filter(e=>!!GUIDES[e.name]).length,rendered:document.querySelectorAll('.workout-card .ft-howto').length}}};
})();