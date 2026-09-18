export const PROGRESS_OWNER_KEY='valle-esmeralda-progress-owner';

export const USER_LOCAL_KEYS=[
  'valle-esmeralda-logic-progress',
  'valle-esmeralda-player-metrics',
  'valle-esmeralda-shop',
  'valle-esmeralda-map-position',
  'valle-esmeralda-four-worlds-celebrated',
  'valle-esmeralda-seen-worlds',
  'valle-esmeralda-shop-dialogue-done',
  'valle-esmeralda-pilot-access',
  'valle-esmeralda-logic-failures'
];

export const USER_SESSION_KEYS=['valle-esmeralda-map-session-started'];

export function claimProgressOwner(userId,persistent=globalThis.localStorage,session=globalThis.sessionStorage){
  if(!userId||!persistent)return false;
  const previous=persistent.getItem(PROGRESS_OWNER_KEY);
  if(previous===userId)return false;
  USER_LOCAL_KEYS.forEach(key=>persistent.removeItem(key));
  USER_SESSION_KEYS.forEach(key=>session?.removeItem(key));
  persistent.setItem(PROGRESS_OWNER_KEY,userId);
  return true;
}

export function progressFromRemote({completed_levels=[],stars=0,crystals=0,total_errors=0}={}){
  const ids=[...new Set(completed_levels.map(Number).filter(Number.isFinite))].sort((a,b)=>a-b);
  let starsLeft=Math.max(0,Number(stars)||0),crystalsLeft=Math.max(0,Number(crystals)||0);
  const progress={};
  for(const id of ids){
    const levelStars=Math.min(3,starsLeft),crystal=crystalsLeft>0?1:0;
    progress[id]={complete:true,stars:levelStars,crystal};
    starsLeft-=levelStars;crystalsLeft-=crystal;
  }
  return {progress,metrics:{totalErrors:Math.max(0,Number(total_errors)||0),byLevel:{}}};
}
