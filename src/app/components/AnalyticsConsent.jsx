'use client';

import {useSyncExternalStore} from 'react';
import GoogleAnalytics from './GoogleAnalytics.jsx';
import {analyticsMeasurementId} from '../../data/analytics.js';

const key='yoi-analytics-consent-v1',event='yoi-analytics-consent';
let transient=null;
const server=()=>null;
function read(){try{return transient??window.localStorage.getItem(key);}catch{return transient;}}
function subscribe(change){
 const refresh=()=>{disable(read()!=='allow');change();};
 const onStorage=e=>{if(e.key===key||e.key===null){transient=null;refresh();}};
 window.addEventListener(event,refresh);window.addEventListener('storage',onStorage);
 return ()=>{window.removeEventListener(event,refresh);window.removeEventListener('storage',onStorage);};
}
function disable(value){const id=analyticsMeasurementId();if(id)window[`ga-disable-${id}`]=value;}
function choose(value){
 transient=value;disable(value!=='allow');
 try{window.localStorage.setItem(key,value);}catch{}
 window.dispatchEvent(new Event(event));
}
export default function AnalyticsConsent(){
 return useSyncExternalStore(subscribe,read,server)==='allow'?<GoogleAnalytics/>:null;
}
export function AnalyticsPreference(){
 const choice=useSyncExternalStore(subscribe,read,server);
 return <fieldset><legend>利用状況の計測</legend>
   <label><input type="radio" name="analytics-preference" checked={choice==='allow'} onChange={()=>choose('allow')}/> 許可する</label>{' '}
   <label><input type="radio" name="analytics-preference" checked={choice!=='allow'} onChange={()=>choose('deny')}/> 許可しない</label>
 </fieldset>;
}
