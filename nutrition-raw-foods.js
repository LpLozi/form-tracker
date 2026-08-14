(()=>{
'use strict';
const RAW_FOODS=[
  makeFood('Pirinç beyaz (çiğ)','Tahıl',365,7.1,80.0,.7,100,'g',1.3),
  makeFood('Basmati pirinç (çiğ)','Tahıl',350,8.8,77.7,.8,100,'g',1.0),
  makeFood('Tavuk göğsü (çiğ)','Et & Tavuk',120,22.5,0,2.6,100,'g',0),
  makeFood('Tavuk but derisiz (çiğ)','Et & Tavuk',144,18.6,0,7.9,100,'g',0),
  makeFood('Patates (çiğ)','Sebze & Bakliyat',77,2.0,17.5,.1,100,'g',2.2)
];

const key=s=>String(s||'').toLocaleLowerCase('tr-TR');
const existingDefaults=new Set(defaultFoods.map(f=>key(f.name)));
RAW_FOODS.forEach(f=>{if(!existingDefaults.has(key(f.name)))defaultFoods.push(f)});

const existingDb=new Set((db.foods||[]).map(f=>key(f.name)));
let added=0;
RAW_FOODS.forEach(f=>{
  if(!existingDb.has(key(f.name))){
    (db.foods=db.foods||[]).push({...f});
    existingDb.add(key(f.name));
    added++;
  }
});
if(added)save();
})();