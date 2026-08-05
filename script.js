const display = document.getElementById('display');
const buttons = document.querySelector('.buttons');
const miauSound = document.getElementById('miau-sound');
const catToggle = document.getElementById('catToggle');
const catPanel = document.getElementById('catPanel');
let currentValue = '';
let previousValue = '';
let operator = null;
let shouldReset = false;

function toggleCatPanel() {
    if (!catPanel || !catToggle) return;
    catPanel.classList.toggle('active');
    const visible = catPanel.classList.contains('active');
    catPanel.setAttribute('aria-hidden', String(!visible));
    catToggle.textContent = visible ? 'Ocultar gatito' : 'Mostrar gatito';
}

catToggle?.addEventListener('click', toggleCatPanel);

function playMiau() {
    if (!miauSound) return;
    miauSound.currentTime = 0;
    miauSound.play().catch(() => {});
}

function updateDisplay() {
    const left = previousValue ? String(previousValue) : '';
    const op = operator ? String(operator) : '';
    const right = currentValue ? String(currentValue) : '';
    const expr = left + (op ? (left ? ' ' + op + ' ' : op + ' ') : '') + right;
    display.textContent = expr || '0';
}

function appendDigit(digit) {
    if (shouldReset) {
        currentValue = '';
        shouldReset = false;
    }
    if (digit === '.' && currentValue.includes('.')) return;
    currentValue = currentValue === '0' && digit !== '.' ? digit : currentValue + digit;
    updateDisplay(currentValue);
}

function chooseOperator(op) {
    if (currentValue === '' && previousValue !== '') {
        operator = op;
        return;
    }
    if (previousValue !== '') {
        calculate();
    }
    operator = op;
    previousValue = currentValue || previousValue;
    currentValue = '';
    shouldReset = false;
    updateDisplay();
}

function calculate() {
    if (!operator || currentValue === '' || previousValue === '') return;
    const a = parseFloat(previousValue);
    const b = parseFloat(currentValue);
    let result;
    switch (operator) {
        case '+': result = a + b; break;
        case '−': result = a - b; break;
        case '×': result = a * b; break;
        case '÷': result = b === 0 ? 'Error' : a / b; break;
        case '%': result = a % b; break;
        default: return;
    }
    currentValue = result.toString();
    operator = null;
    previousValue = '';
    updateDisplay();
    shouldReset = true;
}

function clearAll() {
    currentValue = '';
    previousValue = '';
    operator = null;
    shouldReset = false;
    updateDisplay();
}

function deleteLast() {
    if (shouldReset) return;
    currentValue = currentValue.slice(0, -1);
    updateDisplay(currentValue);
}

buttons.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    const action = button.dataset.action;
    playMiau();

    if (action === 'digit') {
        appendDigit(button.dataset.value);
        return;
    }
    if (action === 'operator') {
        chooseOperator(button.textContent.trim());
        return;
    }
    if (action === 'calculate') {
        calculate();
        return;
    }
    if (action === 'clear') {
        clearAll();
        return;
    }
    if (action === 'delete') {
        deleteLast();
        return;
    }
});

document.addEventListener('keydown', event => {
    const key = event.key;
    if (/^[0-9]$/.test(key)) {
        appendDigit(key);
        playMiau();
        return;
    }
    if (key === '.') {
        appendDigit('.');
        playMiau();
        return;
    }
    if (key === 'Enter' || key === '=') {
        calculate();
        playMiau();
        return;
    }
    if (key === 'Backspace') {
        deleteLast();
        playMiau();
        return;
    }
    if (key === 'Escape') {
        clearAll();
        playMiau();
        return;
    }
    const keyMap = {
        '+': '+',
        '-': '−',
        '*': '×',
        '/': '÷',
        '%': '%'
    };
    if (keyMap[key]) {
        chooseOperator(keyMap[key]);
        playMiau();
    }
});

// Mostrar estado inicial en la pantalla
updateDisplay();

// THEME SWITCHER - temas: pink, red, blue, white
const themes = ['theme-pink', 'theme-red', 'theme-blue', 'theme-white'];
let themeIndex = 0;
const themePrevBtn = document.getElementById('theme-prev');
const themeNextBtn = document.getElementById('theme-next');

function applyTheme(index) {
    document.body.classList.remove(...themes);
    const cls = themes[index % themes.length];
    document.body.classList.add(cls);
}

function nextTheme() {
    themeIndex = (themeIndex + 1) % themes.length;
    applyTheme(themeIndex);
     animateBounce();
 }
 
 function prevTheme() {
     themeIndex = (themeIndex - 1 + themes.length) % themes.length;
     applyTheme(themeIndex);
     animateBounce();
 }
+
+function animateBounce() {
+    const calculator = document.querySelector('.calculator');
+    if (!calculator) return;
+    calculator.classList.remove('bounce');
+    void calculator.offsetWidth;
+    calculator.classList.add('bounce');
+}

// initialize theme
applyTheme(themeIndex);
