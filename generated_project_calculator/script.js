/**
 * Calculator class handles the core logic of the web calculator.
 * It manages the display, user input (both button clicks and keyboard),
 * arithmetic operations, and UI updates.
 */
class Calculator {
    constructor() {
        // Reference to the display element where numbers/results are shown
        this.displayElement = document.getElementById('display');
        // The string currently shown on the display (e.g., "12.3")
        this.currentInput = '0';
        // The stored numeric value from a previous entry when an operator is chosen
        this.previousValue = null; // number | null
        // The operator selected (+, -, *, /)
        this.operator = null; // string | null
        // Flag indicating that the next number entry should reset the display
        this.shouldResetDisplay = false;
    }

    /**
     * Initialise the calculator by attaching event listeners to all buttons
     * and to the document for keyboard interaction.
     */
    init() {
        // Attach click listeners to all calculator buttons
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const key = button.dataset.key;
                this._handleKey(key);
            });
        });

        // Keyboard handling – map physical keys to the same logic as button clicks
        document.addEventListener('keydown', (event) => this.handleKeyboard(event));

        // Ensure the initial display reflects the default state
        this.updateDisplay();
    }

    /**
     * Central dispatcher that decides what action to take based on a key string.
     * @param {string} key - The value from a button's data-key attribute or a keyboard key.
     */
    _handleKey(key) {
        if (key === null) return;
        if (key >= '0' && key <= '9' || key === '.') {
            this.appendNumber(key);
        } else if (['+', '-', '*', '/'].includes(key)) {
            this.chooseOperator(key);
        } else if (key === 'Enter' || key === '=') {
            this.handleEquals();
        } else if (key === 'C') {
            this.clearEntry();
        } else if (key === 'AC') {
            this.allClear();
        }
        // Any other keys are ignored.
    }

    /**
     * Refreshes the calculator's display with the current input string.
     */
    updateDisplay() {
        this.displayElement.textContent = this.currentInput;
    }

    /**
     * Removes the last character from the current input (Backspace behaviour).
     */
    clearEntry() {
        if (this.shouldResetDisplay) {
            // If a result was just shown, treat clearEntry as allClear for simplicity.
            this.allClear();
            return;
        }
        if (this.currentInput.length > 1) {
            this.currentInput = this.currentInput.slice(0, -1);
        } else {
            this.currentInput = '0';
        }
        this.updateDisplay();
    }

    /**
     * Resets the calculator to its default state.
     */
    allClear() {
        this.currentInput = '0';
        this.previousValue = null;
        this.operator = null;
        this.shouldResetDisplay = false;
        this.updateDisplay();
    }

    /**
     * Appends a digit or decimal point to the current input.
     * Prevents multiple decimal points and handles leading zeros.
     * @param {string} key - The digit ("0"‑"9") or decimal point (".")
     */
    appendNumber(key) {
        if (this.shouldResetDisplay) {
            this.currentInput = '';
            this.shouldResetDisplay = false;
        }
        // Prevent multiple leading zeros (e.g., "00") unless a decimal follows
        if (key === '.' && this.currentInput.includes('.')) {
            return; // ignore second decimal point
        }
        if (this.currentInput === '0' && key !== '.') {
            this.currentInput = key; // replace leading zero
        } else {
            this.currentInput += key;
        }
        this.updateDisplay();
    }

    /**
     * Handles operator selection. If an operation is already pending, it computes it first.
     * Then stores the chosen operator and prepares for the next number entry.
     * @param {string} opKey - One of '+', '-', '*', '/'
     */
    chooseOperator(opKey) {
        if (this.operator && this.previousValue !== null && !this.shouldResetDisplay) {
            // Compute the pending operation before overriding the operator
            const result = this.compute();
            if (result === null) return; // error already handled
            this.previousValue = result;
        } else {
            this.previousValue = parseFloat(this.currentInput);
        }
        this.operator = opKey;
        this.shouldResetDisplay = true; // next number entry starts fresh
    }

    /**
     * Executes the arithmetic operation stored in `this.operator`.
     * Handles division by zero and returns the computed result.
     * @returns {number|null} The result of the calculation, or null on error.
     */
    compute() {
        if (this.operator === null || this.previousValue === null) {
            return parseFloat(this.currentInput);
        }
        const current = parseFloat(this.currentInput);
        let result = null;
        switch (this.operator) {
            case '+':
                result = this.previousValue + current;
                break;
            case '-':
                result = this.previousValue - current;
                break;
            case '*':
                result = this.previousValue * current;
                break;
            case '/':
                if (current === 0) {
                    // Division by zero – display an error and abort the operation
                    this.currentInput = 'Error';
                    this.updateDisplay();
                    this.allClear(); // reset after showing error
                    return null;
                }
                result = this.previousValue / current;
                break;
            default:
                return null;
        }
        // Round result to avoid floating‑point artefacts (optional)
        result = Math.round((result + Number.EPSILON) * 1e12) / 1e12;
        return result;
    }

    /**
     * Handles the equals (= or Enter) action: computes the result and updates the UI.
     */
    handleEquals() {
        const result = this.compute();
        if (result === null) return; // error case already handled
        this.currentInput = result.toString();
        this.previousValue = null;
        this.operator = null;
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }

    /**
     * Keyboard event handler – maps physical key presses to the same logic used by button clicks.
     * @param {KeyboardEvent} event
     */
    handleKeyboard(event) {
        const key = event.key;
        // Normalise certain keys to match our data-key values
        const keyMap = {
            'Enter': 'Enter',
            '=': '=', // some keyboards may emit '=' for the Enter key on the numpad
            'Backspace': 'C',
            'Delete': 'AC',
            '*': '*',
            'x': '*',
            'X': '*',
            '/': '/',
            '-': '-',
            '+': '+',
            '.': '.',
            ',': '.', // allow comma as decimal on some locales
        };
        const mappedKey = keyMap[key] !== undefined ? keyMap[key] : key;
        // Check if there is a button with this data-key attribute
        const button = document.querySelector(`.btn[data-key="${mappedKey}"]`);
        if (button) {
            event.preventDefault();
            this._handleKey(mappedKey);
            // Add a quick visual feedback by briefly adding an active class
            button.classList.add('active');
            setTimeout(() => button.classList.remove('active'), 100);
        }
    }
}

// Instantiate and initialise the calculator when the script loads.
const calc = new Calculator();
calc.init();
