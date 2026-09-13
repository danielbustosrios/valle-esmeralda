import {supabaseClient} from './supabaseAuth.js';

const PROGRESS_KEY='valle-esmeralda-logic-progress';
const METRICS_KEY='valle-esmeralda-player-metrics';

const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback));}catch{return fallback;}};

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

export function startProgressTracking(userId){
  if(!supabaseClient||!userId)return()=>{};
  let stopped=false,sessionId=null,baseSeconds=0,baseErrors=0;
  const startedAt=Date.now();
  const sync=async()=>{
    if(stopped)return;
    const elapsed=Math.max(0,Math.floor((Date.now()-startedAt)/1000)),summary=localSummary();
    await supabaseClient.from('student_progress').update({...summary,total_errors:baseErrors+summary.total_errors,play_seconds:baseSeconds+elapsed,updated_at:new Date().toISOString()}).eq('user_id',userId);
    if(sessionId)await supabaseClient.from('play_sessions').update({active_seconds:elapsed}).eq('id',sessionId);
  };
  (async()=>{
    const {data}=await supabaseClient.from('student_progress').select('play_seconds,total_errors').eq('user_id',userId).maybeSingle();
    baseSeconds=Number(data?.play_seconds||0);baseErrors=Math.max(0,Number(data?.total_errors||0)-localSummary().total_errors);
    const result=await supabaseClient.from('play_sessions').insert({user_id:userId}).select('id').single();sessionId=result.data?.id||null;
    await sync();
  })();
  const timer=setInterval(sync,10000),onProgress=()=>sync(),onVisibility=()=>{if(document.visibilityState==='hidden')sync();};
  window.addEventListener('valle-progress-changed',onProgress);document.addEventListener('visibilitychange',onVisibility);
  return()=>{stopped=true;clearInterval(timer);window.removeEventListener('valle-progress-changed',onProgress);document.removeEventListener('visibilitychange',onVisibility);if(sessionId)supabaseClient.from('play_sessions').update({active_seconds:Math.floor((Date.now()-startedAt)/1000),ended_at:new Date().toISOString()}).eq('id',sessionId);};
}

