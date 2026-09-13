export const AUTH_SESSION_KEY='valle-esmeralda-preview-session';

const parse=value=>{try{return value?JSON.parse(value):null;}catch{return null;}};

export const readAuthSession=()=>{
  if(typeof localStorage==='undefined')return null;
  return parse(localStorage.getItem(AUTH_SESSION_KEY))||parse(sessionStorage.getItem(AUTH_SESSION_KEY));
};

export const startPreviewSession=({name,email},remember=false)=>{
  const session={name:name?.trim()||email.split('@')[0],email:email.trim().toLowerCase(),preview:true};
  localStorage.removeItem(AUTH_SESSION_KEY);
  sessionStorage.removeItem(AUTH_SESSION_KEY);
  (remember?localStorage:sessionStorage).setItem(AUTH_SESSION_KEY,JSON.stringify(session));
  return session;
};

export const clearAuthSession=()=>{
  localStorage.removeItem(AUTH_SESSION_KEY);
  sessionStorage.removeItem(AUTH_SESSION_KEY);
};
