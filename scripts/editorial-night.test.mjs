import test from 'node:test';
import assert from 'node:assert/strict';
import {discoveryProducts, discoveryNights, nightsForSake, nightAffinity} from '../src/data/discovery.js';
import {editorialNightAssignments} from '../src/data/editorialNightAssignments.js';
import {allSakePairings,sakeCatalogStatus} from '../src/data/siteData.js';
import {lineupBatch} from './lib/reviewed-lineup-update.mjs';

test('active explicit impression assignments exclude retired identities and remain separate from verified facts and temperature',()=>{
  assert(Object.keys(editorialNightAssignments).length>0);
  for(const [id,assignment] of Object.entries(editorialNightAssignments)) {
    const item=allSakePairings.find(p=>p.id===id);
    assert(item);
    if(sakeCatalogStatus(id)!=='ACTIVE'){
      assert(lineupBatch.inactivated.includes(id),'Only an explicitly reviewed later lifecycle decision may exclude an old assignment');
      assert(!discoveryProducts.some(p=>p.id===id));
    }
    assert(discoveryNights.some(n=>n.id===assignment.nightId));
    const result=nightAffinity(item,assignment.nightId);
    assert.equal(result.provenance,'editorialImpression');
    assert.deepEqual(result.signals,[]);
    assert.deepEqual(result.temperatureSourceUrls,[]);
    assert.equal(result.temperatureMatch,false);
    assert.equal(assignment.packageReviewed,false);
    assert(assignment.reason.length>10);
    assert(nightsForSake(item).some(n=>n.id===assignment.nightId));
    assert.equal(nightAffinity(item,assignment.nightId,{[id]:{[assignment.nightId]:{exclude:true}}}).score,0);
  }
  assert.equal(discoveryProducts.filter(p=>!nightsForSake(p).length).length,0);
});

test('unregistered identities do not receive inferred night assignments',()=>{
  for(const night of discoveryNights) {
    assert.equal(nightAffinity({id:'unknown-editorial-fixture',productName:'雪 月 桜',prefecture:'北海道'},night.id).score,0);
  }
});
