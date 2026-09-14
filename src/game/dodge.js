// The midpoint between the boots is 8px from the SVG pivot. Mirroring the
// artwork mirrors that support point, so shadow and collision do the same.
export function heroBodyX(hero){
  return hero.x+(hero.facing||1)*8;
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

