import React from 'react';

// Light moving over the painted water; the original illustration stays intact.
const falls=[
 {id:'distant',path:'M525 177L551 177L549 225L537 278L524 277L531 220Z',x:526,y:178,width:23,height:100},
 {id:'right',path:'M771 251L793 251L785 304L774 345L763 340L775 287Z',x:766,y:251,width:23,height:94},
 {id:'main',path:'M565 483L616 485L610 518L606 571L620 616L563 618L578 567L577 521Z',x:568,y:484,width:46,height:135},
 {id:'lower',path:'M558 660L598 653L604 708L593 745L561 741L573 704Z',x:562,y:654,width:37,height:90},
];
export default function Water({paused}){
 return <g className={`water-motion${paused?' water-paused':''}`} aria-hidden="true" pointerEvents="none">
  <defs>{falls.map(f=><clipPath id={`water-${f.id}`} key={f.id}><path d={f.path}/></clipPath>)}<filter id="water-soft"><feGaussianBlur stdDeviation="1.1"/></filter></defs>
  {falls.map((f,j)=><g key={f.id} clipPath={`url(#water-${f.id})`}>
   {Array.from({length:9},(_,i)=><path key={i} className="water-stream" d={`M${f.x+i*f.width/9} ${f.y-70}q-3 45 0 90t0 ${f.height+100}`} fill="none" stroke={i%2?'#c4f6ff':'#ffffff'} strokeWidth={i%3?1.8:3.5} strokeDasharray={`${12+i%4*7} ${34+i%3*8}`} filter="url(#water-soft)" style={{'--flow-period':46+i%4*7+i%3*8,animationDuration:`${1.2+i*.13+j*.15}s`,animationDelay:`-${i*.23}s`}}/>)}
  </g>)}
  <g className="water-mist" fill="#e4fbff" filter="url(#water-soft)"><ellipse cx="591" cy="615" rx="22" ry="4"/><ellipse cx="579" cy="741" rx="13" ry="3"/></g>
 </g>;
}

