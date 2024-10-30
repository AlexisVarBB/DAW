import {randomSuperhero} from 'superheroes';
import { randomSupervillain } from 'supervillains';
import sw from 'star-wars-quotes';
console.log("Hello world");


console.log(sw());


var superName = randomSuperhero();
var supervillainName = randomSupervillain();
console.log(supervillainName+" is threatening the city, only "+ superName+" can save us ");

import { readFile } from 'fs';
const filePath = 'data/input.txt';
readFile(filePath, 'utf8', (err, data) => {
    console.log("Contenido del archivo:", data);
});



