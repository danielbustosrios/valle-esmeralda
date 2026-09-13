const url=import.meta.env.VITE_SUPABASE_URL;
const publicKey=import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseReady=Boolean(url&&publicKey&&globalThis.supabase?.createClient);
export const supabaseClient=isSupabaseReady?globalThis.supabase.createClient(url,publicKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,storageKey:'valle-esmeralda-auth'}}):null;

const explain=message=>{
  const text=(message||'').toLowerCase();
  if(text.includes('invalid login credentials'))return 'El correo o la contraseña no son correctos.';
  if(text.includes('email not confirmed'))return 'Primero confirma tu correo desde el mensaje que recibiste.';
  if(text.includes('user already registered'))return 'Ya existe una cuenta con ese correo.';
  if(text.includes('password should be'))return 'La contraseña debe tener al menos 6 caracteres.';
  if(text.includes('rate limit'))return 'Se hicieron demasiados intentos. Espera un momento y vuelve a probar.';
  return message||'No fue posible completar la solicitud. Inténtalo de nuevo.';
};

const ensureClient=()=>{if(!supabaseClient)throw new Error('La conexión de usuarios aún no está configurada.');return supabaseClient;};

export async function registerStudent({firstName,lastName,course,email,password}){
  const client=ensureClient();
  const emailRedirectTo=`${location.origin}${location.pathname}`;
  const {data,error}=await client.auth.signUp({email:email.trim().toLowerCase(),password,options:{emailRedirectTo,data:{first_name:firstName.trim(),last_name:lastName.trim(),course}}});
  if(error)throw new Error(explain(error.message));
  return {session:data.session,user:data.user,appUser:await sessionToAppUser(data.session),needsConfirmation:!data.session};
}

export async function loginStudent({email,password}){
  const client=ensureClient();
  const {data,error}=await client.auth.signInWithPassword({email:email.trim().toLowerCase(),password});
  if(error)throw new Error(explain(error.message));
  return sessionToAppUser(data.session);
}

export async function sendRecovery(email){
  const client=ensureClient();
  const redirectTo=`${location.origin}${location.pathname}`;
  const {error}=await client.auth.resetPasswordForEmail(email.trim().toLowerCase(),{redirectTo});
  if(error)throw new Error(explain(error.message));
}

export async function updatePassword(password){
  const client=ensureClient();
  const {error}=await client.auth.updateUser({password});
  if(error)throw new Error(explain(error.message));
}

export async function signOut(){
  if(supabaseClient)await supabaseClient.auth.signOut();
}

export async function sessionToAppUser(session){
  if(!session?.user)return null;
  const metadata=session.user.user_metadata||{};
  let profile=null;
  if(supabaseClient){
    const {data}=await supabaseClient.from('profiles').select('first_name,last_name,course').eq('id',session.user.id).maybeSingle();
    profile=data;
  }
  const firstName=profile?.first_name||metadata.first_name||'';
  const lastName=profile?.last_name||metadata.last_name||'';
  return {id:session.user.id,email:session.user.email,firstName,lastName,course:profile?.course||metadata.course||'',name:[firstName,lastName].filter(Boolean).join(' ')||session.user.email?.split('@')[0],preview:false};
}

export async function currentAppUser(){
  if(!supabaseClient)return null;
  const {data}=await supabaseClient.auth.getSession();
  return sessionToAppUser(data.session);
}

export function onAuthChange(callback){
  if(!supabaseClient)return ()=>{};
  const {data}=supabaseClient.auth.onAuthStateChange((event,session)=>callback(event,session));
  return ()=>data.subscription.unsubscribe();
}

