import React from 'react';
import {signOut} from '../game/supabaseAuth.js';
import ScreenModeButton from './ScreenModeButton.jsx';

export default function HubLinks({guest=false}){
  return <nav className="hub-links" aria-label="Navegación principal"><a href="?view=map">MAPA</a><ScreenModeButton/>{!guest&&<button className="sign-out-button" aria-label="Salir del juego y cerrar sesión" onClick={async()=>{await signOut();location.href='?';}}>SALIR</button>}</nav>;
}

