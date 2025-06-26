// Results display functionality
document.addEventListener('DOMContentLoaded', function() {
  // Set up any results page specific functionality
});

// Display retirement plan results
function displayResults(planData, formData) {
  // Hide loading indicator and show results
  document.getElementById('loading-indicator').classList.add('hidden');
  document.getElementById('results-content').classList.remove('hidden');
  
  // Monthly Saving Goal
  document.getElementById('monthly-saving-content').innerHTML = `
    <div class="result-highlight">
      <h4>Recommended Monthly Savings</h4>
      <p class="amount">₹${planData.monthlySavingsGoal.amount.toLocaleString('en-IN')}</p>
    </div>
    <p>${planData.monthlySavingsGoal.explanation}</p>
  `;
  
  // Investment Recommendations
  let investmentHtml = `<p>${planData.investments.explanation}</p><div class="recommendation-list">`;
  planData.investments.recommended.forEach(investment => {
    investmentHtml += `
      <div class="recommendation-item">
        <div class="recommendation-header">
          <span class="name">${investment.name}</span>
          <span class="percentage">${investment.percentage}%</span>
        </div>
        <p>${investment.description}</p>
      </div>
    `;
  });
  investmentHtml += '</div>';
  document.getElementById('investment-content').innerHTML = investmentHtml;
  
  // Insurance Suggestions
  let insuranceHtml = `<p>${planData.insurance.explanation}</p><div class="recommendation-list">`;
  planData.insurance.recommendations.forEach(insurance => {
    insuranceHtml += `
      <div class="recommendation-item">
        <div class="recommendation-header">
          <span class="name">${insurance.type}</span>
          <span class="coverage">₹${insurance.coverage.toLocaleString('en-IN')}</span>
        </div>
        <p>${insurance.description}</p>
      </div>
    `;
  });
  insuranceHtml += '</div>';
  document.getElementById('insurance-content').innerHTML = insuranceHtml;
  
  // Gap Analysis
  document.getElementById('gap-content').innerHTML = `
    <div class="gap-analysis">
      <div class="gap-item">
        <span class="label">Current Savings:</span>
        <span class="value">₹${planData.gapAnalysis.currentSavings.toLocaleString('en-IN')}</span>
      </div>
      <div class="gap-item">
        <span class="label">Projected Future Value:</span>
        <span class="value">₹${planData.gapAnalysis.projectedSavings.toLocaleString('en-IN')}</span>
      </div>
      <div class="gap-item">
        <span class="label">Required Retirement Corpus:</span>
        <span class="value">₹${planData.gapAnalysis.corpusNeeded.toLocaleString('en-IN')}</span>
      </div>
      <div class="gap-item highlight">
        <span class="label">Additional Savings Needed:</span>
        <span class="value">₹${planData.gapAnalysis.additionalNeeded.toLocaleString('en-IN')}</span>
      </div>
      <div class="gap-item highlight">
        <span class="label">Additional Monthly Savings Required:</span>
        <span class="value">₹${planData.gapAnalysis.monthlySavingsGap.toLocaleString('en-IN')}</span>
      </div>
    </div>
    <p>${planData.gapAnalysis.explanation}</p>
  `;
  
  // Progress Tracker
  document.getElementById('progress-content').innerHTML = `
    <div class="progress-visual">
      <div class="progress-fill" style="width: ${planData.progressTracker.percentage}%"></div>
      <div class="progress-label">${planData.progressTracker.percentage}%</div>
    </div>
    <p>${planData.progressTracker.explanation}</p>
    <p>Continue to save regularly and increase your contributions to stay on track with your retirement goals.</p>
  `;
  
  // Spending vs. Saving Trends
  document.getElementById('spending-content').innerHTML = `
    <div class="spending-saving-analysis">
      <div class="analysis-item">
        <span class="label">Monthly Income:</span>
        <span class="value">₹${planData.spendingVsSaving.income.toLocaleString('en-IN')}</span>
      </div>
      <div class="analysis-item">
        <span class="label">Monthly Expenses:</span>
        <span class="value">₹${planData.spendingVsSaving.expenses.toLocaleString('en-IN')}</span>
      </div>
      <div class="analysis-item highlight">
        <span class="label">Monthly Surplus:</span>
        <span class="value">₹${planData.spendingVsSaving.surplus.toLocaleString('en-IN')}</span>
      </div>
      <div class="analysis-item highlight">
        <span class="label">Current Saving Rate:</span>
        <span class="value">${planData.spendingVsSaving.savingRate}%</span>
      </div>
    </div>
    <p>${planData.spendingVsSaving.recommendation}</p>
  `;
  
  // Emergency Fund Planning
  document.getElementById('emergency-content').innerHTML = `
    <div class="result-highlight">
      <h4>Recommended Emergency Fund</h4>
      <p class="amount">₹${planData.emergencyFund.recommended.toLocaleString('en-IN')}</p>
    </div>
    <p>${planData.emergencyFund.explanation}</p>
    <p>Keep this amount in liquid investments like high-yield savings accounts or liquid funds for quick access in emergencies.</p>
  `;
  
  // Government Schemes & Senior Benefits
  let schemesHtml = `<p>${planData.governmentSchemes.explanation}</p><div class="recommendation-list">`;
  planData.governmentSchemes.recommendations.forEach(scheme => {
    schemesHtml += `
      <div class="recommendation-item">
        <div class="recommendation-header">
          <span class="name">${scheme.name}</span>
        </div>
        <p>${scheme.description}</p>
      </div>
    `;
  });
  schemesHtml += '</div>';
  document.getElementById('government-content').innerHTML = schemesHtml;
  
  // Debt Repayment Plan (if applicable)
  if (formData.hasDebt) {
    document.getElementById('debt-repayment').classList.remove('hidden');
    document.getElementById('debt-content').innerHTML = planData.debtRepayment;
  } else {
    document.getElementById('debt-repayment').classList.add('hidden');
  }
  
  // Add some styling to the results
  const style = document.createElement('style');
  style.textContent = `
    .result-highlight {
      background-color: var(--primary-light);
      padding: var(--spacing-unit) calc(var(--spacing-unit) * 2);
      border-radius: var(--border-radius);
      margin-bottom: calc(var(--spacing-unit) * 2);
      text-align: center;
    }
    
    .amount {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--primary-color);
    }
    
    .recommendation-list {
      margin-top: calc(var(--spacing-unit) * 2);
    }
    
    .recommendation-item {
      margin-bottom: calc(var(--spacing-unit) * 2);
      padding-bottom: calc(var(--spacing-unit) * 2);
      border-bottom: 1px solid var(--border-color);
    }
    
    .recommendation-item:last-child {
      border-bottom: none;
    }
    
    .recommendation-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: var(--spacing-unit);
    }
    
    .recommendation-header .name {
      font-weight: 600;
      color: var(--text-dark);
    }
    
    .recommendation-header .percentage,
    .recommendation-header .coverage {
      font-weight: 600;
      color: var(--primary-color);
    }
    
    .gap-analysis,
    .spending-saving-analysis {
      margin-bottom: calc(var(--spacing-unit) * 2);
    }
    
    .gap-item,
    .analysis-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: var(--spacing-unit);
      padding: var(--spacing-unit);
      border-radius: var(--border-radius);
    }
    
    .gap-item.highlight,
    .analysis-item.highlight {
      background-color: var(--primary-light);
      font-weight: 500;
    }
    
    .gap-item .label,
    .analysis-item .label {
      color: var(--text-medium);
    }
    
    .gap-item .value,
    .analysis-item .value {
      font-weight: 500;
      color: var(--text-dark);
    }
  `;
  document.head.appendChild(style);
}