// The movement coordinate is left of the visible support point in this asset.
// The two poses need slightly different offsets because the feet and cape are
// asymmetric inside the source artwork.
export function heroBodyX(hero){
  return hero.x+((hero.facing||1)<0?8:18);
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

