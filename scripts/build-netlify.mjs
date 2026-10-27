import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import {validateHostingEnvironment,prepareNetlifyExport} from './netlify-export.mjs';

try{
 validateHostingEnvironment(process.env);
 for(const args of [['node_modules/next/dist/bin/next','build','--webpack'],['scripts/postbuild.mjs']]){
  const result=spawnSync(process.execPath,args,{stdio:'inherit',env:process.env});if(result.error)throw new Error('Hosting build process could not start');if(result.status!==0)process.exit(result.status||1);
 }
 console.log(JSON.stringify(prepareNetlifyExport('out',JSON.parse(fs.readFileSync('vercel.json','utf8')))));
}catch(error){console.error(error.message);process.exitCode=1;}
