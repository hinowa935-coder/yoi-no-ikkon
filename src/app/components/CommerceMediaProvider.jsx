"use client";
import {createContext,useContext} from 'react';
const MediaEnabled=createContext(false);
export const useCommerceMedia=()=>useContext(MediaEnabled);
export default function CommerceMediaProvider({enabled,children}) {
  return <MediaEnabled.Provider value={enabled}>{children}</MediaEnabled.Provider>;
}
