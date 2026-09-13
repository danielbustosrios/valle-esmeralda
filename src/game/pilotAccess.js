export const PILOT_ACCESS_KEY='valle-esmeralda-pilot-access';
export const LOGIC_FAILURES_KEY='valle-esmeralda-logic-failures';
export const PILOT_CODE=String(import.meta.env?.VITE_PILOT_CODE||'1026');

const storage=()=>typeof localStorage==='undefined'?null:localStorage;

export const hasPilotAccess=()=>storage()?.getItem(PILOT_ACCESS_KEY)==='granted';
export const verifyPilotCode=value=>/^\d{4}$/.test(String(value))&&String(value)===PILOT_CODE;
export const grantPilotAccess=()=>storage()?.setItem(PILOT_ACCESS_KEY,'granted');

export const logicFailureCount=()=>Math.max(0,Number(storage()?.getItem(LOGIC_FAILURES_KEY)||0)||0);
export const recordLogicFailure=()=>{const next=logicFailureCount()+1;storage()?.setItem(LOGIC_FAILURES_KEY,String(next));return next;};
export const clearLogicFailures=()=>storage()?.removeItem(LOGIC_FAILURES_KEY);
export const requiresLogicRecovery=()=>logicFailureCount()>=2;

export const completionPercent=(progress,total=68)=>{
  const completed=Object.values(progress||{}).filter(item=>item?.complete||item?.crystal).length;
  return Math.min(100,Math.round(completed/total*100));
};

export const starterWorldsComplete=()=>{
  let progress={};
  try{progress=JSON.parse(storage()?.getItem('valle-esmeralda-logic-progress')||'{}');}catch{}
  return [11,17,21,26].every(id=>progress[id]?.complete||progress[id]?.crystal);
};
