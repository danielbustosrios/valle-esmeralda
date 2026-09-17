// Movement, ground shadow and collision share one invariant world axis.
// The artwork may mirror around it, but the physical body never shifts.
export function heroBodyX(hero){
  return hero.x;
}

export function shouldSpawnDodgeHeart(previousElapsed,elapsed,survivalSeconds=60){
  const spawnAt=Math.max(0,survivalSeconds-7);
  return previousElapsed<spawnAt&&elapsed>=spawnAt;
}

export function dodgeHeartHitsHero(heart,hero){
  return Boolean(heart)&&Math.abs(heart.x-heroBodyX(hero))<52&&(hero.jump||0)<125;
}

export const DODGE_HEART_POSITIONS=[220,600,980];

// Level 11 lasts one minute: a long introduction, the former 26-second
// challenge unchanged, and a short calm finish.
export function dodgeIntensity(elapsed){
  const seconds=Math.max(0,elapsed);
  if(seconds<30){
    const paceElapsed=seconds*8/30;
    return {phase:'INICIO',difficulty:paceElapsed/26,finale:0,paceElapsed,spawnFactor:.73};
  }
  if(seconds<56){
    const paceElapsed=seconds-30;
    return {phase:paceElapsed<12?'SUAVE':paceElapsed<24?'RÁPIDO':'AVALANCHA',difficulty:Math.min(1,paceElapsed/26),finale:Math.max(0,Math.min(1,(paceElapsed-16)/10)),paceElapsed,spawnFactor:.62};
  }
  return {phase:'CALMA',difficulty:.08,finale:0,paceElapsed:2,spawnFactor:1};
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
