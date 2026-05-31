// Expense Calculator JavaScript
// State definition
const expenses = [];

// Utility function to format numbers as currency (two decimal places)
function formatCurrency(value) {
  return value.toFixed(2);
}

// Core functions
function addExpense(name, amount) {
  const expense = {
    id: Date.now(),
    name,
    amount,
  };
  expenses.push(expense);
  renderExpenses();
  updateTotal();
}

function deleteExpense(id) {
  const index = expenses.findIndex((exp) => exp.id === id);
  if (index !== -1) {
    expenses.splice(index, 1);
    renderExpenses();
    updateTotal();
  }
}

function calculateTotal() {
  return expenses.reduce((sum, exp) => sum + exp.amount, 0);
}

function updateTotal() {
  const totalEl = document.getElementById('total-amount');
  if (totalEl) {
    totalEl.textContent = formatCurrency(calculateTotal());
  }
}

function renderExpenses() {
  const tbody = document.getElementById('expenses-tbody');
  if (!tbody) return;
  // Clear existing rows
  tbody.innerHTML = '';

  expenses.forEach((exp) => {
    const tr = document.createElement('tr');

    const nameTd = document.createElement('td');
    nameTd.textContent = exp.name;
    tr.appendChild(nameTd);

    const amountTd = document.createElement('td');
    amountTd.textContent = `$${formatCurrency(exp.amount)}`;
    tr.appendChild(amountTd);

    const actionTd = document.createElement('td');
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.setAttribute('data-id', exp.id);
    deleteBtn.className = 'delete-btn';
    actionTd.appendChild(deleteBtn);
    tr.appendChild(actionTd);

    tbody.appendChild(tr);
  });
}

function resetExpenses() {
  expenses.length = 0; // clear array while keeping reference
  const tbody = document.getElementById('expenses-tbody');
  if (tbody) tbody.innerHTML = '';
  updateTotal();
}

// Event listener initialization
function initEventListeners() {
  const form = document.getElementById('expense-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('expense-name');
      const amountInput = document.getElementById('expense-amount');
      const name = nameInput ? nameInput.value.trim() : '';
      const amountStr = amountInput ? amountInput.value.trim() : '';
      const amount = parseFloat(amountStr);

      // Simple validation
      if (!name) {
        alert('Please enter an expense name.');
        return;
      }
      if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount greater than 0.');
        return;
      }

      addExpense(name, amount);

      // Reset form fields
      if (nameInput) nameInput.value = '';
      if (amountInput) amountInput.value = '';
    });
  }

  const tbody = document.getElementById('expenses-tbody');
  if (tbody) {
    tbody.addEventListener('click', (e) => {
      const target = e.target;
      if (target && target.matches('button[data-id]')) {
        const id = parseInt(target.getAttribute('data-id'), 10);
        deleteExpense(id);
      }
    });
  }

  const resetBtn = document.getElementById('reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      resetExpenses();
    });
  }
}

// Initialize after DOM content is loaded
document.addEventListener('DOMContentLoaded', initEventListeners);
