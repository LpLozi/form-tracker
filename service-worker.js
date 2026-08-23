const CACHE='form-v1.7.0';
const PRECACHE=[
  '/',
  '/index.html',
  '/app-base.html',
  '/manifest.webmanifest',
  '/upgrade.css',
  '/upgrade.js',
  '/nutrition-plus.css',
  '/nutrition-plus.js',
  '/nutrition-raw-foods.js',
  '/nutrition-ui-v2.css',
  '/nutrition-ui-v2.js',
  '/nutrition-meal-tabs.css',
  '/nutrition-meal-tabs.js',
  '/nutrition-mobile-fix.css',
  '/workout-plus.css',
  '/workout-plus.js',
  '/workout-ui-v2.css',
  '/workout-ui-v2.js',
  '/ft-workout-ux-fix.css',
  '/ft-workout-ux-fix.js',
  '/ft-training-v3.css',
  '/ft-training-v3.js',
  '/coach-plus.css',
  '/coach-plus.js',
  '/coach-refine.js',
  '/mobile-fix.css',
  '/mobile-fix.js',
  '/exercise-library.css',
  '/exercise-library.js',
  '/schedule-v2.js',
  '/hyrox-day-selector.js',
  '/ft-workout-smart.js',
  '/ft-life-smart.js',
  '/ft-smart-hotfix.js',
  '/assets/form-logo.svg',
  '/icon-192.png',
  '/icon-512.png'
];
const PRECACHE_SET=new Set(PRECACHE);
self.addEventListener('install',event=>{self.skipWaiting();event.waitUntil((async()=>{const cache=await caches.open(CACHE);await Promise.allSettled(PRECACHE.map(async url=>{const response=await fetch(url,{cache:'reload'});if(response.ok)await cache.put(url,response)}))})())});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(key=>key.startsWith('form-')&&key!==CACHE).map(key=>caches.delete(key)));await self.clients.claim()})())});
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;const url=new URL(event.request.url);if(url.origin!==self.location.origin)return;if(event.request.mode==='navigate'){event.respondWith((async()=>{try{const response=await fetch(event.request,{cache:'no-store'});if(response&&response.ok){const cache=await caches.open(CACHE);await cache.put('/index.html',response.clone())}return response}catch(_){return (await caches.match('/index.html'))||(await caches.match('/'))||Response.error()}})());return}if(!PRECACHE_SET.has(url.pathname)&&!/[.](?:css|js|png|svg|webmanifest)$/.test(url.pathname))return;event.respondWith((async()=>{try{const response=await fetch(event.request,{cache:'no-store'});if(response&&response.ok){const cache=await caches.open(CACHE);await cache.put(url.pathname,response.clone());return response}}catch(_){ }return (await caches.match(url.pathname))||Response.error()})())});