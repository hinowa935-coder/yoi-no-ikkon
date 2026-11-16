import { recoveredImageFor, recoveredImageIds } from '../../../commerce/server.js';

export const dynamic='force-static';
const noMediaAsset='_empty.json';

export function generateStaticParams() {
 const ids=recoveredImageIds();
 // Static export requires at least one path, even for a preview without approved media.
 return ids.length?ids.map(id=>({asset:id+'.json'})):[{asset:noMediaAsset}];
}

export async function GET(_request,{params}) {
 const {asset}=await params;
 if(asset===noMediaAsset)return Response.json(null);
 const id=typeof asset==='string'&&asset.endsWith('.json')?asset.slice(0,-5):'';
 const media=recoveredImageFor(id);
 return media?Response.json(media):new Response(null,{status:404});
}
