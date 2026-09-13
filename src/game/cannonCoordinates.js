export const CANNON_COORDINATES=[
  {prompt:'Cristal detectado en (2, 2)',target:{x:2,y:2},hint:'Avanza 2 en x y sube 2 en y.'},
  {prompt:'Cristal detectado en (−2, 1)',target:{x:-2,y:1},hint:'Retrocede 2 en x y sube 1 en y.'},
  {prompt:'x es el doble de 2; y es el opuesto de 2',target:{x:4,y:-2},hint:'El doble de 2 es 4 y el opuesto de 2 es −2.'},
  {prompt:'x es la mitad de −6; y es el opuesto de −2',target:{x:-3,y:2},hint:'La mitad de −6 es −3 y el opuesto de −2 es 2.'}
];

export const FUNCTION_CANNON_CHALLENGES=[
  {formula:'f(x) = x + 1',input:1,evaluate:x=>x+1,target:{x:1,y:2},hint:'Sustituye x por 1: f(1) = 1 + 1 = 2. El punto es (1, 2).'},
  {formula:'f(x) = 2x − 1',input:2,evaluate:x=>2*x-1,target:{x:2,y:3},hint:'Sustituye x por 2: f(2) = 2 · 2 − 1 = 3. El punto es (2, 3).'},
  {formula:'f(x) = −x + 1',input:-2,evaluate:x=>-x+1,target:{x:-2,y:3},hint:'El opuesto de −2 es 2: f(−2) = 2 + 1 = 3. El punto es (−2, 3).'},
  {formula:'f(x) = x ÷ 2 − 1',input:-4,evaluate:x=>x/2-1,target:{x:-4,y:-3},hint:'La mitad de −4 es −2: f(−4) = −2 − 1 = −3. El punto es (−4, −3).'}
];

export const FUNCTION_GRAPH_CHALLENGES=[
  {formula:'f(x) = x + 1',input:-3,evaluate:x=>x+1,target:{x:-3,y:-2},hint:'f(−3) = −3 + 1 = −2. El punto es (−3, −2).'},
  {formula:'f(x) = x + 1',input:1,evaluate:x=>x+1,target:{x:1,y:2},hint:'f(1) = 1 + 1 = 2. El punto es (1, 2).'},
  {formula:'f(x) = x + 1',input:-1,evaluate:x=>x+1,target:{x:-1,y:0},hint:'f(−1) = −1 + 1 = 0. El punto es (−1, 0).'},
  {formula:'f(x) = x + 1',input:2,evaluate:x=>x+1,target:{x:2,y:3},hint:'f(2) = 2 + 1 = 3. El punto es (2, 3).'}
];

// Five short campaigns: one line per level, with a new slope or intercept each time.
export const LINEAR_LEVEL_CHALLENGES=[
  [
    {formula:'f(x) = x + 1',input:-3,target:{x:-3,y:-2},hint:'Suma 1 a la entrada: f(−3) = −2.'},
    {formula:'f(x) = x + 1',input:-1,target:{x:-1,y:0},hint:'Suma 1 a la entrada: f(−1) = 0.'},
    {formula:'f(x) = x + 1',input:1,target:{x:1,y:2},hint:'Suma 1 a la entrada: f(1) = 2.'},
    {formula:'f(x) = x + 1',input:2,target:{x:2,y:3},hint:'Suma 1 a la entrada: f(2) = 3.'}
  ],
  [
    {formula:'f(x) = 2x − 1',input:-1,target:{x:-1,y:-3},hint:'Duplica −1 y resta 1: f(−1) = −3.'},
    {formula:'f(x) = 2x − 1',input:0,target:{x:0,y:-1},hint:'Con x = 0 queda f(0) = −1.'},
    {formula:'f(x) = 2x − 1',input:1,target:{x:1,y:1},hint:'Duplica 1 y resta 1: f(1) = 1.'},
    {formula:'f(x) = 2x − 1',input:2,target:{x:2,y:3},hint:'Duplica 2 y resta 1: f(2) = 3.'}
  ],
  [
    {formula:'f(x) = −x + 1',input:-2,target:{x:-2,y:3},hint:'Cambia el signo de −2 y suma 1: f(−2) = 3.'},
    {formula:'f(x) = −x + 1',input:-1,target:{x:-1,y:2},hint:'Cambia el signo de −1 y suma 1: f(−1) = 2.'},
    {formula:'f(x) = −x + 1',input:1,target:{x:1,y:0},hint:'Cambia el signo de 1 y suma 1: f(1) = 0.'},
    {formula:'f(x) = −x + 1',input:4,target:{x:4,y:-3},hint:'Cambia el signo de 4 y suma 1: f(4) = −3.'}
  ],
  [
    {formula:'f(x) = x ÷ 2 − 1',input:-4,target:{x:-4,y:-3},hint:'La mitad de −4 es −2; luego resta 1.'},
    {formula:'f(x) = x ÷ 2 − 1',input:-2,target:{x:-2,y:-2},hint:'La mitad de −2 es −1; luego resta 1.'},
    {formula:'f(x) = x ÷ 2 − 1',input:2,target:{x:2,y:0},hint:'La mitad de 2 es 1; luego resta 1.'},
    {formula:'f(x) = x ÷ 2 − 1',input:4,target:{x:4,y:1},hint:'La mitad de 4 es 2; luego resta 1.'}
  ],
  [
    {formula:'f(x) = −2x + 3',input:0,target:{x:0,y:3},hint:'Con x = 0 queda f(0) = 3.'},
    {formula:'f(x) = −2x + 3',input:1,target:{x:1,y:1},hint:'−2 por 1 más 3 es 1.'},
    {formula:'f(x) = −2x + 3',input:2,target:{x:2,y:-1},hint:'−2 por 2 más 3 es −1.'},
    {formula:'f(x) = −2x + 3',input:3,target:{x:3,y:-3},hint:'−2 por 3 más 3 es −3.'}
  ]
];

export const cannonFlight=(start,end,t)=>({x:start.x+(end.x-start.x)*t,y:start.y+(end.y-start.y)*t-Math.sin(Math.PI*t)*105});

