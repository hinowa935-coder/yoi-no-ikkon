"use client";
import {useSyncExternalStore} from 'react';
const listeners=new Set();
const format=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'});
const snapshot=()=>format.format(new Date());
const serverSnapshot=()=>'';
let timer;
const notify=()=>listeners.forEach(listener=>listener());
function subscribe(listener){
  listeners.add(listener);
  if(listeners.size===1){
    timer=setInterval(notify,60000);
    window.addEventListener('pageshow',notify);
    document.addEventListener('visibilitychange',notify);
  }
  return()=>{
    listeners.delete(listener);
    if(!listeners.size){
      clearInterval(timer);
      window.removeEventListener('pageshow',notify);
      document.removeEventListener('visibilitychange',notify);
    }
  };
}
// Static exports must not freeze automatic suggestions to their build month.
export default function useCurrentTokyoDay(){
  return useSyncExternalStore(subscribe,snapshot,serverSnapshot);
}
