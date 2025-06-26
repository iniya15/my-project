import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyB-7mrJIeLMm1NImmpYDpANhr3mAta9I3s",
    authDomain: "finwell-29b71.firebaseapp.com",
    projectId: "finwell-29b71",
    storageBucket: "finwell-29b71.appspot.com",
    messagingSenderId: "305565472799",
    appId: "1:305565472799:web:df2a07747125baa7cb1d2a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Check auth state
onAuthStateChanged(auth, (user) => {
    if (!user) {
        alert("Please log in to access the Retirement Planning tool.");
        window.location.href = "../finwell-auth.html";
    }
});

// Logout function
window.logout = function () {
    signOut(auth)
        .then(() => {
            window.location.href = "../finwell-auth.html";
        })
        .catch((error) => {
            alert("Logout failed: " + error.message);
        });
};

// Initialize Chart.js
let retirementChart = null;

// Format currency
const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
});

// Calculate retirement savings
function calculateRetirementSavings(currentAge, retirementAge, currentSavings, monthlyContribution, expectedReturn, inflationRate) {
    const yearsToRetirement = retirementAge - currentAge;
    const monthlyRate = (expectedReturn / 100) / 12;
    const inflationMonthlyRate = (inflationRate / 100) / 12;
    
    let savings = currentSavings;
    let totalContributions = 0;
    const yearlyData = [];
    
    for (let year = 0; year <= yearsToRetirement; year++) {
        for (let month = 0; month < 12; month++) {
            savings = savings * (1 + monthlyRate) + monthlyContribution;
            totalContributions += monthlyContribution;
        }
        yearlyData.push({
            year: currentAge + year,
            savings: savings,
            contributions: totalContributions
        });
    }
    
    return {
        yearsToRetirement,
        totalContributions,
        projectedSavings: savings,
        yearlyData
    };
}

// Update results display
function updateResults(results) {
    document.getElementById('yearsToRetirement').textContent = results.yearsToRetirement;
    document.getElementById('totalContributions').textContent = formatter.format(results.totalContributions);
    document.getElementById('projectedSavings').textContent = formatter.format(results.projectedSavings);
    
    // Calculate monthly income (4% rule)
    const monthlyIncome = (results.projectedSavings * 0.04) / 12;
    document.getElementById('monthlyIncome').textContent = formatter.format(monthlyIncome);
    
    // Update chart
    updateChart(results.yearlyData);
}

// Update chart
function updateChart(data) {
    const ctx = document.getElementById('retirementChart').getContext('2d');
    
    if (retirementChart) {
        retirementChart.destroy();
    }
    
    retirementChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(item => item.year),
            datasets: [
                {
                    label: 'Projected Savings',
                    data: data.map(item => item.savings),
                    borderColor: '#3949ab',
                    backgroundColor: 'rgba(57, 73, 171, 0.1)',
                    fill: true
                },
                {
                    label: 'Total Contributions',
                    data: data.map(item => item.contributions),
                    borderColor: '#7e57c2',
                    backgroundColor: 'rgba(126, 87, 194, 0.1)',
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Retirement Savings Projection'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + formatter.format(context.raw);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatter.format(value);
                        }
                    }
                }
            }
        }
    });
}

// Handle form submission
document.getElementById('retirementForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const currentAge = parseInt(document.getElementById('currentAge').value);
    const retirementAge = parseInt(document.getElementById('retirementAge').value);
    const currentSavings = parseFloat(document.getElementById('currentSavings').value);
    const monthlyContribution = parseFloat(document.getElementById('monthlyContribution').value);
    const expectedReturn = parseFloat(document.getElementById('expectedReturn').value);
    const inflationRate = parseFloat(document.getElementById('inflationRate').value);
    
    if (retirementAge <= currentAge) {
        alert('Retirement age must be greater than current age');
        return;
    }
    
    const results = calculateRetirementSavings(
        currentAge,
        retirementAge,
        currentSavings,
        monthlyContribution,
        expectedReturn,
        inflationRate
    );
    
    updateResults(results);
}); 