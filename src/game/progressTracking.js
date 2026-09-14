import {supabaseClient} from './supabaseAuth.js';

const PROGRESS_KEY='valle-esmeralda-logic-progress';
const METRICS_KEY='valle-esmeralda-player-metrics';

const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback));}catch{return fallback;}};
let activeSync=null;

export function syncProgressNow(){
  return activeSync?activeSync():Promise.resolve();
}

export function recordGameError(levelId){
  const current=read(METRICS_KEY,{totalErrors:0,byLevel:{}});
  const next={totalErrors:(current.totalErrors||0)+1,byLevel:{...(current.byLevel||{}),[levelId]:(current.byLevel?.[levelId]||0)+1}};
  localStorage.setItem(METRICS_KEY,JSON.stringify(next));
  window.dispatchEvent(new Event('valle-progress-changed'));
}

function localSummary(){
  const progress=read(PROGRESS_KEY,{}),metrics=read(METRICS_KEY,{totalErrors:0});
  const entries=Object.entries(progress).filter(([,item])=>item?.complete||item?.crystal);
  return {
    completed_levels:entries.map(([id])=>Number(id)).filter(Number.isFinite).sort((a,b)=>a-b),
    stars:Object.values(progress).reduce((sum,item)=>sum+Number(item?.stars||0),0),
    crystals:Object.values(progress).reduce((sum,item)=>sum+Number(item?.crystal||0),0),
    total_errors:Number(metrics.totalErrors||0)
  };
}

function restoreRemoteLevels(levels=[]){
  const progress=read(PROGRESS_KEY,{});let changed=false;
  for(const level of levels){const id=Number(level);if(!Number.isFinite(id)||progress[id]?.complete||progress[id]?.crystal)continue;progress[id]={...(progress[id]||{}),complete:true};changed=true;}
  if(changed){localStorage.setItem(PROGRESS_KEY,JSON.stringify(progress));window.dispatchEvent(new Event('valle-progress-changed'));}
}

export function startProgressTracking(userId){
  if(!supabaseClient||!userId)return()=>{};
  let stopped=false,sessionId=null,baseSeconds=0,baseErrors=0,remoteLevels=[],remoteStars=0,remoteCrystals=0;
  const startedAt=Date.now();
  const sync=async()=>{
    if(stopped)return;
    const elapsed=Math.max(0,Math.floor((Date.now()-startedAt)/1000)),summary=localSummary(),completedLevels=[...new Set([...remoteLevels,...summary.completed_levels])].sort((a,b)=>a-b);
    const payload={...summary,completed_levels:completedLevels,stars:Math.max(remoteStars,summary.stars),crystals:Math.max(remoteCrystals,summary.crystals),total_errors:baseErrors+summary.total_errors,play_seconds:baseSeconds+elapsed,updated_at:new Date().toISOString()};
    const result=await supabaseClient.from('student_progress').update(payload).eq('user_id',userId);
    if(!result.error){remoteLevels=completedLevels;remoteStars=payload.stars;remoteCrystals=payload.crystals;}
    if(sessionId)await supabaseClient.from('play_sessions').update({active_seconds:elapsed}).eq('id',sessionId);
  };
  const initialize=(async()=>{
    const {data}=await supabaseClient.from('student_progress').select('completed_levels,stars,crystals,play_seconds,total_errors').eq('user_id',userId).maybeSingle();
    remoteLevels=(data?.completed_levels||[]).map(Number).filter(Number.isFinite);remoteStars=Number(data?.stars||0);remoteCrystals=Number(data?.crystals||0);
    restoreRemoteLevels(remoteLevels);
    baseSeconds=Number(data?.play_seconds||0);baseErrors=Math.max(0,Number(data?.total_errors||0)-localSummary().total_errors);
    const result=await supabaseClient.from('play_sessions').insert({user_id:userId}).select('id').single();sessionId=result.data?.id||null;
    await sync();
  })();
  const flush=()=>initialize.then(()=>sync());activeSync=flush;
  const timer=setInterval(flush,10000),onProgress=()=>flush(),onVisibility=()=>{if(document.visibilityState==='hidden')flush();};
  window.addEventListener('valle-progress-changed',onProgress);document.addEventListener('visibilitychange',onVisibility);
  return()=>{sync();stopped=true;if(activeSync===flush)activeSync=null;clearInterval(timer);window.removeEventListener('valle-progress-changed',onProgress);document.removeEventListener('visibilitychange',onVisibility);if(sessionId)supabaseClient.from('play_sessions').update({active_seconds:Math.floor((Date.now()-startedAt)/1000),ended_at:new Date().toISOString()}).eq('id',sessionId);};
}

