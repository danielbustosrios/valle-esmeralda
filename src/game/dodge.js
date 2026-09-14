// Movement, ground shadow and collision share one invariant world axis.
// The artwork may mirror around it, but the physical body never shifts.
export function heroBodyX(hero){
  return hero.x;
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

