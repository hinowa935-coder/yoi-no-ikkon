import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url)));
const catalog=read('src/data/discoveryCatalog.json'),matches=read('src/commerce/generated/purchase-matches.json'),media=read('src/commerce/generated/product-media.json');
const pairs=[['tsujun-mfekdo','tsujun-semi-junmai-ginjo-standard'],['hisagotaiko-junmai-ginjo-led-v1','hisagotaiko-ginjo-awa-yamadanishiki-standard'],['hyakushun-ia8tng','hyakushun-junmai-josen-standard']];
test('fallback recovery keeps 492 identities and adds thirty-seven linked original creatives',()=>{
 assert.equal(catalog.items.length,492);assert.equal(new Set(catalog.items.map(i=>i.id)).size,492);
 const later=read('docs/rakuten-deep-review/published.json').rows;
 assert.equal(Object.values(matches).filter(m=>m.directLinkAllowed).length,352+later.length);assert.equal(Object.keys(media.records).length,344+later.filter(r=>r.imageAdded).length);
 const additions=Object.values(matches).filter(m=>m.source==='fallbackRecoveryCurrentCommercialMatch');assert.equal(additions.length,37);
 for(const m of additions){assert.equal(m.matchType,'COMMERCIAL_MATCH');assert.equal(m.identityVerified,false);const image=media.records[m.sakeId];assert.equal(image.productUrl,m.normalUrl);assert.equal(image.itemCode,m.itemCode);assert.equal(image.imageCapacityMl,m.capacityMl);assert.equal(image.originalUnmodified,true);}
});
test('three replacements have new IDs and preserve old favorites as archives without automatic migration',()=>{
 for(const [oldId,newId]of pairs){assert(!catalog.items.some(i=>i.id===oldId));const item=catalog.items.find(i=>i.id===newId);assert(item);assert.deepEqual(item.officialPairings,[]);assert.equal(item.yoiPairings.length,3);assert(item.editorialPairingEvidence.every(e=>e.provenance==='yoiEditorial'));
 const ref=catalog.references.find(r=>r.legacyId===oldId);assert.equal(ref.canonicalId,null);assert.equal(ref.status,'replaced_archive');assert.equal(ref.automaticFavoriteMigration,false);assert.equal(ref.suggestedReplacementId,newId);
 assert(item.sakeResearch.featureEvidence.every(e=>e.sourceUrl===item.sakeResearch.identity.officialProductUrl));}
});
test('new product designations and rice roles are not inherited from the retired products',()=>{
 const get=id=>catalog.items.find(i=>i.id===id).sakeResearch;
 const semi=get(pairs[0][1]);assert.deepEqual(semi.specs.riceByRole,{koji:'山田錦',kake:'華錦'});assert.equal(semi.specs.nihonshudo,'+3');assert.equal(semi.classification.junmaiDaiginjo,false);
 const awa=get(pairs[1][1]);assert.equal(awa.classification.junmai,false);assert.equal(awa.classification.nonJunmai,true);assert(awa.specs.ingredients.includes('醸造アルコール'));assert.deepEqual(awa.servingTemperatures,[]);
 const josen=get(pairs[2][1]);assert.equal(josen.classification.tokuteiMeishoshu,'特別純米酒');assert.deepEqual(josen.servingTemperatures,[]);
});
test('Nabeshima uses an available alternative shop without accepting the wrong series',()=>{
 assert.equal(matches['nabeshima-junmai-ginjo'].normalUrl,'https://item.rakuten.co.jp/chagatapark/183643210/');assert.equal(matches['nabeshima-junmai-ginjo'].capacityMl,1800);
 assert(!matches['matsunokotobuki-junmai-ginjo']?.directLinkAllowed);
 const forbidden={ 'taikan-i9dko8':'https://item.rakuten.co.jp/attaatta/10000692/','kurumazaka-gp8l70i9d-3':'https://item.rakuten.co.jp/sanoyajizake/ns521/','okunokami-junmai-ginjo-muchosei-nama-v1':'https://item.rakuten.co.jp/yamasake/6850/'};
 for(const [id,wrongVariant]of Object.entries(forbidden))assert.notEqual(matches[id]?.normalUrl,wrongVariant);
});
