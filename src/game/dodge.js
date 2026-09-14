// The character artwork is asymmetric inside its 156px canvas. When it is
// mirrored, the visible feet/body centre moves to the opposite side too.
export function heroBodyX(hero){
  return hero.x+(hero.facing||1)*18;
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

