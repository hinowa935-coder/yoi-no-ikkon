export function readFoodLocation(search){
  const params=new URLSearchParams(search),count=Number(params.get('count'));
  return {query:params.get('q')||'',category:params.get('category')||'',all:params.get('all')==='1',limit:Number.isInteger(count)&&count>=24?Math.min(count,1000):24};
}
export function writeFoodLocation(search,{query,category,all,limit}){
  const params=new URLSearchParams(search);
  for(const[key,value]of Object.entries({q:query,category,all:all?'1':'',count:limit>24?String(limit):''})){if(value)params.set(key,value);else params.delete(key);}
  return params.size?'?'+params:'';
}
