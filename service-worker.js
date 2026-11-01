const CACHE='form-v3.1.0';
const FILES=['/','/index.html','/form-app.css?v=310','/form-data.js?v=310','/form-model.js?v=310','/form-store.js?v=310','/form-workout-art.js?v=310','/form-app.js?v=310','/manifest.webmanifest','/icon-192.png','/icon-512.png'];
self.addEventListener('install',event=>event.waitUntil((async()=>{const cache=await caches.open(CACHE);await cache.addAll(FILES);await self.skipWaiting();})()));
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('fetch',event=>{const u=new URL(event.request.url);if(event.request.method!=='GET'||u.origin!==self.location.origin)return;
 if(event.request.mode==='navigate'){event.respondWith(fetch(event.request).catch(async()=>{const c=await caches.open(CACHE);return await c.match('/index.html')||Response.error();}));return;}
 if(FILES.some(f=>new URL(f,self.location.origin).pathname===u.pathname))event.respondWith((async()=>{const c=await caches.open(CACHE);return await c.match(event.request)||fetch(event.request);})());
});
