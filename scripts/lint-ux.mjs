import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
// Dependency-free project checks with the installed TypeScript parser; not an ESLint substitute.
const failures=[];
let files=0;
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
  const p=path.join(dir,entry.name);if(entry.isDirectory())walk(p);
  else if(/\.(jsx?|tsx?)$/.test(p)){
    files++;
    const text=fs.readFileSync(p,'utf8');
    const ast=ts.createSourceFile(p,text,ts.ScriptTarget.Latest,true,p.endsWith('x')?ts.ScriptKind.TSX:ts.ScriptKind.JS);
    for(const error of ast.parseDiagnostics)failures.push(`${p}: ${ts.flattenDiagnosticMessageText(error.messageText,' ')}`);
    if(/<<<<<<<|>>>>>>>/.test(text))failures.push(`${p}: merge conflict marker`);
    if(/\b(?:console\.log|debugger)\s*\(/.test(text))failures.push(`${p}: debug output in public source`);
  }
}}
walk('src');
console.log(JSON.stringify({check:'TypeScript syntax, conflict markers and public debug output (not ESLint)',files,failures}));
if(failures.length)process.exitCode=1;
