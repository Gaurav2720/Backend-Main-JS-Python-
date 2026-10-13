// ============================================================
// Part A: ES6 (ECMAScript 2015) Features
// ============================================================

// 3.1 let and const
var x = 10;
var x = 20; // allowed (function-scoped)
console.log('--- let and const ---');
console.log('var x =', x);

let y = 10;
// let y = 20; // Error: cannot redeclare in same scope
console.log('let y =', y);

const z = 30;
// z = 40; // Error: cannot reassign
console.log('const z =', z);

if (true) {
    let blockVar = 'inside';
    var funcVar = 'outside';
}
// console.log(blockVar); // ReferenceError
console.log('funcVar =', funcVar);

// 3.2 Arrow Functions
console.log('\n--- Arrow Functions ---');
const add = (a, b) => a + b;
const square = x => x * x;
const greet = () => 'Hello!';
const multiply = (a, b) => {
    const result = a * b;
    return result;
};
console.log('add(3, 4) =', add(3, 4));
console.log('square(5) =', square(5));
console.log('greet() =', greet());
console.log('multiply(3, 4) =', multiply(3, 4));

// 3.3 Template Literals
console.log('\n--- Template Literals ---');
const name = 'Alice';
const age = 25;
console.log(`Hello, ${name}! You are ${age} years old.`);
console.log(`Sum: ${5 + 3}`);
console.log(`Upper: ${name.toUpperCase()}`);

// 3.4 Destructuring
console.log('\n--- Destructuring ---');
const colors = ['red', 'green', 'blue'];
const [first, second, third] = colors;
console.log(first, second, third);

const person = { name: 'Bob', age: 30, city: 'Mumbai' };
const { name: personName, age: personAge } = person;
console.log('personName =', personName, '| personAge =', personAge);

const { country = 'India' } = person;
console.log('country =', country);

// 3.5 Spread and Rest Operators
console.log('\n--- Spread and Rest ---');
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2];
console.log('combined =', combined);

const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 };
console.log('obj2 =', obj2);

function sum(...numbers) {
    return numbers.reduce((total, n) => total + n, 0);
}
console.log('sum(1, 2, 3, 4) =', sum(1, 2, 3, 4));

const [head, ...tail] = [10, 20, 30, 40];
console.log('head =', head, '| tail =', tail);

// 3.6 Default Parameters
console.log('\n--- Default Parameters ---');
function welcome(name = 'Guest', greeting = 'Hello') {
    return `${greeting}, ${name}!`;
}
console.log(welcome());
console.log(welcome('Alice'));
console.log(welcome('Bob', 'Hi'));

// 3.7 Classes
console.log('\n--- Classes ---');
class Animal {
    constructor(name, sound) {
        this.name = name;
        this.sound = sound;
    }
    speak() {
        return `${this.name} says ${this.sound}`;
    }
    static info() {
        return 'Animals are living beings.';
    }
}
class Dog extends Animal {
    constructor(name) {
        super(name, 'Woof');
    }
    fetch() {
        return `${this.name} is fetching the ball.`;
    }
}
const dog = new Dog('Rex');
console.log(dog.speak());
console.log(dog.fetch());
console.log(Animal.info());

// 3.10 Enhanced Object Literals
console.log('\n--- Enhanced Object Literals ---');
const objName = 'Alice';
const objAge = 25;
const shorthand = { objName, objAge };
console.log('shorthand =', shorthand);

const key = 'dynamicKey';
const dynamicObj = { [key]: 'value' };
console.log('dynamicObj.dynamicKey =', dynamicObj.dynamicKey);

// 3.9 Promises and Async/Await
console.log('\n--- Promises and Async/Await ---');
const fetchData = () => {
    return new Promise((resolve) => {
        setTimeout(() => resolve('Data loaded'), 1000);
    });
};

async function loadData() {
    try {
        const data = await fetchData();
        console.log('async/await:', data);
    } catch (error) {
        console.error(error);
    }
}
loadData();
