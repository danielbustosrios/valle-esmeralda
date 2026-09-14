// A rounded body capsule follows the visible head and torso, excluding cape,
// tail, transparent padding and the corners of each rock's bounding box.
export function rockHitsHero(rock,hero){
  // Flipping the sprite must not move its collision body away from the
  // ground shadow. Both the visible body and its shadow remain centred on x.
  const bodyX=hero.x;
  const bodyTop=445-(hero.jump||0),bodyBottom=552-(hero.jump||0);
  const closestY=Math.max(bodyTop,Math.min(bodyBottom,rock.y));
  const collisionRadius=rock.r*.82+25;
  return Math.hypot(rock.x-bodyX,rock.y-closestY)<=collisionRadius;
}

