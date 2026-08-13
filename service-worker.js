const CACHE_NAME='forge-v1.5.0';
const ASSETS=['./','./index.html','./manifest.webmanifest','/api/icon'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(ASSETS)));self.skipWaiting();});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))));self.clients.claim();});
function rebrand(html){return html
.replace(/<title>FORM — Kişisel Spor & Beslenme Takibi<\/title>/,'<title>FORGE — Kişisel Performans Takibi</title>')
.replace('<div class="brand">F<span>O</span>RM</div>','<div class="brand">FOR<span>G</span>E</div>')
.replace('Hüseyin’in kişisel dönüşüm kontrol merkezi','Bugün dünden biraz daha güçlü ol.')
.replace('<h1>FORM Performance</h1>','<h1>FORGE</h1>')
.replace('Antrenman, beslenme ve vücut kompozisyonunu tek merkezden takip et.','Disiplinini kaydet. Gelişimini gör. Bir sonraki seviyeye çık.')
.replace('<div class="form-mark"><svg viewBox="0 0 64 64"><path d="M13 18h17v8H21v8h9v8h-9v12h-8V18Z" fill="currentColor"/><path d="M38 18h13v8H38zM38 30h9v8h-9zM38 42h13v8H38z" fill="rgba(255,255,255,.72)"/></svg></div>','<div class="form-mark" style="background:url(\'/api/icon\') center/cover no-repeat"></div>');}
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;const url=new URL(event.request.url);if(event.request.mode==='navigate'||url.pathname.endsWith('/index.html')){event.respondWith(fetch(event.request).then(async response=>{const text=await response.text();const branded=rebrand(text);const out=new Response(branded,{status:response.status,statusText:response.statusText,headers:{'Content-Type':'text/html; charset=utf-8'}});caches.open(CACHE_NAME).then(c=>c.put('./index.html',out.clone()));return out;}).catch(()=>caches.match('./index.html')));return;}event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy));return response;})));});