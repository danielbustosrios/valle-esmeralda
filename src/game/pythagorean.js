export const KICK_DISTANCE=72;
export const canKickStone=(heroX,stoneX,facing,targetDirection=1)=>Math.abs(heroX-stoneX)<=KICK_DISTANCE&&facing===targetDirection&&(targetDirection>0?heroX<=stoneX+8:heroX>=stoneX-8);
export const enemyTouchesHero=(heroX,bossX,radius=145)=>Math.abs(heroX-bossX)<radius;
export const groundRockHits=(heroX,jump,rockX,radius=24)=>jump<72&&Math.abs(heroX-rockX)<radius+25;
