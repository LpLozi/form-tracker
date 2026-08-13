const SOURCE='https://form-tracker-8yruq0f6b-aviskhuseyin-2352s-projects.vercel.app/index.html';
module.exports=async(req,res)=>{
  try{
    const r=await fetch(SOURCE,{headers:{'user-agent':'FORM-upgrader/1.0'}});
    if(!r.ok) throw new Error('source '+r.status);
    let html=await r.text();
    const head=`<link rel="stylesheet" href="/upgrade.css?v=153"><link rel="stylesheet" href="/nutrition-plus.css?v=153"><link rel="icon" href="/assets/form-logo.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/api/icon"><link rel="manifest" href="/manifest.webmanifest">`;
    const body=`<script src="/upgrade.js?v=153"></script><script src="/nutrition-plus.js?v=153"></script>`;
    if(!html.includes('upgrade.css?v=153')) html=html.replace('</head>',head+'</head>');
    if(!html.includes('upgrade.js?v=153')) html=html.replace('</body>',body+'</body>');
    html=html.replace("const APP_VERSION='1.4.0'","const APP_VERSION='1.5.3'");
    res.setHeader('Content-Type','text/html; charset=utf-8');
    res.setHeader('Cache-Control','no-store, max-age=0');
    res.status(200).send(html);
  }catch(e){res.status(500).send('FORM yüklenemedi: '+e.message)}
};