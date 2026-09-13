export const SCALE=2,W=21,H=13;
const key=(x,y)=>`${x},${y}`;
const border=[
  ...Array.from({length:W},(_,x)=>key(x,0)),...Array.from({length:W},(_,x)=>key(x,H-1)),
  ...Array.from({length:H},(_,y)=>key(0,y)),...Array.from({length:H},(_,y)=>key(W-1,y))];
const room=(extra=[])=>{const cells=new Set(border);for(const [x,y] of extra)for(let oy=0;oy<SCALE;oy++)for(let ox=0;ox<SCALE;ox++)cells.add(key(x*SCALE+ox,y*SCALE+oy));return cells;};
const exactRoom=(extra=[])=>new Set([...border,...extra.map(([x,y])=>key(x,y))]);
const RAW_CONFIGS={
  61:{start:{x:1,y:5},gate:{x:8,y:3},crystal:{x:9,y:3},plates:[{x:5,y:5},{x:5,y:4}],objects:[{id:'sun',type:'rock',x:3,y:5},{id:'moon',type:'rock',x:5,y:2}],solids:room([[4,2],[4,3],[6,3],[6,4],[9,2],[9,4]])},
  62:{start:{x:1,y:5},gate:{x:8,y:3},crystal:{x:9,y:3},plates:[{x:7,y:5},{x:4,y:4}],objects:[{id:'sun',type:'crate',x:3,y:5},{id:'moon',type:'crate',x:4,y:2}],solids:room([[6,2],[6,3],[6,4],[9,2],[9,4]]),crate:true},
  63:{exact:true,start:{x:4,y:10},gate:{x:16,y:10},crystal:{x:18,y:10},plates:[{x:14,y:2},{x:14,y:4}],objects:[{id:'sun',type:'metal',x:14,y:7},{id:'moon',type:'metal',x:8,y:9}],solids:exactRoom([
    [14,1],...Array.from({length:8},(_,i)=>[13,i+1]),...Array.from({length:8},(_,i)=>[15,i+1]),
    ...Array.from({length:11},(_,i)=>i+1).filter(y=>y!==10).map(y=>[16,y])
  ]),crate:true,logicSequence:true},
  64:{exact:true,start:{x:14,y:10},gate:{x:16,y:10},crystal:{x:18,y:10},plates:[{x:5,y:3},{x:7,y:3}],objects:[{id:'sun',type:'metal',x:10,y:3},{id:'moon',type:'metal',x:11,y:8}],solids:exactRoom([
    ...Array.from({length:11},(_,i)=>[i+3,2]),...Array.from({length:11},(_,i)=>[i+3,4]),[3,3],
    ...Array.from({length:11},(_,i)=>i+1).filter(y=>y!==10).map(y=>[16,y])
  ]),logicSequence:true,enemy:true},
  65:{exact:true,start:{x:4,y:10},gate:{x:17,y:10},crystal:{x:19,y:10},plates:[{x:5,y:3},{x:7,y:3},{x:14,y:5}],objects:[{id:'sun',type:'metal',x:10,y:3},{id:'moon',type:'metal',x:14,y:7},{id:'tide',type:'metal',x:9,y:9}],solids:exactRoom([
    ...Array.from({length:11},(_,i)=>[i+3,2]),...Array.from({length:11},(_,i)=>[i+3,4]),[3,3],
    ...Array.from({length:5},(_,i)=>[13,i+4]),...Array.from({length:5},(_,i)=>[15,i+4]),
    ...Array.from({length:11},(_,i)=>i+1).filter(y=>y!==10).map(y=>[17,y])
  ]),logicSequence:true,advancedSequence:true,enemy:true,time:65},
  66:{exact:true,start:{x:16,y:10},gate:{x:17,y:10},crystal:{x:19,y:10},plates:[{x:8,y:9},{x:14,y:2},{x:14,y:4}],objects:[{id:'tide',type:'metal',x:14,y:9},{id:'sun',type:'metal',x:14,y:7},{id:'moon',type:'metal',x:8,y:10}],solids:exactRoom([
    [14,1],...Array.from({length:8},(_,i)=>[13,i+1]),...Array.from({length:8},(_,i)=>[15,i+1]),
    ...Array.from({length:11},(_,i)=>i+1).filter(y=>y!==10).map(y=>[17,y])
  ]),logicSequence:true,advancedSequence:true},
  67:{exact:true,start:{x:4,y:10},gate:{x:17,y:10},crystal:{x:19,y:10},plates:[{x:8,y:9},{x:5,y:3},{x:7,y:3},{x:14,y:5}],objects:[{id:'tide',type:'metal',x:14,y:9},{id:'sun',type:'metal',x:10,y:3},{id:'moon',type:'metal',x:14,y:7},{id:'gale',type:'metal',x:9,y:10}],solids:exactRoom([
    ...Array.from({length:11},(_,i)=>[i+3,2]),...Array.from({length:11},(_,i)=>[i+3,4]),[3,3],
    ...Array.from({length:5},(_,i)=>[13,i+4]),...Array.from({length:5},(_,i)=>[15,i+4]),
    ...Array.from({length:11},(_,i)=>i+1).filter(y=>y!==10).map(y=>[17,y])
  ]),logicSequence:true,advancedSequence:true,enemy:true,time:80,final:true}
};
const scalePoint=point=>({...point,x:point.x*SCALE,y:point.y*SCALE});
export const CONFIGS=Object.fromEntries(Object.entries(RAW_CONFIGS).map(([id,cfg])=>[id,cfg.exact?cfg:{...cfg,start:scalePoint(cfg.start),gate:scalePoint(cfg.gate),crystal:scalePoint(cfg.crystal),plates:cfg.plates.map(scalePoint),objects:cfg.objects.map(scalePoint)}]));

export const same=(a,b)=>a.x===b.x&&a.y===b.y;
export const active=(cfg,objects)=>cfg.plates.every(p=>objects.some(o=>same(p,o)));
export function kickResult(cfg,objects,id,direction){
 const rock=objects.find(o=>o.id===id);
 if(!rock)return {objects,changed:false};
 let landing=rock,probe={x:rock.x+direction.x,y:rock.y+direction.y};
 while(probe.x>0&&probe.x<W-1&&probe.y>0&&probe.y<H-1&&!cfg.solids.has(key(probe.x,probe.y))&&!objects.some(o=>same(o,probe))&&!same(probe,cfg.gate)){
  landing=probe;
  if(rock.type==='crate'||rock.type==='metal'||cfg.plates.some(p=>same(p,probe)))break;
  probe={x:probe.x+direction.x,y:probe.y+direction.y};
 }
 if(same(landing,rock))return {objects,changed:false};
 return {objects:objects.map(o=>o.id===id?{...o,...landing}:o),changed:true,landing};
}
