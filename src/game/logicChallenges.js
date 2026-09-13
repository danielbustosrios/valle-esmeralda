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
    {prompt:'4 · 7 · 11 · 18 · 29 · ?',answers:[45,47,49],correct:47,hint:'Cada término nace de sumar los dos anteriores.'},
    {prompt:'2 · 5 · 10 · 17 · 26 · ?',answers:[35,37,39],correct:37,hint:'Las diferencias avanzan con impares consecutivos.'},
    {prompt:'162 · 54 · 59 · 19⅔ · 24⅔ · ?',answers:['8⅒','8⅔','9⅔'],correct:'8⅔',hint:'Alterna dividir entre 3 y sumar 5.'},
    {prompt:'3 · 2 · 6 · 6 · 9 · 18 · 12 · ?',answers:[36,48,54],correct:54,hint:'Hay dos secuencias intercaladas: múltiplos de 3 y valores que se triplican.'}
  ],
  17:[
    {prompt:'2 · 3 · 7 · 22 · 89 · ?',answers:[445,446,450],correct:446,hint:'Multiplica por 1, 2, 3, 4… y suma 1.'},
    {prompt:'2 · 6 · 24 · 120 · ?',answers:[600,720,840],correct:720,hint:'Multiplica sucesivamente por 3, 4, 5 y 6.'},
    {prompt:'4 · 5 · 9 · 18 · 34 · ?',answers:[55,57,59],correct:59,hint:'Las diferencias son cuadrados: 1, 4, 9, 16…'},
    {prompt:'3 · 9 · 7 · 21 · 19 · 57 · ?',answers:[53,55,59],correct:55,hint:'Alterna multiplicar por 3 y restar 2.'}
  ]
};

export const getLogicChallenges=id=>LOGIC_CHALLENGES[id]||[];
