import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';

const root=path.resolve(fileURLToPath(new URL('../',import.meta.url)));
const manifestPath='src/commerce/generated/private-material-digests.json';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const hash=value=>createHash('sha256').update(value).digest('hex');
const manifest=read(path.join(root,manifestPath));
const allowed=new Set([
  'src/commerce/foodSpecialties.json','src/commerce/localSakana.json',
  'src/commerce/generated/product-media.json','src/commerce/generated/netlify-creatives.json',
  'src/commerce/generated/netlify-image-recovery.json','src/commerce/generated/netlify-affiliate-recovery.json',
  'src/commerce/generated/netlify-release-approvals.json',
  'src/commerce/generated/netlify-purchase.json',
  'src/commerce/generated/netlify-specialty-ordinary.json',
]);
assert(manifest.schemaVersion===1&&Object.keys(manifest.files).length===allowed.size);
assert(Object.keys(manifest.files).every(name=>allowed.has(name)));

export function ensureCommerceBuild(env){
  const full=env.AFFILIATE_ENABLED==='true';
  if(full&&env.NETLIFY==='true'){
    throw Error('Full Commerce is not permitted on unverified Netlify deploy hosts. Use the local materialized QA build.');
  }
  for(const [name,proof] of Object.entries(manifest.files)){
    const digest=hash(fs.readFileSync(path.join(root,name)));
    if(digest!==(full?proof.originalSha256:proof.publicSha256)){
      throw Error(full?'Required private material is missing or changed: '+name:'Public preview must not contain private material: '+name);
    }
  }
}

function materialize(bundleFile,dir) {
  const destination=path.resolve(dir);
  assert(path.dirname(destination)===path.dirname(root)&&path.basename(destination).startsWith('netlify-private-qa-'),
    'Private QA is limited to a new sibling directory named netlify-private-qa-*');
  assert(!fs.existsSync(destination),'Create a new private QA directory; never overwrite a checkout');
  const bundle=read(path.resolve(bundleFile));
  assert(bundle.schemaVersion===1&&Object.keys(bundle.files).length===allowed.size);
  const restored={};
  for(const [name,proof] of Object.entries(manifest.files)){
    assert.equal(hash(fs.readFileSync(path.join(root,name))),proof.publicSha256,name);
    const raw=Buffer.from(bundle.files[name]?.bytesBase64??'','base64');
    assert.equal(hash(raw),proof.originalSha256,name);
    restored[name]=raw;
  }
  fs.mkdirSync(destination);
  for(const name of ['src','scripts','data','public','docs','package.json','package-lock.json','tsconfig.json',
    'next.config.ts','next-env.d.ts','postcss.config.mjs','netlify.toml','vercel.json','.gitignore','.gitattributes','AGENTS.md','README.md']){
    fs.cpSync(path.join(root,name),path.join(destination,name),{recursive:true,errorOnExist:true});
  }
  for(const [name,bytes] of Object.entries(restored))fs.writeFileSync(path.join(destination,name),bytes,{mode:0o600});
  console.log({privateFilesVerified:allowed.size,readyForLocalBuild:true});
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  assert.equal(process.argv.length,4,'Provide a private bundle and a new isolated QA directory');
  materialize(process.argv[2],process.argv[3]);
}
