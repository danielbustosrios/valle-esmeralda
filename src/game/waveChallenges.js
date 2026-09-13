export const WAVE_LEVELS={
  47:{rounds:[{a:50,b:1,p:0,f:'sin'},{a:90,b:1,p:0,f:'sin'},{a:130,b:1,p:0,f:'sin'}]},
  48:{rounds:[{a:90,b:1,p:0,f:'sin'},{a:90,b:2,p:0,f:'sin'},{a:90,b:3,p:0,f:'sin'}]},
  49:{rounds:[{a:90,b:2,p:1,f:'sin'},{a:90,b:2,p:2,f:'sin'},{a:90,b:2,p:3,f:'sin'}]},
  50:{rounds:[{a:90,b:1,p:0,f:'cos'},{a:130,b:2,p:1,f:'cos'},{a:50,b:3,p:2,f:'sin'}]},
  51:{rounds:[{a:130,b:3,p:1,f:'sin'},{a:90,b:3,p:3,f:'cos'},{a:50,b:2,p:2,f:'cos'}],time:45}
};

export const waveY=(x,{a,b,p,f})=>400-a*(f==='cos'?Math.cos(b*Math.PI*2*x/1000+p*Math.PI/2):Math.sin(b*Math.PI*2*x/1000+p*Math.PI/2));
export const wavePath=settings=>Array.from({length:101},(_,i)=>`${i?'L':'M'}${110+i*10},${waveY(i*10,settings)}`).join(' ');
export const matchesWave=(choice,target)=>choice.a===target.a&&choice.b===target.b&&choice.p===target.p&&choice.f===target.f;
