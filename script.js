const display = document.getElementById('display');
const buttons = document.querySelector('.buttons');
const miauSound = document.getElementById('miau-sound');
let currentValue = '';
let previousValue = '';
let operator = null;
let shouldReset = false;

const catBackground = document.querySelector('.cat-background');
const catCount = 6;
const cats = [];

function createCat() {
    const cat = document.createElement('div');
    cat.className = 'cat';
    const size = 44 + Math.random() * 18;
    cat.style.width = `${size}px`;
    cat.style.height = `${size}px`;
    cat.x = Math.random() * (window.innerWidth - size);
    cat.y = Math.random() * (window.innerHeight - size);
    cat.vx = (Math.random() * 0.5 + 0.1) * (Math.random() > 0.5 ? 1 : -1);
    cat.vy = (Math.random() * 0.5 + 0.1) * (Math.random() > 0.5 ? 1 : -1);
    cat.style.left = `${cat.x}px`;
    cat.style.top = `${cat.y}px`;
    catBackground.appendChild(cat);
    cats.push(cat);
}

function updateCats() {
    const bounds = catBackground.getBoundingClientRect();
    cats.forEach(cat => {
        const size = cat.offsetWidth;
        cat.x += cat.vx;
        cat.y += cat.vy;

        if (cat.x <= bounds.left) {
            cat.x = bounds.left;
            cat.vx *= -1;
        }
        if (cat.y <= bounds.top) {
            cat.y = bounds.top;
            cat.vy *= -1;
        }
        if (cat.x + size >= bounds.right) {
            cat.x = bounds.right - size;
            cat.vx *= -1;
        }
        if (cat.y + size >= bounds.bottom) {
            cat.y = bounds.bottom - size;
            cat.vy *= -1;
        }

        cat.style.left = `${cat.x}px`;
        cat.style.top = `${cat.y}px`;
    });
}

function initCats() {
    if (!catBackground) return;
    for (let i = 0; i < catCount; i += 1) {
        createCat();
    }
    function animate() {
        updateCats();
        requestAnimationFrame(animate);
    }
    animate();
}

window.addEventListener('resize', () => {
    cats.forEach(cat => {
        const bounds = catBackground.getBoundingClientRect();
        cat.x = Math.min(cat.x, bounds.width - cat.offsetWidth);
        cat.y = Math.min(cat.y, bounds.height - cat.offsetHeight);
    });
});

initCats();

function playMiau() {
    if (!miauSound) return;
    miauSound.currentTime = 0;
    miauSound.play().catch(() => {});
}

function updateDisplay(value) {
    display.textContent = value || '0';
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
    updateDisplay(currentValue);
    operator = null;
    previousValue = '';
    shouldReset = true;
}

function clearAll() {
    currentValue = '';
    previousValue = '';
    operator = null;
    shouldReset = false;
    updateDisplay('0');
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
