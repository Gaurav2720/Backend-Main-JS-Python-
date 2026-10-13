# Lab Experiment 07 & 08: ES6, DOM Manipulation, and Event Handling

**Course Outcome:** CO2 – Create and build web pages and applications.  
**Institution:** UPES School of Computer Science  
**Lab Folder:** `Lab7,8,9`

---

## 1. Objective
To understand and apply ES6 (ECMAScript 2015) features in JavaScript, learn DOM (Document Object Model) manipulation, and implement event handling to build interactive web pages.

By the end of this experiment, you will be able to:
1. Write modern JavaScript using ES6 features (`let`/`const`, arrow functions, template literals, destructuring, spread/rest, classes, promises, async/await).
2. Dynamically modify HTML/CSS through the Document Object Model (DOM).
3. Respond to user interactions using event listeners, bubbling, propagation control, and event delegation.
4. Construct an interactive, state-driven To-Do application that integrates all three paradigms.

---

## 2. Prerequisites
- Basic knowledge of HTML and CSS
- Familiarity with fundamental JavaScript (variables, functions, loops, conditionals)
- A modern code editor (VS Code)
- Node.js runtime and a modern web browser (Google Chrome / Mozilla Firefox / Microsoft Edge)

---

## 3. Part A: ES6 (ECMAScript 2015) Features (`es6.js`)

ES6 introduced significant modernization to JavaScript, making code cleaner, more readable, and robust.

### 3.1 `let` and `const` (Block Scoping)
- `var`: Function-scoped, hoisted, allows redeclaration.
- `let`: Block-scoped (`{ ... }`), cannot be redeclared in the same scope, reassignable.
- `const`: Block-scoped, cannot be redeclared or reassigned.

```javascript
let blockScopedVar = "inside";
const PI = 3.14159;
```

### 3.2 Arrow Functions
Arrow functions provide a concise syntax and inherit `this` lexically from their enclosing context:
```javascript
const add = (a, b) => a + b;
const square = x => x * x;
const greet = () => "Hello!";
```

### 3.3 Template Literals
Enclose strings with backticks (\` \`) to support string interpolation (`${expression}`) and multi-line strings:
```javascript
const name = "Alice";
const msg = `Hello, ${name}! Sum: ${5 + 3}`;
```

### 3.4 Destructuring
Unpack values from arrays or properties from objects into distinct variables:
```javascript
const colors = ["red", "green", "blue"];
const [first, second] = colors;

const person = { name: "Bob", age: 30 };
const { name, age } = person;
```

### 3.5 Spread and Rest Operators (`...`)
- **Spread:** Expands an iterable into elements (`[...arr1, ...arr2]`, `{ ...obj1, c: 3 }`).
- **Rest:** Bundles multiple function arguments or remaining destructuring elements into an array (`function sum(...numbers)`).

### 3.6 Default Parameters
```javascript
function greet(name = "Guest", greeting = "Hello") {
    return `${greeting}, ${name}!`;
}
```

### 3.7 Classes and Inheritance
Provides clean syntactic sugar for object-oriented prototypes and inheritance:
```javascript
class Animal {
    constructor(name, sound) {
        this.name = name;
        this.sound = sound;
    }
    speak() { return `${this.name} says ${this.sound}`; }
    static info() { return "Animals are living beings."; }
}

class Dog extends Animal {
    constructor(name) {
        super(name, "Woof");
    }
}
```

### 3.8 Promises & Async / Await
Handles asynchronous operations cleanly without callback hell:
```javascript
const fetchData = () => new Promise(resolve => setTimeout(() => resolve("Data loaded"), 1000));

async function loadData() {
    const data = await fetchData();
    console.log(data);
}
```

---

## 4. Part B: DOM Manipulation (`dom.js`)

The DOM represents the HTML document as a tree of nodes that JavaScript can dynamically inspect and modify.

| Operation | Method / Property | Example |
|---|---|---|
| Select by ID | `document.getElementById(id)` | `document.getElementById('container')` |
| CSS Selector | `document.querySelector(sel)` | `document.querySelector('.text')` |
| Multiple Elements | `document.querySelectorAll(sel)` | `document.querySelectorAll('.text')` |
| Modify Text | `element.textContent` | `heading.textContent = "New Heading"` |
| Modify HTML | `element.innerHTML` | `heading.innerHTML = "<em>Italic</em>"` |
| Attributes | `setAttribute(name, val)` | `link.setAttribute('href', 'https://example.com')` |
| Styling | `element.style.prop` | `box.style.backgroundColor = 'lightblue'` |
| Classes | `classList.add / remove / toggle` | `box.classList.toggle('active')` |
| Create Elements | `document.createElement(tag)` | `const div = document.createElement('div')` |
| Append | `parent.appendChild(child)` | `container.appendChild(div)` |
| Remove | `element.remove()` | `removeTarget.remove()` |
| Traversal | `parentElement`, `children` | `item.nextElementSibling` |

---

## 5. Part C: Event Handling (`events.js`)

Event listeners allow scripts to capture and respond to user actions.

### 5.1 Event Registration
Using `addEventListener` is the modern standard because it allows multiple listeners on the same element without overwriting previous handlers:
```javascript
const btn = document.getElementById('clickBtn');
btn.addEventListener('click', (event) => {
    console.log(`Clicked at coordinates: (${event.clientX}, ${event.clientY})`);
});
```

### 5.2 Propagation: Bubbling & `stopPropagation()`
Events flow through Capturing &rarr; Target &rarr; Bubbling phases.
- To prevent an event from bubbling up to parent nodes:
  ```javascript
  childBtn.addEventListener('click', (e) => {
      e.stopPropagation();
  });
  ```

### 5.3 Default Behavior: `preventDefault()`
Cancels default browser behaviors like form submission refreshes or navigation:
```javascript
form.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log("Form processed asynchronously without reloading!");
});
```

### 5.4 Event Delegation
Attaching a single event listener to a parent container instead of every individual child element. Uses `event.target`:
```javascript
taskList.addEventListener('click', (event) => {
    if (event.target.tagName === 'LI') {
        event.target.classList.toggle('done');
    }
});
```
**Benefits:**
- Works seamlessly for dynamically inserted elements.
- Consumes significantly less memory.

---

## 6. Practical Exercise: Interactive To-Do List (`app.js`, `index.html`)

The interactive To-Do application integrates:
- **ES6 Classes:** `Task` class creating `{ id, title, completed }`.
- **ES6 Spread Operator:** `tasks = [...tasks, new Task(title)]`.
- **ES6 Destructuring:** `tasks.forEach(({ id, title, completed }) => { ... })`.
- **DOM Creation:** `document.createElement('li')`, `classList`, `dataset.id`.
- **Event Handling:** Enter key submission, click listener on Add button.
- **Event Delegation:** Single listener on `taskList` handling task toggles and deletions.

### Implementation Code (`app.js`):
```javascript
let tasks = [];

