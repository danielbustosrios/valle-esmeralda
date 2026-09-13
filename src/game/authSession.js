export const AUTH_SESSION_KEY='valle-esmeralda-preview-session';
export const STUDENT_COURSES=['11.1','11.2','11.3','10.1','10.2','10.3','10.4'];

const parse=value=>{try{return value?JSON.parse(value):null;}catch{return null;}};

export const readAuthSession=()=>{
  if(typeof localStorage==='undefined')return null;
  return parse(localStorage.getItem(AUTH_SESSION_KEY))||parse(sessionStorage.getItem(AUTH_SESSION_KEY));
};

export const startPreviewSession=({name,firstName,lastName,course,email},remember=false)=>{
  const givenName=(firstName||name||'').trim();
  const surname=(lastName||'').trim();
  const session={name:[givenName,surname].filter(Boolean).join(' ')||email.split('@')[0],email:email.trim().toLowerCase(),...(firstName&&{firstName:givenName}),...(surname&&{lastName:surname}),...(course&&{course}),preview:true};
  localStorage.removeItem(AUTH_SESSION_KEY);
  sessionStorage.removeItem(AUTH_SESSION_KEY);
  (remember?localStorage:sessionStorage).setItem(AUTH_SESSION_KEY,JSON.stringify(session));
  return session;
};

export const clearAuthSession=()=>{
  localStorage.removeItem(AUTH_SESSION_KEY);
  sessionStorage.removeItem(AUTH_SESSION_KEY);
};

