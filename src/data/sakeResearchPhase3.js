import data from "./sakeResearchPhase3Data.json" with { type: "json" };

export const sakeResearchPhase3 = data;
export const sakeResearchPhase3ById = Object.fromEntries(data.map(record => [record.id, record]));
