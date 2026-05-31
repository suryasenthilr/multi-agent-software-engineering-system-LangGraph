/*
 * CGPA Calculator - Core JavaScript Logic
 * Implements constants, utility functions, row management, validation,
 * calculation, reset, and initialization.
 */

// Task 1 – Constants & Utility Functions
const GRADE_POINTS = {
    A: 4,
    B: 3,
    C: 2,
    D: 1,
    F: 0,
};

/**
 * Returns the 4‑point scale value for a given grade letter.
 * @param {string} grade - Grade letter (A‑F)
 * @returns {number|null} Grade point or null if invalid.
 */
function getGradePoint(grade) {
    return GRADE_POINTS[grade] ?? null;
}

// Task 2 – Row Management Functions
/**
 * Clones the first course row, clears its inputs, enables the remove button,
 * and returns the new <tr> element.
 * @returns {HTMLTableRowElement} The newly created row.
 */
function createCourseRow() {
    const templateRow = document.querySelector('.course-row');
    if (!templateRow) return null;
    const newRow = templateRow.cloneNode(true);
    // Clear input values
    const nameInput = newRow.querySelector('.course-name');
    if (nameInput) nameInput.value = '';
    const gradeSelect = newRow.querySelector('.course-grade');
    if (gradeSelect) gradeSelect.selectedIndex = 0; // select placeholder
    const creditsInput = newRow.querySelector('.course-credits');
    if (creditsInput) creditsInput.value = '';
    // Enable remove button
    const removeBtn = newRow.querySelector('.remove-row');
    if (removeBtn) removeBtn.disabled = false;
    return newRow;
}

/**
 * Appends a new course row to the table and wires its remove button.
 */
function addRow() {
    const tbody = document.querySelector('#courses-table tbody');
    const newRow = createCourseRow();
    if (!newRow) return;
    // Attach remove handler to the button in the new row
    const removeBtn = newRow.querySelector('.remove-row');
    if (removeBtn) {
        removeBtn.addEventListener('click', removeRow);
    }
    tbody.appendChild(newRow);
}

/**
 * Removes the row that contains the clicked remove button.
 * @param {Event} event - Click event from a remove button.
 */
function removeRow(event) {
    const btn = event.currentTarget;
    const row = btn.closest('tr');
    if (row) {
        row.remove();
    }
}

// Task 3 – Input Validation
/**
 * Validates all course rows.
 * Displays error messages in #error-messages.
 * @returns {boolean} True if all inputs are valid, false otherwise.
 */
function validateInputs() {
    const errorContainer = document.getElementById('error-messages');
    errorContainer.innerHTML = '';
    const errors = [];
    const rows = document.querySelectorAll('.course-row');
    rows.forEach((row, index) => {
        const rowNum = index + 1;
        const name = row.querySelector('.course-name')?.value.trim() ?? '';
        const grade = row.querySelector('.course-grade')?.value ?? '';
        const creditsStr = row.querySelector('.course-credits')?.value ?? '';
        const credits = Number(creditsStr);
        if (!name) {
            errors.push(`Row ${rowNum}: Course name is required.`);
        }
        if (!grade) {
            errors.push(`Row ${rowNum}: Grade must be selected.`);
        } else if (!['A', 'B', 'C', 'D', 'F'].includes(grade)) {
            errors.push(`Row ${rowNum}: Invalid grade.`);
        }
        if (!creditsStr || isNaN(credits) || credits <= 0) {
            errors.push(`Row ${rowNum}: Credits must be a positive number.`);
        }
    });
    if (errors.length) {
        const ul = document.createElement('ul');
        errors.forEach(msg => {
            const li = document.createElement('li');
            li.textContent = msg;
            ul.appendChild(li);
        });
        errorContainer.appendChild(ul);
        return false;
    }
    return true;
}

// Task 4 – CGPA Calculation
/**
 * Calculates CGPA based on the entered courses.
 * Performs validation first; aborts on errors.
 */
function calculateCGPA() {
    // Clear previous errors
    const errorContainer = document.getElementById('error-messages');
    errorContainer.innerHTML = '';
    if (!validateInputs()) {
        return;
    }
    let totalPoints = 0;
    let totalCredits = 0;
    const rows = document.querySelectorAll('.course-row');
    rows.forEach(row => {
        const grade = row.querySelector('.course-grade')?.value;
        const credits = Number(row.querySelector('.course-credits')?.value);
        const gradePoint = getGradePoint(grade);
        if (gradePoint !== null && !isNaN(credits)) {
            totalPoints += gradePoint * credits;
            totalCredits += credits;
        }
    });
    const resultDiv = document.getElementById('result');
    if (totalCredits === 0) {
        // Show error for zero credits
        const ul = document.createElement('ul');
        const li = document.createElement('li');
        li.textContent = 'Total credits cannot be zero.';
        ul.appendChild(li);
        errorContainer.appendChild(ul);
        resultDiv.classList.add('hidden');
        return;
    }
    const cgpa = totalPoints / totalCredits;
    const cgpaStr = cgpa.toFixed(2);
    document.getElementById('cgpa-value').textContent = cgpaStr;
    resultDiv.classList.remove('hidden');
}

// Task 5 – Reset / Clear Functionality
/**
 * Resets the form to its initial state.
 * Clears additional rows, errors, and result display.
 */
function resetForm() {
    const tbody = document.querySelector('#courses-table tbody');
    const rows = tbody.querySelectorAll('.course-row');
    if (rows.length > 0) {
        const firstRow = rows[0];
        // Reset inputs of the first (template) row
        firstRow.querySelector('.course-name').value = '';
        const gradeSelect = firstRow.querySelector('.course-grade');
        if (gradeSelect) gradeSelect.selectedIndex = 0;
        firstRow.querySelector('.course-credits').value = '';
        const removeBtn = firstRow.querySelector('.remove-row');
        if (removeBtn) removeBtn.disabled = true;
        // Remove any extra rows
        for (let i = 1; i < rows.length; i++) {
            rows[i].remove();
        }
    }
    // Clear errors and hide result
    document.getElementById('error-messages').innerHTML = '';
    document.getElementById('result').classList.add('hidden');
}

// Task 6 – Initialization & Event Binding
document.addEventListener('DOMContentLoaded', () => {
    // Bind core buttons
    const addBtn = document.getElementById('add-row');
    const calcBtn = document.getElementById('calculate');
    const resetBtn = document.getElementById('reset');
    if (addBtn) addBtn.addEventListener('click', addRow);
    if (calcBtn) calcBtn.addEventListener('click', calculateCGPA);
    if (resetBtn) resetBtn.addEventListener('click', resetForm);

    // Attach remove handlers to existing rows
    document.querySelectorAll('.remove-row').forEach(btn => {
        btn.addEventListener('click', removeRow);
    });

    // Ensure the first row's remove button stays disabled
    const firstRemove = document.querySelector('.course-row .remove-row');
    if (firstRemove) firstRemove.disabled = true;
});
