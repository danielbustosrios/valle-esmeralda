const PLAY_AREAS='.game,.bomber-stage,.island-stage,.pyth-game,.world-map-screen';
const INTERACTIVE='button,a,input,select,textarea,label';

const emitKey=(type,key)=>window.dispatchEvent(new KeyboardEvent(type,{key,bubbles:true}));

export function installTouchNavigation(){
 let gesture=null,activeKey=null;
 const stop=()=>{if(activeKey)emitKey('keyup',activeKey);activeKey=null;gesture=null;};
 const start=event=>{
  if(event.touches.length!==1){stop();return;}
  if(event.target.closest?.(INTERACTIVE)||!event.target.closest?.(PLAY_AREAS))return;
  const touch=event.touches[0];gesture={id:touch.identifier,x:touch.clientX,y:touch.clientY};
 };
 const move=event=>{
  if(event.touches.length!==1){stop();return;}
  if(!gesture)return;
  const touch=[...event.touches].find(item=>item.identifier===gesture.id);if(!touch)return;
  const dx=touch.clientX-gesture.x,dy=touch.clientY-gesture.y;if(Math.hypot(dx,dy)<24)return;
  event.preventDefault();
  const key=Math.abs(dx)>Math.abs(dy)?(dx<0?'ArrowLeft':'ArrowRight'):(dy<0?'ArrowUp':'ArrowDown');
  if(key===activeKey)return;
  if(activeKey)emitKey('keyup',activeKey);
  activeKey=key;emitKey('keydown',key);
 };
 addEventListener('touchstart',start,{passive:true});
 addEventListener('touchmove',move,{passive:false});
 addEventListener('touchend',stop,{passive:true});
 addEventListener('touchcancel',stop,{passive:true});
 return()=>{removeEventListener('touchstart',start);removeEventListener('touchmove',move);removeEventListener('touchend',stop);removeEventListener('touchcancel',stop);};
}

