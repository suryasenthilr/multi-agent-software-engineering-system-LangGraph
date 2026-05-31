# WebCalc

**WebCalc** is a lightweight, responsive web-based calculator built with pure HTML5, CSS3, and vanilla JavaScript. It provides a clean, intuitive interface for basic arithmetic operations and supports both mouse clicks and keyboard shortcuts.

---

## Technologies Used

- **HTML5** – Semantic markup and structure of the calculator UI.
- **CSS3** – Styling, layout, and responsive design (Flexbox/Grid). Includes dark‑mode friendly colors and focus styles for accessibility.
- **Vanilla JavaScript** – Core logic for expression parsing, calculation, and handling of user interactions (clicks, keyboard shortcuts).

---

## Features

- Basic arithmetic: addition, subtraction, multiplication, division.
- Decimal support and chaining of operations.
- Clear entry (`C`) and all clear (`AC`).
- Keyboard shortcuts for digits, operators, and actions.
- Responsive layout that works on mobile, tablet, and desktop screens.
- Accessible markup with proper ARIA roles and focus management.

---

## Installation & Usage

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/webcalc.git
   cd webcalc
   ```
2. **Open the application**
   - Simply open `index.html` in any modern web browser (Chrome, Firefox, Edge, Safari).
   - No server or build step is required; the app runs entirely client‑side.

---

## Keyboard Shortcuts

| Key          | Action                     |
|--------------|----------------------------|
| `0`‑`9`      | Input digit                |
| `.`          | Decimal point              |
| `+`          | Addition                   |
| `-`          | Subtraction                |
| `*`          | Multiplication             |
| `/`          | Division                   |
| `Enter`      | Evaluate (`=`)             |
| `=`          | Evaluate (`=`)             |
| `Backspace`  | Clear entry (`C`)          |
| `Escape`     | All clear (`AC`)           |
| `Delete`     | Clear entry (`C`) (alternative) |

---

## Project Structure

```
webcalc/
├─ index.html   # Main HTML file containing the calculator layout and ARIA attributes.
├─ style.css    # Stylesheet handling visual design, responsive breakpoints, and focus states.
├─ script.js    # JavaScript module that wires UI elements, processes input, and performs calculations.
└─ README.md    # Project documentation (this file).
```

- **index.html** – Defines the calculator grid, display screen, and button elements. Each button includes `data-key` attributes to map keyboard events.
- **style.css** – Uses Flexbox/Grid to create a fluid layout that adapts to various screen sizes. Media queries adjust button sizes for touch devices. Focus outlines and `:focus-visible` ensure keyboard navigation is clear.
- **script.js** – Contains the core logic:
  - Event listeners for button clicks and `keydown` events.
  - Functions to update the display, handle operators, and evaluate expressions safely using `Function` or a custom parser.
  - State management for the current operand, previous operand, and pending operator.

---

## Responsive Design & Accessibility

- **Responsive Design**: The calculator scales with viewport width. On small screens (≤ 480 px) buttons become larger for comfortable touch interaction. The layout remains centered and maintains appropriate spacing.
- **Accessibility**:
  - Semantic HTML (`<button>`, `<section role="region" aria-label="Calculator">`).
  - Keyboard navigation support via `tabindex` and focus styles.
  - ARIA live region (`aria-live="polite"`) on the display to announce results to screen readers.
  - High‑contrast color scheme and sufficient color contrast ratios.

---

## License

This project is licensed under the **MIT License** – see the `LICENSE` file for details.

---

## Contributing

Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Ensure code follows the existing style (indentation, naming conventions).
4. Test the changes locally by opening `index.html`.
5. Submit a pull request with a clear description of the changes.

Please adhere to the [Code of Conduct](CODE_OF_CONDUCT.md) (if provided) and respect the project's licensing.
