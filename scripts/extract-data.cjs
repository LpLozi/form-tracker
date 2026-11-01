const fs=require('node:fs'),vm=require('node:vm');
const base=fs.readFileSync('app-base.html','utf8');
const foodCode=base.slice(base.indexOf('const makeFood='),base.indexOf('const defaultProgram='));
const foods=vm.runInNewContext(foodCode+';defaultFoods');
for(const [file,start,end] of [['nutrition-raw-foods.js','const RAW_FOODS=',';\n'],['nutrition-plan-v3.js','const PLAN_FOODS=',';\n']]){
 const src=fs.readFileSync(file,'utf8'),a=src.indexOf(start),b=src.indexOf('];',a)+2;
 const make=foodCode.slice(0,foodCode.indexOf('const defaultFoods='));
 const more=vm.runInNewContext(make+'const food=makeFood;'+src.slice(a,b)+';'+(start.includes('RAW')?'RAW_FOODS':'PLAN_FOODS'));
 for(const f of more)if(!foods.some(x=>x.name===f.name))foods.push(f);
}
const how=fs.readFileSync('ft-exercise-howto.js','utf8');const gs=how.indexOf('const GUIDES=');const ge=how.indexOf('\n};',gs)+3;
const guides=vm.runInNewContext(how.slice(gs,ge)+';GUIDES');
fs.writeFileSync('form-data.js','window.FORM_DATA='+JSON.stringify({foods,guides})+';\n');
console.log(foods.length,'foods;',Object.keys(guides).length,'legacy guides preserved');
