// ============================================================
// Part C: Event Handling
// Requires: index.html (interactive elements)
// ============================================================

console.log('--- Event Handling Initialized ---');

// Helper to log visual status message on page if status box exists
const logEventStatus = (msg) => {
    console.log(`[Event Lab] ${msg}`);
    const statusBox = document.getElementById('eventStatusLog');
    if (statusBox) {
        const item = document.createElement('div');
        item.className = 'status-log-entry';
        item.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
        statusBox.prepend(item);
    }
};

// 5.2 addEventListener (recommended)
const clickBtn = document.getElementById('clickBtn');
if (clickBtn) {
    clickBtn.addEventListener('click', () => {
        logEventStatus('clickBtn: Click event triggered! (Handler 1)');
    });
    clickBtn.addEventListener('click', () => {
        console.log('Second handler fired on clickBtn');
    });
}

// 5.3 Common event types: dblclick
const dblBtn = document.getElementById('dblBtn');
if (dblBtn) {
    dblBtn.addEventListener('dblclick', () => {
        logEventStatus('dblBtn: Double-click event detected!');
    });
}

// mouseover / mouseout
const hoverZone = document.getElementById('hoverZone');
if (hoverZone) {
    hoverZone.addEventListener('mouseover', () => {
        hoverZone.style.backgroundColor = 'rgba(99, 102, 241, 0.2)';
        hoverZone.style.borderColor = '#6366f1';
        logEventStatus('hoverZone: mouseover triggered');
    });
    hoverZone.addEventListener('mouseout', () => {
        hoverZone.style.backgroundColor = '';
        hoverZone.style.borderColor = '';
        logEventStatus('hoverZone: mouseout triggered');
    });
}

// 5.4 The Event Object
if (clickBtn) {
    clickBtn.addEventListener('click', (event) => {
        console.log('event.type =', event.type);
        console.log('event.target =', event.target.tagName);
        console.log('event.clientX =', event.clientX);
        console.log('event.clientY =', event.clientY);
        const eventDetail = document.getElementById('eventDetailsOutput');
        if (eventDetail) {
            eventDetail.textContent = `Type: ${event.type} | Target: <${event.target.tagName.toLowerCase()}> | Coords: (${event.clientX}, ${event.clientY})`;
        }
    });
}

// 5.5 Keyboard Events
document.addEventListener('keydown', (event) => {
    const out = document.getElementById('keyOutput');
    if (out) {
        out.textContent =
            `Key: "${event.key}" | Code: ${event.code} | Ctrl: ${event.ctrlKey} | Shift: ${event.shiftKey} | Alt: ${event.altKey}`;
    }
});

// 5.6 Form Events
const form = document.getElementById('myForm');
const usernameInput = document.getElementById('username');
if (form) {
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevents page reload
        const username = usernameInput ? usernameInput.value : '';
        logEventStatus(`Form submitted successfully! Username: "${username}"`);
        const formFeedback = document.getElementById('formFeedback');
        if (formFeedback) {
            formFeedback.textContent = `Submitted successfully: ${username}`;
            formFeedback.style.color = '#10b981';
        }
    });
}

if (usernameInput) {
    usernameInput.addEventListener('input', (e) => {
        console.log(`Current value: ${e.target.value}`);
        const liveVal = document.getElementById('inputLivePreview');
        if (liveVal) {
            liveVal.textContent = e.target.value || '(empty)';
        }
    });
}

// 5.7 Event Bubbling
const outer = document.getElementById('outer');
const inner = document.getElementById('inner');
if (outer) {
    outer.addEventListener('click', () => {
        logEventStatus('Outer container received click (Bubbled up from inner)');
    });
}
if (inner) {
    inner.addEventListener('click', () => {
        logEventStatus('Inner button clicked directly');
    });
}

// 5.8 stopPropagation()
const stopOuter = document.getElementById('stopOuter');
const stopBtn = document.getElementById('stopBtn');
if (stopOuter) {
    stopOuter.addEventListener('click', () => {
        logEventStatus('ERROR: Outer container should NOT receive this if stopped!');
    });
}
if (stopBtn) {
    stopBtn.addEventListener('click', (event) => {
        event.stopPropagation(); // Stops bubbling to outer
        logEventStatus('StopBtn clicked & event.stopPropagation() called! Outer will NOT fire.');
    });
}

// 5.8 preventDefault()
const preventLink = document.getElementById('preventLink');
if (preventLink) {
    preventLink.addEventListener('click', (event) => {
        event.preventDefault(); // Prevents navigation
        logEventStatus('Link clicked but navigation cancelled via event.preventDefault()');
    });
}

// 5.9 Event Delegation (Slide 5.9 demo)
const delegationList = document.getElementById('delegationList');
if (delegationList) {
    delegationList.addEventListener('click', (event) => {
        if (event.target.tagName === 'LI') {
            event.target.classList.toggle('done');
            logEventStatus(`Delegation clicked: "${event.target.textContent}" (done toggled)`);
        }
    });
}
