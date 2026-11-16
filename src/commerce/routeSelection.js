export function chooseRakutenRoute(plan,now) {
  for(const [type,link] of [['AFFILIATE_DIRECT',plan.affiliate],['NORMAL_DIRECT',plan.normal],['SEARCH',plan.search]]) {
    if(link&&(type==='SEARCH'||now!==null&&Date.parse(link.validUntil)>now))return {type,link};
  }
  return {type:'NONE',link:null};
}
