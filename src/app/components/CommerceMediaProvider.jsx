"use client";
import {createContext,useContext,useEffect,useMemo,useState} from 'react';
const ApprovedMedia=createContext({records:{},recoveredIds:new Set()});
const pending=new Map();

export function useCommerceMedia(sakeId,nearViewport) {
  const {records,recoveredIds}=useContext(ApprovedMedia);
  const [remote,setRemote]=useState(null);
  const known=recoveredIds.has(sakeId);
  useEffect(()=>{
    if(!nearViewport||!known||records[sakeId])return;
    let current=true;
    const url='/commerce-media/'+encodeURIComponent(sakeId)+'.json';
    if(!pending.has(sakeId))pending.set(sakeId,fetch(url).then(r=>{
      if(!r.ok)throw Error('Image creative is unavailable');
      return r.json();
    }).catch(()=>{pending.delete(sakeId);return null;}));
    pending.get(sakeId).then(media=>{if(current)setRemote({id:sakeId,media});});
    return ()=>{current=false;};
  },[sakeId,nearViewport,known,records]);
  const media=records[sakeId]??(remote?.id===sakeId?remote.media:null);
  return {media,expected:!!records[sakeId]||known};
}
export default function CommerceMediaProvider({records,recoveredIds,children}) {
  const value=useMemo(()=>({records,recoveredIds:new Set(recoveredIds)}),[records,recoveredIds]);
  return <ApprovedMedia.Provider value={value}>{children}</ApprovedMedia.Provider>;
}
