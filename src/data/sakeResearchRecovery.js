import data from "./sakeResearchRecoveryData.json" with {type:"json"};

export const sakeResearchRecovery=data;
export const sakeResearchRecoveryById=Object.fromEntries(data.map(r=>[r.id,r]));
