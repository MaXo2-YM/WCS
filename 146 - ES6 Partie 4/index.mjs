import {Monster} from './Monster';
import {MonsterMini}  from './MonsterMini';

let optionMonster = new Object({name: 'Jean-Luc'});
let optionMonsterMini = new Object({name: 'Edouard'});

let monsterJeanLuc = new Monster(optionMonster);
let monsterEdouard = new MonsterMini(optionMonsterMini);

console.log("Monstre : " + monsterJeanLuc.name);
console.log("Santé : " + monsterJeanLuc.health);
monsterJeanLuc.heal();
console.log("*HEAL*");
console.log("Santé : " + monsterJeanLuc.health);
console.log("*****");
console.log("Monstre : " + monsterEdouard.name);
console.log("Santé : " + monsterEdouard.health);
monsterEdouard.heal();
console.log("*HEAL*");
console.log("Santé : " + monsterEdouard.health);

//Attention à l'utilisation avec node V8 : "node --experimental-modules index.mjs"
