export const LOGIC_CHALLENGES={
  12:[
    {prompt:'2 · 5 · 8 · ?',answers:[10,11,12],correct:11,hint:'El salto entre términos siempre es igual.'},
    {prompt:'20 · 17 · 14 · ?',answers:[10,11,12],correct:11,hint:'La secuencia retrocede con pasos iguales.'},
    {prompt:'3 · 6 · 11 · 18 · ?',answers:[25,27,29],correct:27,hint:'Las diferencias son 3, 5 y 7.'},
    {prompt:'2 · 4 · 8 · 14 · ?',answers:[20,22,24],correct:22,hint:'Los saltos crecen: 2, 4, 6…'}
  ],
  13:[
    {prompt:'2 → 6  |  4 → 10  |  7 → ?',answers:[14,16,18],correct:16,hint:'Multiplica por 2 y luego suma 2.'},
    {prompt:'3 → 8  |  5 → 14  |  8 → ?',answers:[21,23,25],correct:23,hint:'La misma regla transforma cada entrada.'},
    {prompt:'1 → 4  |  2 → 7  |  4 → ?',answers:[11,13,15],correct:13,hint:'Multiplica por 3 y suma 1.'},
    {prompt:'2 → 5  |  3 → 10  |  5 → ?',answers:[24,25,26],correct:26,hint:'Piensa en el cuadrado y una unidad más.'}
  ],
  14:[
    {prompt:'◆ + ◆ = 14  |  ◆ + ● = 11  |  ● = ?',answers:[3,4,5],correct:4,hint:'Primero descubre cuánto vale el diamante.'},
    {prompt:'▲ × 3 = 18  |  ■ + ■ = 8  |  ▲ + ■ = ?',answers:[9,10,11],correct:10,hint:'Resuelve cada símbolo por separado.'},
    {prompt:'● + ● + ● = 15  |  ● × ◆ = 20  |  ◆ = ?',answers:[3,4,5],correct:4,hint:'Tres círculos iguales suman 15.'},
    {prompt:'▲ + ◆ = 13  |  ▲ − ◆ = 5  |  ▲ = ?',answers:[8,9,10],correct:9,hint:'Busca dos números cuya suma sea 13.'}
  ],
  15:[
    {prompt:'3 · 8 · 15 · 24 · ?',answers:[33,35,37],correct:35,hint:'Las diferencias son 5, 7, 9 y después 11.'},
    {prompt:'2 · 5 · 11 · 23 · ?',answers:[45,47,49],correct:47,hint:'Duplica el término anterior y suma una unidad.'},
    {prompt:'144 · 72 · 76 · 38 · 42 · ?',answers:[19,21,23],correct:21,hint:'Alterna dividir entre 2 y sumar 4.'},
    {prompt:'2 · 9 · 4 · 16 · 6 · 25 · ?',answers:[8,32,36],correct:8,hint:'Hay dos secuencias intercaladas: pares y cuadrados.'}
  ],
  16:[
    {prompt:'4 · 7 · 10 · 13 · ?',answers:[15,16,17],correct:16,hint:'Suma 3 en cada paso.'},
    {prompt:'5 · 10 · 15 · 20 · ?',answers:[23,24,25],correct:25,hint:'Suma 5 en cada paso.'},
    {prompt:'1 · 4 · 9 · 16 · ?',answers:[20,25,36],correct:25,hint:'Son los cuadrados: 1², 2², 3², 4²…'},
    {prompt:'2 · 6 · 10 · 14 · ?',answers:[16,18,20],correct:18,hint:'Suma 4 en cada paso.'}
  ],
  17:[
    {prompt:'3 · 7 · 11 · 15 · ?',answers:[18,19,20],correct:19,hint:'Suma 4 en cada paso.'},
    {prompt:'2 · 3 · 5 · 8 · 12 · ?',answers:[16,17,18],correct:17,hint:'Suma 1, luego 2, luego 3, luego 4…'},
    {prompt:'4 · 9 · 16 · 25 · ?',answers:[30,32,36],correct:36,hint:'Son cuadrados consecutivos: 2², 3², 4², 5²…'},
    {prompt:'10 · 18 · 26 · 34 · ?',answers:[40,42,44],correct:42,hint:'Suma 8 en cada paso.'}
  ]
};

export const getLogicChallenges=id=>LOGIC_CHALLENGES[id]||[];
