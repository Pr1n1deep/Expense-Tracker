let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function updateUI() {
    const balanceElement = document.getElementById("balance");
    const transactionList = document.getElementById("transaction-list");
    
    transactionList.innerHTML = "";
    
    let totalBalance = 0;
    let expenseData = { income: 0, expense: 0 };

    transactions.forEach((transaction, index) => {
        totalBalance += transaction.amount;
        if (transaction.amount > 0) {
            expenseData.income += transaction.amount;
        } else {
            expenseData.expense += Math.abs(transaction.amount);
        }

        const listItem = document.createElement("li");
        listItem.innerHTML = `${transaction.description}: <strong>$${transaction.amount.toFixed(2)}</strong> 
            <span class="delete-btn" onclick="deleteTransaction(${index})">❌</span>`;
        transactionList.appendChild(listItem);
    });

    balanceElement.innerText = `$${totalBalance.toFixed(2)}`;
    localStorage.setItem("transactions", JSON.stringify(transactions));

    updateChart(expenseData);
}

function addTransaction() {
    const description = document.getElementById("description").value;
    const amount = parseFloat(document.getElementById("amount").value);

    if (!description || isNaN(amount)) {
        alert("Please enter valid details");
        return;
    }

    transactions.push({ description, amount });
    updateUI();

    document.getElementById("description").value = "";
    document.getElementById("amount").value = "";
}

function deleteTransaction(index) {
    transactions.splice(index, 1);
    updateUI();
}

// Chart.js Expense Chart
let chartInstance;
function updateChart(expenseData) {
    const ctx = document.getElementById("expenseChart").getContext("2d");

    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: "pie",
        data: {
            labels: ["Income", "Expense"],
            datasets: [{
                data: [expenseData.income, expenseData.expense],
                backgroundColor: ["#4caf50", "#f44336"]
            }]
        }
    });
}

// Initialize UI
updateUI();
