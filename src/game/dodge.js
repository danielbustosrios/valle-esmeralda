// Movement, ground shadow and collision share one invariant world axis.
// The artwork may mirror around it, but the physical body never shifts.
export function heroBodyX(hero){
  return hero.x;
}

// Level 11 lasts one minute: a long introduction, the former 26-second
// challenge unchanged, and a short calm finish.
export function dodgeIntensity(elapsed){
  const seconds=Math.max(0,elapsed);
  if(seconds<30){
    const paceElapsed=seconds*8/30;
    return {phase:'INICIO',difficulty:paceElapsed/26,finale:0,paceElapsed};
  }
  if(seconds<56){
    const paceElapsed=seconds-30;
    return {phase:paceElapsed<12?'SUAVE':paceElapsed<24?'RÁPIDO':'AVALANCHA',difficulty:Math.min(1,paceElapsed/26),finale:Math.max(0,Math.min(1,(paceElapsed-16)/10)),paceElapsed};
  }
  return {phase:'CALMA',difficulty:.08,finale:0,paceElapsed:2};
}

// A rounded body capsule follows the visible head and torso, excluding cape,
// tail, transparent padding and the corners of each rock's bounding box.
export function rockHitsHero(rock,hero){
  const bodyX=heroBodyX(hero);
  const bodyTop=445-(hero.jump||0),bodyBottom=552-(hero.jump||0);
  const closestY=Math.max(bodyTop,Math.min(bodyBottom,rock.y));
  const collisionRadius=rock.r*.82+25;
  return Math.hypot(rock.x-bodyX,rock.y-closestY)<=collisionRadius;
}

