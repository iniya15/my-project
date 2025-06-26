// Helper: Indian Numbering Format
function indianNumberingFormat(number) {
  if (number >= 10000000) {
    return `Rs ${(number / 10000000).toFixed(2)} Crore`;
  } else if (number >= 100000) {
    return `Rs ${(number / 100000).toFixed(2)} Lakh`;
  } else if (number >= 1000) {
    return `Rs ${(number / 1000).toFixed(2)} Thousand`;
  } else {
    return `Rs ${number.toFixed(2)}`;
  }
}

function calculateReadiness(currentAge, retirementAge, income, expenses, savings, riskTolerance) {
  const yearsToRetirement = retirementAge - currentAge;
  if (yearsToRetirement <= 0) {
    return [10, savings, expenses * 12 * 1.1 * 20];
  }
  const annualSavings = Math.max((income - expenses), 0) * 12;
  let investmentReturn = 0.05;
  riskTolerance = riskTolerance.toLowerCase();
  if (riskTolerance === "low") investmentReturn = 0.03;
  else if (riskTolerance === "medium") investmentReturn = 0.07;
  else if (riskTolerance === "high") investmentReturn = 0.09;

  let futureValueSavings = savings * Math.pow(1 + investmentReturn, yearsToRetirement);
  futureValueSavings += annualSavings * ( (Math.pow(1 + investmentReturn, yearsToRetirement) - 1) / investmentReturn );

  const annualRetirementExpenses = expenses * 12 * 1.1;
  const totalRequired = annualRetirementExpenses * 20;

  let readinessScore = futureValueSavings / totalRequired;
  readinessScore = Math.min(Math.max(readinessScore, 1), 10);

  return [Number(readinessScore.toFixed(2)), futureValueSavings, totalRequired];
}

function personalizedSuggestions(age, retirementAge, income, expenses, savings, riskTolerance) {
  const [score, projected, needed] = calculateReadiness(age, retirementAge, income, expenses, savings, riskTolerance);
  let output = `<div class='result-section' style='display:block;'>`;
  output += `<h3>🧮 Retirement Readiness Score: <b>${score}/10</b></h3>`;
  output += `<div class='result-item'>📈 Projected Savings by Retirement: <b>${indianNumberingFormat(projected)}</b></div>`;
  output += `<div class='result-item'>📉 Estimated Retirement Need: <b>${indianNumberingFormat(needed)}</b></div>`;

  if (score >= 6) {
    output += `<div class='result-item text-success'>✅ You are on a good path. Continue monitoring and adjusting as needed.</div>`;
  } else {
    output += `<div class='result-item text-warning'>⚠️ Suggestions to Improve:<ul>`;
    if (income <= expenses) {
      output += `<li>Your expenses match or exceed your income. Try to cut expenses or increase earnings.</li>`;
    } else if ((income - expenses) / income < 0.2) {
      output += `<li>You are saving less than 20% of your income. Aim to increase your savings rate.</li>`;
    }
    if (savings < 50000 && age > 30) {
      output += `<li>Your savings are below recommended levels for your age. Boost your savings when possible.</li>`;
    }
    if (riskTolerance.toLowerCase() === "low" && score < 5) {
      output += `<li>You chose low-risk investments. Consider medium risk to increase long-term returns, if appropriate.</li>`;
    }
    if (retirementAge - age < 10) {
      output += `<li>You have less than 10 years to retire. Maximize contributions and explore higher-return strategies.</li>`;
    }
    output += `<li>Track your spending habits and stick to a budget.</li>`;
    output += `<li>Set specific retirement goals (age, lifestyle, etc.) and align your plan accordingly.</li>`;
    output += `</ul></div>`;
  }
  output += `</div>`;
  return output;
}

// Handle form submission
window.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('userForm');
  if (!form) return;

  // Create or select result section
  let resultSection = document.querySelector('.result-section');
  if (!resultSection) {
    resultSection = document.createElement('div');
    resultSection.className = 'result-section';
    form.parentNode.appendChild(resultSection);
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const age = parseInt(document.getElementById('ageInput').value, 10);
    const retirementAge = parseInt(document.getElementById('retirementAgeInput').value, 10);
    const income = parseFloat(document.getElementById('incomeInput').value);
    const expenses = parseFloat(document.getElementById('expensesInput').value);
    const savings = parseFloat(document.getElementById('savingsInput').value);
    const risk = document.getElementById('riskToleranceInput').value;

    // Calculate and display results
    resultSection.innerHTML = personalizedSuggestions(age, retirementAge, income, expenses, savings, risk);
    resultSection.style.display = 'block';

    // Save form data and results for dashboard
    const formData = { age, retirementAge, income, expenses, savings, riskTolerance: risk };
    const [score, projected, needed] = calculateReadiness(age, retirementAge, income, expenses, savings, risk);
    const retirementResults = { score, projected, needed };
    localStorage.setItem('formData', JSON.stringify(formData));
    localStorage.setItem('retirementResults', JSON.stringify(retirementResults));
  });
}); 