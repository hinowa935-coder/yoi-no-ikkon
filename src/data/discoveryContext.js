import {discoveryNights,discoveryDishes,foodDirections,scorePairing} from './discovery.js';
export function sakeDiscoveryHref(id,{nightId,directionId,dishName,seed,dishLimit=6}) {
  const query=new URLSearchParams({from:'discover',night:nightId,direction:directionId,dish:dishName,day:seed});
  if(dishLimit>6)query.set('dishes',String(dishLimit));
  return `/sake/${id}?${query}`;
}
export function sakeDiscoveryContext(query,item) {
  if(query.get('from')!=='discover')return null;
  const night=discoveryNights.find(n=>n.id===query.get('night'));
  const direction=foodDirections.find(d=>d.id===query.get('direction'));
  const dish=discoveryDishes.find(d=>d.name===query.get('dish')&&d.directions.includes(direction?.id));
  const seed=query.get('day');
  if(!night||!direction||!dish||!/^\d{4}-\d{2}-\d{2}$/.test(seed||''))return null;
  const pairing=scorePairing(item,dish.name,night.id);
  if(pairing.strength<6||pairing.nightAffinity.score<=0)return null;
  const back=new URLSearchParams({night:night.id,direction:direction.id,dish:dish.name,day:seed});
  const limit=Number(query.get('dishes'));if(Number.isInteger(limit)&&limit>6&&limit<=24)back.set('dishes',String(limit));
  return{dishName:dish.name,nightId:night.id,nightName:night.name,reason:pairing.reason,returnHref:`/discover?${back}#sake-recommendations`};
}
