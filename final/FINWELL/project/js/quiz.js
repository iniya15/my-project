// Quiz functionality
document.addEventListener('DOMContentLoaded', function() {
  // Get all steps
  const steps = document.querySelectorAll('.step');
  const totalSteps = steps.length;
  document.getElementById('total-steps').textContent = totalSteps;
  
  // Next and previous buttons
  const nextButtons = document.querySelectorAll('.next-btn');
  const prevButtons = document.querySelectorAll('.prev-btn');
  const generatePlanBtn = document.getElementById('generate-plan-btn');
  
  // Conditional display elements
  const hasDebtSelect = document.getElementById('has-debt');
  const debtDetails = document.getElementById('debt-details');
  const hasInsuranceSelect = document.getElementById('has-insurance');
  const insuranceDetails = document.getElementById('insurance-details');
  
  // Set up next button click handlers
  nextButtons.forEach((button, index) => {
    button.addEventListener('click', function() {
      if (validateStep(index + 1)) {
        steps[index].classList.add('hidden');
        steps[index + 1].classList.remove('hidden');
        updateProgress(index + 2);
      }
    });
  });
  
  // Set up previous button click handlers
  prevButtons.forEach((button, index) => {
    button.addEventListener('click', function() {
      steps[index + 1].classList.add('hidden');
      steps[index].classList.remove('hidden');
      updateProgress(index + 1);
    });
  });
  
  // Generate plan button click handler
  generatePlanBtn.addEventListener('click', function() {
    if (validateStep(totalSteps)) {
      const formData = collectFormData();
      document.getElementById('quiz-container').classList.add('hidden');
      document.getElementById('results-container').classList.remove('hidden');
      document.getElementById('loading-indicator').classList.remove('hidden');
      
      // Call OpenAI API to generate the plan
      generateRetirementPlan(formData);
    }
  });
  
  // Show/hide debt details based on selection
  hasDebtSelect.addEventListener('change', function() {
    if (this.value === 'yes') {
      debtDetails.classList.remove('hidden');
    } else {
      debtDetails.classList.add('hidden');
    }
  });
  
  // Show/hide insurance details based on selection
  hasInsuranceSelect.addEventListener('change', function() {
    if (this.value === 'yes') {
      insuranceDetails.classList.remove('hidden');
    } else {
      insuranceDetails.classList.add('hidden');
    }
  });
  
  // Validate step inputs
  function validateStep(stepNumber) {
    const step = document.getElementById(`step-${stepNumber}`);
    const requiredInputs = step.querySelectorAll('input[type="number"]:not([id="interest-rate"])');
    let isValid = true;
    
    requiredInputs.forEach(input => {
      // Skip validation for conditional sections that are hidden
      if (input.closest('#debt-details') && debtDetails.classList.contains('hidden')) {
        return;
      }
      if (input.closest('#insurance-details') && insuranceDetails.classList.contains('hidden')) {
        return;
      }
      
      if (!input.value) {
        input.style.borderColor = 'var(--error-color)';
        isValid = false;
        
        // Add error message if not already present
        if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('error-message')) {
          const errorMsg = document.createElement('div');
          errorMsg.className = 'error-message';
          errorMsg.style.color = 'var(--error-color)';
          errorMsg.style.fontSize = '0.8rem';
          errorMsg.style.marginTop = '4px';
          errorMsg.textContent = 'This field is required';
          input.parentNode.insertBefore(errorMsg, input.nextSibling);
        }
      } else {
        input.style.borderColor = 'var(--border-color)';
        
        // Remove error message if exists
        if (input.nextElementSibling && input.nextElementSibling.classList.contains('error-message')) {
          input.parentNode.removeChild(input.nextElementSibling);
        }
      }
    });
    
    return isValid;
  }
  
  // Update progress bar
  window.updateProgress = function(currentStep) {
    document.getElementById('current-step').textContent = currentStep;
    const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
    document.getElementById('progress-indicator').style.width = `${progressPercentage}%`;
  };
  
  // Collect all form data
  function collectFormData() {
    const formData = {
      // Basic Information
      age: parseInt(document.getElementById('age').value) || 30,
      retirementAge: parseInt(document.getElementById('retirement-age').value) || 60,
      monthlyIncome: parseInt(document.getElementById('monthly-income').value) || 50000,
      monthlyExpenses: parseInt(document.getElementById('monthly-expenses').value) || 30000,
      currentSavings: parseInt(document.getElementById('current-savings').value) || 500000,
      riskTolerance: document.getElementById('risk-tolerance').value,
      
      // Retirement Lifestyle
      lifestyle: document.getElementById('lifestyle').value,
      lifeExpectancy: parseInt(document.getElementById('life-expectancy').value) || 85,
      currentRetirementContribution: parseInt(document.getElementById('current-retirement-contribution').value) || 0,
      
      // Investment Preferences
      investmentPreferences: {
        mutualFunds: document.getElementById('investment-mutual-funds').checked,
        ppf: document.getElementById('investment-ppf').checked,
        nps: document.getElementById('investment-nps').checked,
        fd: document.getElementById('investment-fd').checked,
        stocks: document.getElementById('investment-stocks').checked,
        realEstate: document.getElementById('investment-real-estate').checked
      },
      investmentKnowledge: document.getElementById('investment-knowledge').value,
      
      // Debt Information
      hasDebt: document.getElementById('has-debt').value === 'yes',
      debtAmount: parseInt(document.getElementById('debt-amount').value) || 0,
      emiAmount: parseInt(document.getElementById('emi-amount').value) || 0,
      interestRate: parseFloat(document.getElementById('interest-rate').value) || 0,
      
      // Insurance Information
      hasInsurance: document.getElementById('has-insurance').value === 'yes',
      insuranceTypes: {
        life: document.getElementById('insurance-life').checked,
        term: document.getElementById('insurance-term').checked,
        health: document.getElementById('insurance-health').checked
      },
      dependents: parseInt(document.getElementById('dependents').value) || 0,
      
      // Emergency Fund Planning
      familyMembers: parseInt(document.getElementById('family-members').value) || 1,
      emergencyExpense: parseInt(document.getElementById('emergency-expense').value) || 0,
      
      // Government Schemes
      state: document.getElementById('state').value,
      employmentType: document.getElementById('employment-type').value
    };
    
    return formData;
  }
});