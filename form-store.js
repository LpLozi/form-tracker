/* Local, transactional persistence. Legacy localStorage remains untouched. */
window.FormStore=(()=>{
 let conn,revision=0;const channel=typeof BroadcastChannel!=='undefined'?new BroadcastChannel('form3-records'):null;
 let foreign=false;
 channel?.addEventListener('message',e=>{if(e.data>revision){foreign=true;window.dispatchEvent(new Event('form-conflict'));}});
 const request=r=>new Promise((ok,no)=>{r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error);});
 async function open(){conn=await new Promise((ok,no)=>{const r=indexedDB.open('FORM3',1);r.onupgradeneeded=()=>{r.result.createObjectStore('state');r.result.createObjectStore('snapshots',{keyPath:'id'});};r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error);});const record=await request(conn.transaction('state').objectStore('state').get('current'));revision=record?.revision||0;return record?.data||null;}
 function save(data,snapshot=false){return new Promise((ok,no)=>{
  if(foreign)return no(new Error('Başka bir sekmede daha yeni kayıt var. Bu ekranı yenileyerek devam et.'));
  const tx=conn.transaction(['state','snapshots'],'readwrite'),store=tx.objectStore('state');let error;
  const read=store.get('current');read.onsuccess=()=>{const old=read.result;if((old?.revision||0)!==revision){error=new Error('Başka sekmede kayıt değişti. Yenileyerek devam et.');tx.abort();return;}
   if(old&&(snapshot||!old.snapshotAt||Date.now()-old.snapshotAt>1800000)){const s=tx.objectStore('snapshots');s.put({id:Date.now(),data:old.data});const keys=s.getAllKeys();keys.onsuccess=()=>keys.result.slice(0,-3).forEach(k=>s.delete(k));}
   store.put({revision:revision+1,data,snapshotAt:snapshot||!old?.snapshotAt||Date.now()-old.snapshotAt>1800000?Date.now():old.snapshotAt},'current');
  };
  tx.oncomplete=()=>{revision++;channel?.postMessage(revision);ok();};tx.onerror=()=>no(error||tx.error||new Error('Kayıt yazılamadı'));tx.onabort=()=>no(error||tx.error||new Error('Kayıt iptal edildi'));
 });}
 async function snapshots(){return request(conn.transaction('snapshots').objectStore('snapshots').getAll());}
 return {open,save,snapshots};
})();
