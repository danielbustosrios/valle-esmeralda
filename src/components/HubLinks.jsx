import React from 'react';
import {signOut} from '../game/supabaseAuth.js';

export default function HubLinks(){
  return <nav className="hub-links" aria-label="Navegación principal"><a href="?view=map">MAPA</a><a href="?view=shop">TIENDA</a><button aria-label="Cerrar sesión" onClick={async()=>{await signOut();location.href='?';}}>SALIR</button></nav>;
}

