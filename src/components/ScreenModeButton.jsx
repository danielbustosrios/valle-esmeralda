import React,{useEffect,useState} from 'react';

export async function enterGameScreen(){
 try{if(!document.fullscreenElement)await document.documentElement.requestFullscreen?.();}catch{}
 try{await screen.orientation?.lock?.('landscape');}catch{}
}

export default function ScreenModeButton(){
 const [active,setActive]=useState(Boolean(document.fullscreenElement));
 useEffect(()=>{const update=()=>setActive(Boolean(document.fullscreenElement));document.addEventListener('fullscreenchange',update);return()=>document.removeEventListener('fullscreenchange',update);},[]);
 const toggle=async()=>{if(document.fullscreenElement){try{await document.exitFullscreen?.();}catch{}}else await enterGameScreen();};
 return <button className="screen-mode-button" type="button" onClick={toggle} aria-label={active?'Salir de pantalla completa':'Jugar en pantalla completa horizontal'} title="Pantalla completa horizontal">{active?'↙':'⛶'} <span>{active?'SALIR':'PANTALLA'}</span></button>;
}