class Task {
    constructor(title) {
        this.id = Date.now();
        this.title = title;
        this.completed = false;
    }
}

const renderTasks = () => {
    list.innerHTML = "";
    tasks.forEach(({ id, title, completed }) => {
        const li = document.createElement("li");
        li.dataset.id = id;

        const span = document.createElement("span");
        span.textContent = title;
        if (completed) span.classList.add("done");

        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.classList.add("delete-btn");

        li.append(span, delBtn);
        list.appendChild(li);
    });
};

const addTask = () => {
    const title = input.value.trim();
    if (!title) return;
    tasks = [...tasks, new Task(title)];
    input.value = "";
    renderTasks();
};

addBtn.addEventListener("click", addTask);
input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addTask();
});

list.addEventListener("click", (event) => {
    const li = event.target.closest("li");
    if (!li) return;
    const id = Number(li.dataset.id);

    if (event.target.classList.contains("delete-btn")) {
        tasks = tasks.filter(t => t.id !== id);
        renderTasks();
    } else {
        tasks = tasks.map(t =>
            t.id === id ? { ...t, completed: !t.completed } : t
        );
        renderTasks();
    }
});
```

---

## 7. How to Run & Verify

### Option A: Via Node.js Server (`node app.js`)
Run the following in the `Lab7,8,9` directory:
```bash
node app.js
```
- Executes an automated ES6 self-test in terminal.
- Launches a local HTTP server at `http://localhost:3000`.
- Open `http://localhost:3000` in any web browser to interact with the full dashboard and To-Do list.

### Option B: Standalone ES6 Node Execution
```bash
node es6.js
```
Runs and outputs all ES6 language demonstrations directly in the console.

### Option C: Direct Browser Opening
Open `index.html` directly in Google Chrome, Edge, or Firefox.

---

## 8. Summary Table

| Topic | Key Concepts | Practical Use Cases |
|---|---|---|
| **ES6** | `let/const`, arrow functions, template literals, destructuring, spread/rest, classes, promises, async/await | Cleaner code, lexical `this`, immutable state management |
| **DOM** | `querySelector`, `createElement`, `appendChild`, `classList`, `style`, `innerHTML`, `textContent` | Dynamic UI generation and DOM updates without page refresh |
| **Events** | `addEventListener`, event object, bubbling, `preventDefault`, `stopPropagation`, delegation | Interactive event response, form validation, event delegation |

---

## 9. Common Errors & Troubleshooting

| Error | Cause | Fix |
|---|---|---|
| `Cannot read property of null` | Selecting element before DOM is fully parsed | Move `<script>` to end of `<body>` or use `DOMContentLoaded` |
| `Event handler not firing` | Element was dynamically created after listener was registered | Use event delegation on a static parent or attach listener during creation |
| `innerHTML not updating` | Typo in selector or ID | Verify spelling in `document.getElementById` or `querySelector` |
| `Arrow function this issue` | Arrow functions do not bind dynamic `this` | Use regular `function` syntax if dynamic `this` binding is required |
| `Module import fails` | Missing `type="module"` in `<script>` tag | Add `<script type="module" src="...">` in HTML |

---

## 10. Conclusion
Through Experiment 07 & 08, we demonstrated:
1. Writing modular, modern JavaScript using ES6 features including classes, arrow functions, destructuring, and spread operators.
2. Manipulating the DOM dynamically by creating, styling, and inserting elements into the tree structure.
3. Managing browser events, controlling propagation through bubbling and `stopPropagation()`, and preventing default browser behaviors.
4. Implementing a complete, production-quality interactive To-Do application utilizing event delegation and state-driven rendering.
