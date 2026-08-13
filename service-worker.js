const CACHE_NAME = "form-v1.5.1";
const ASSETS = ["./", "./index.html", "./manifest.webmanifest", "./upgrade.css", "./upgrade.js", "./nutrition-plus.css", "./nutrition-plus.js", "./assets/form-logo.svg", "/api/icon"];
const HEAD_INJECT='<link rel="stylesheet" href="./upgrade.css?v=151"><link rel="stylesheet" href="./nutrition-plus.css?v=151"><link rel="icon" href="./assets/form-logo.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/api/icon">';
const BODY_INJECT='<script src="./upgrade.js?v=151"></script><script src="./nutrition-plus.js?v=151"></script>';
function inject(html){let out=html;
  out=out.replace(/<title>FORGE — Kişisel Performans Takibi<\/title>/,'<title>FORM — Kişisel Spor & Beslenme Takibi</title>');
  out=out.replace(/<div class="brand">FOR<span>G<\/span>E<\/div>/,'<div class="brand">F<span>O</span>RM</div>');
  out=out.replace(/<h1>FORGE<\/h1>/,'<h1>FORM Performance</h1>');
  out=out.replace('Disiplinini kaydet. Gelişimini gör. Bir sonraki seviyeye çık.','Antrenman, beslenme ve vücut kompozisyonunu tek merkezden takip et.');
  if(!out.includes('upgrade.css?v=151'))out=out.replace('</head>',HEAD_INJECT+'</head>');
  if(!out.includes('upgrade.js?v=151'))out=out.replace('</body>',BODY_INJECT+'</body>');
  return out;
}
self.addEventListener("install", event => { event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))); self.skipWaiting(); });
self.addEventListener("activate", event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url=new URL(event.request.url); if(url.origin!==location.origin) return;
  if(event.request.mode==='navigate'||url.pathname.endsWith('/index.html')){
    event.respondWith((async()=>{try{const response=await fetch('./index.html',{cache:'no-store'});const html=inject(await response.text());return new Response(html,{status:200,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}})}catch(e){const cached=await caches.match('./index.html');if(!cached)return Response.error();return new Response(inject(await cached.text()),{status:200,headers:{'Content-Type':'text/html; charset=utf-8'}})}})()); return;
  }
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => { const copy=response.clone(); caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy)); return response; })));
});