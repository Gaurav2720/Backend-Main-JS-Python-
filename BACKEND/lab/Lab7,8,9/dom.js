// ============================================================
// Part B: DOM Manipulation
// Requires: index.html (all selectors below exist there)
// ============================================================

console.log('--- DOM Manipulation ---');

// 4.2 Selecting Elements
const container = document.getElementById('container');
const paragraphs = document.getElementsByClassName('text');
const firstPara = document.querySelector('.text');
const allParas = document.querySelectorAll('.text');

console.log('paragraphs.length =', paragraphs.length);
console.log('firstPara.textContent =', firstPara.textContent);
allParas.forEach(p => console.log('querySelectorAll:', p.textContent));

// 4.3 Modifying Content
const heading = document.querySelector('#heading');
heading.textContent = 'New Heading (textContent)';
heading.innerHTML = '<em>Italic Heading (innerHTML)</em>';

// 4.4 Modifying Attributes
const link = document.querySelector('#demoLink');
console.log('href before =', link.getAttribute('href'));
link.setAttribute('href', 'https://example.com');
link.setAttribute('target', '_blank');

// 4.5 Modifying Styles
const box = document.querySelector('.box');
box.style.backgroundColor = 'lightblue';
box.style.fontSize = '20px';
box.style.marginTop = '10px';
box.classList.add('highlight');
box.classList.toggle('active');
console.log('box has active =', box.classList.contains('active'));

// 4.6 Creating and Adding Elements
const newDiv = document.createElement('div');
newDiv.textContent = 'I am a dynamically created element!';
newDiv.classList.add('card');
container.appendChild(newDiv);

const dynamicItem = document.createElement('li');
dynamicItem.textContent = 'Dynamically added item';
document.getElementById('demoList').appendChild(dynamicItem);

// 4.7 Removing Elements
const removeTarget = document.querySelector('#removeTarget');
if (removeTarget) {
    removeTarget.remove();
}

// 4.8 Traversing the DOM
const item = document.querySelector('#demoList .item');
if (item) {
    console.log('parentElement:', item.parentElement.tagName);
    console.log('nextElementSibling:', item.nextElementSibling?.textContent);
    console.log('children count:', item.parentElement.children.length);
}
