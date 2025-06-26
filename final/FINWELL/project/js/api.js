// OpenAI API integration
async function generateRetirementPlan(formData) {
  try {
    // Format the selected investment preferences
    const selectedInvestments = Object.entries(formData.investmentPreferences)
      .filter(([_, selected]) => selected)
      .map(([name, _]) => {
        // Convert camelCase to readable text
        return name
          .replace('ppf', 'PPF')
          .replace('nps', 'NPS')
          .replace('fd', 'Fixed Deposits')
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase());
      });
    
    // Format the selected insurance types
    const selectedInsurance = Object.entries(formData.insuranceTypes)
      .filter(([_, selected]) => selected)
      .map(([name, _]) => {
        return name.charAt(0).toUpperCase() + name.slice(1) + ' Insurance';
      });
    
    // Calculate years until retirement
    const yearsUntilRetirement = formData.retirementAge - formData.age;
    
    // Create a comprehensive prompt for OpenAI
    const prompt = `
      Generate a personalized retirement plan for an Indian citizen with the following information:
      
      BASIC INFORMATION:
      - Age: ${formData.age}
      - Planned retirement age: ${formData.retirementAge} (${yearsUntilRetirement} years until retirement)
      - Monthly income: ₹${formData.monthlyIncome}
      - Monthly expenses: ₹${formData.monthlyExpenses}
      - Current savings: ₹${formData.currentSavings}
      - Risk tolerance: ${formData.riskTolerance}
      
      RETIREMENT LIFESTYLE:
      - Expected lifestyle: ${formData.lifestyle}
      - Expected life expectancy: ${formData.lifeExpectancy} years
      - Current monthly retirement contributions: ₹${formData.currentRetirementContribution}
      
      INVESTMENT PREFERENCES:
      - Preferred investment types: ${selectedInvestments.join(', ') || 'None specified'}
      - Investment knowledge level: ${formData.investmentKnowledge}
      
      DEBT INFORMATION:
      - Has debt: ${formData.hasDebt ? 'Yes' : 'No'}
      ${formData.hasDebt ? `- Total debt amount: ₹${formData.debtAmount}
      - Monthly EMI: ₹${formData.emiAmount}
      - Interest rate: ${formData.interestRate}%` : ''}
      
      INSURANCE INFORMATION:
      - Has insurance: ${formData.hasInsurance ? 'Yes' : 'No'}
      ${formData.hasInsurance ? `- Insurance types: ${selectedInsurance.join(', ') || 'None specified'}` : ''}
      - Number of dependents: ${formData.dependents}
      
      EMERGENCY FUND PLANNING:
      - Number of family members: ${formData.familyMembers}
      - Estimated monthly emergency expense: ₹${formData.emergencyExpense}
      
      GOVERNMENT SCHEMES & BENEFITS:
      - State/Region: ${formData.state}
      - Employment type: ${formData.employmentType}
      
      Based on this information, please provide a comprehensive retirement plan with the following sections:
      
      1. Monthly Saving Goal (pre-retirees): Recommend a specific amount with explanation.
      
      2. Investment Recommendations: Based on their risk tolerance and preferences, suggest specific investment allocations. Include PPF, NPS, mutual funds, etc. with percentages.
      
      3. Insurance Suggestions: Recommend appropriate insurance types and coverage amounts based on their situation.
      
      4. Gap Analysis: Calculate how much more needs to be saved to achieve their retirement goals.
      
      5. Progress Tracker: Provide a simple text-based progress indicator showing how close they are to their retirement goal.
      
      6. Spending vs. Saving Trends: Analyze their current spending vs. saving habits with recommendations.
      
      7. Emergency Fund Planning: Recommend an appropriate emergency fund size.
      
      8. Government Schemes & Senior Benefits: Suggest relevant Indian government schemes and benefits.
      
      ${formData.hasDebt ? '9. Debt Repayment Plan: Provide a strategy to repay their debt efficiently.' : ''}
      
      Please be specific with numbers and recommendations. All amounts should be in Indian Rupees (₹).
    `;
    
    // Mock API call - Replace with actual OpenAI API call in production
    console.log("Sending request to OpenAI API...");
    console.log("Prompt:", prompt);
    
    // For the demo, we'll use a mock response after a delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock response - This would be replaced with actual API call
    const mockResponse = generateMockResponse(formData);
    
    // Display the results
    displayResults(mockResponse, formData);
    
  } catch (error) {
    console.error("Error generating retirement plan:", error);
    // Show error message to user
    document.getElementById('loading-indicator').classList.add('hidden');
    document.getElementById('results-content').classList.remove('hidden');
    document.getElementById('monthly-saving-content').innerHTML = 
      `<p class="error">Sorry, there was an error generating your retirement plan. Please try again later.</p>`;
  }
}

// Generate a mock response (This would be replaced with actual OpenAI API call in production)
function generateMockResponse(formData) {
  // Calculate years until retirement
  const yearsUntilRetirement = formData.retirementAge - formData.age;
  
  // Calculate monthly savings needed
  const monthlyIncome = formData.monthlyIncome;
  const monthlyExpenses = formData.monthlyExpenses;
  const currentSavings = formData.currentSavings;
  
  // Estimate retirement corpus needed (assuming 80% of current expenses for retirement)
  const inflationRate = 0.06; // 6% annual inflation
  const returnRate = formData.riskTolerance === 'high' ? 0.12 : (formData.riskTolerance === 'medium' ? 0.09 : 0.07);
  
  // Estimate expenses at retirement (accounting for inflation)
  const retirementExpenses = monthlyExpenses * Math.pow(1 + inflationRate, yearsUntilRetirement) * 0.8;
  
  // Estimate years in retirement
  const yearsInRetirement = formData.lifeExpectancy - formData.retirementAge;
  
  // Estimate corpus needed (simplified calculation)
  const corpusNeeded = retirementExpenses * 12 * yearsInRetirement;
  
  // Calculate how much current savings will grow to
  const futureSavings = currentSavings * Math.pow(1 + returnRate, yearsUntilRetirement);
  
  // Calculate additional savings needed
  const additionalSavingsNeeded = corpusNeeded - futureSavings;
  
  // Calculate monthly savings required
  const monthlyPaymentFactor = (Math.pow(1 + returnRate/12, yearsUntilRetirement * 12) - 1) / (returnRate/12);
  const monthlySavingsNeeded = additionalSavingsNeeded / monthlyPaymentFactor;
  
  // Calculate current surplus
  const currentSurplus = monthlyIncome - monthlyExpenses;
  
  // Calculate gap
  const savingsGap = monthlySavingsNeeded - formData.currentRetirementContribution;
  
  // Calculate progress percentage
  const currentProgress = Math.min(100, Math.max(0, Math.round((currentSavings / (corpusNeeded * 0.1)) * 100)));
  
  // Recommended emergency fund
  const recommendedEmergencyFund = formData.emergencyExpense > 0 
    ? formData.emergencyExpense * 6 
    : monthlyExpenses * 6;
  
  // Generate debt repayment plan if applicable
  let debtPlan = "";
  if (formData.hasDebt) {
    const debtPayoffMonths = Math.ceil(formData.debtAmount / formData.emiAmount);
    const totalInterestPaid = (formData.emiAmount * debtPayoffMonths) - formData.debtAmount;
    const acceleratedPayment = formData.emiAmount * 1.2;
    const acceleratedPayoffMonths = Math.ceil(formData.debtAmount / acceleratedPayment);
    const acceleratedInterestPaid = (acceleratedPayment * acceleratedPayoffMonths) - formData.debtAmount;
    const interestSaved = totalInterestPaid - acceleratedInterestPaid;
    
    debtPlan = `
      <h4>Current Debt Situation</h4>
      <p>Outstanding Debt: ₹${formData.debtAmount.toLocaleString('en-IN')}</p>
      <p>Current EMI: ₹${formData.emiAmount.toLocaleString('en-IN')}</p>
      <p>Estimated Payoff Time: ${debtPayoffMonths} months (${Math.floor(debtPayoffMonths/12)} years and ${debtPayoffMonths%12} months)</p>
      
      <h4>Accelerated Repayment Plan</h4>
      <p>By increasing your monthly payment to ₹${acceleratedPayment.toLocaleString('en-IN')}, you could:</p>
      <ul>
        <li>Pay off your debt in ${acceleratedPayoffMonths} months (${Math.floor(acceleratedPayoffMonths/12)} years and ${acceleratedPayoffMonths%12} months)</li>
        <li>Save approximately ₹${interestSaved.toLocaleString('en-IN')} in interest</li>
      </ul>
      
      <h4>Debt Repayment Strategy</h4>
      <p>1. Focus on high-interest debts first</p>
      <p>2. Consider consolidating multiple loans if possible</p>
      <p>3. Use any windfalls (bonuses, tax refunds) to make extra payments</p>
    `;
  }
  
  // Return the mock response
  return {
    monthlySavingsGoal: {
      amount: Math.round(monthlySavingsNeeded),
      explanation: `Based on your current age (${formData.age}), planned retirement age (${formData.retirementAge}), and expected lifestyle in retirement (${formData.lifestyle}), you should aim to save approximately ₹${Math.round(monthlySavingsNeeded).toLocaleString('en-IN')} per month for retirement.`
    },
    investments: {
      recommended: generateInvestmentRecommendations(formData),
      explanation: `This allocation is based on your ${formData.riskTolerance} risk tolerance, ${yearsUntilRetirement} years until retirement, and stated investment preferences.`
    },
    insurance: {
      recommendations: generateInsuranceRecommendations(formData),
      explanation: `These recommendations are based on your family situation, with ${formData.dependents} dependents and your current income of ₹${formData.monthlyIncome.toLocaleString('en-IN')} per month.`
    },
    gapAnalysis: {
      currentSavings: currentSavings,
      projectedSavings: Math.round(futureSavings),
      corpusNeeded: Math.round(corpusNeeded),
      additionalNeeded: Math.round(additionalSavingsNeeded),
      monthlySavingsGap: Math.round(savingsGap),
      explanation: `To achieve your retirement goals, you need to save an additional ₹${Math.round(savingsGap).toLocaleString('en-IN')} per month compared to your current contributions.`
    },
    progressTracker: {
      percentage: currentProgress,
      explanation: `You are approximately ${currentProgress}% of the way towards your initial retirement savings target.`
    },
    spendingVsSaving: {
      income: monthlyIncome,
      expenses: monthlyExpenses,
      surplus: currentSurplus,
      savingRate: Math.round((currentSurplus / monthlyIncome) * 100),
      recommendation: `Your current saving rate is ${Math.round((currentSurplus / monthlyIncome) * 100)}% of your income. Ideally, you should aim for 20-30% for retirement planning.`
    },
    emergencyFund: {
      recommended: recommendedEmergencyFund,
      explanation: `Based on your family size of ${formData.familyMembers} and monthly expenses, you should maintain an emergency fund of ₹${recommendedEmergencyFund.toLocaleString('en-IN')}, which covers 6 months of expenses.`
    },
    governmentSchemes: {
      recommendations: generateGovernmentSchemeRecommendations(formData),
      explanation: `These schemes are relevant based on your age, employment status (${formData.employmentType}), and location (${formData.state}).`
    },
    debtRepayment: debtPlan
  };
}

// Helper function to generate investment recommendations
function generateInvestmentRecommendations(formData) {
  const yearsUntilRetirement = formData.retirementAge - formData.age;
  let recommendations = [];
  
  if (formData.riskTolerance === 'high') {
    recommendations = [
      { name: "Equity Mutual Funds", percentage: 60, description: "Focus on diversified equity funds for long-term growth" },
      { name: "NPS Tier 1", percentage: 15, description: "Tax-efficient retirement savings with equity component" },
      { name: "PPF", percentage: 10, description: "For tax benefits and safe returns" },
      { name: "Corporate Bonds", percentage: 10, description: "For higher fixed returns than traditional FDs" },
      { name: "Gold ETFs", percentage: 5, description: "For diversification and inflation hedge" }
    ];
  } else if (formData.riskTolerance === 'medium') {
    recommendations = [
      { name: "Equity Mutual Funds", percentage: 40, description: "Balanced and large-cap funds for controlled growth" },
      { name: "Debt Mutual Funds", percentage: 25, description: "For stable returns with moderate risk" },
      { name: "PPF", percentage: 15, description: "For tax benefits and safe returns" },
      { name: "NPS Tier 1", percentage: 15, description: "Balanced allocation for retirement savings" },
      { name: "Fixed Deposits", percentage: 5, description: "For stable and guaranteed returns" }
    ];
  } else {
    recommendations = [
      { name: "PPF", percentage: 30, description: "For tax benefits and safe returns" },
      { name: "Debt Mutual Funds", percentage: 30, description: "Low-risk funds for stable returns" },
      { name: "Fixed Deposits", percentage: 20, description: "For guaranteed returns" },
      { name: "Senior Citizen Savings Scheme", percentage: 10, description: "Higher interest rates for senior citizens" },
      { name: "NPS Tier 1", percentage: 10, description: "Conservative allocation for retirement savings" }
    ];
  }
  
  return recommendations;
}

// Helper function to generate insurance recommendations
function generateInsuranceRecommendations(formData) {
  const monthlyIncome = formData.monthlyIncome;
  const dependents = formData.dependents;
  let recommendations = [];
  
  // Term Life Insurance
  const lifeInsuranceCover = dependents > 0 ? Math.max(20000000, monthlyIncome * 12 * 10) : 0;
  
  // Health Insurance
  const baseHealthCover = 500000;
  const additionalPerDependent = 200000;
  const healthInsuranceCover = baseHealthCover + (additionalPerDependent * dependents);
  
  if (dependents > 0) {
    recommendations.push({
      type: "Term Life Insurance",
      coverage: lifeInsuranceCover,
      description: `You should have a term life insurance with a cover of approximately ₹${lifeInsuranceCover.toLocaleString('en-IN')} to protect your dependents.`
    });
  }
  
  recommendations.push({
    type: "Health Insurance",
    coverage: healthInsuranceCover,
    description: `A family floater health insurance policy with coverage of ₹${healthInsuranceCover.toLocaleString('en-IN')} is recommended for you and your family.`
  });
  
  if (formData.age > 45) {
    recommendations.push({
      type: "Critical Illness Cover",
      coverage: 2000000,
      description: "As you're approaching retirement age, a critical illness cover is important to protect against major illnesses."
    });
  }
  
  return recommendations;
}

// Helper function to generate government scheme recommendations
function generateGovernmentSchemeRecommendations(formData) {
  let recommendations = [];
  
  // Common schemes regardless of age or employment
  recommendations.push({
    name: "Pradhan Mantri Vaya Vandana Yojana (PMVVY)",
    description: "A pension scheme for senior citizens that provides regular pension."
  });
  
  recommendations.push({
    name: "Sukanya Samriddhi Yojana",
    description: "If you have a girl child, this scheme offers excellent returns for her future."
  });
  
  // For salaried employees
  if (formData.employmentType === 'salaried') {
    recommendations.push({
      name: "Employees' Provident Fund (EPF)",
      description: "Make sure you're maximizing your EPF contributions for tax-efficient retirement savings."
    });
  }
  
  // For self-employed
  if (formData.employmentType === 'self-employed') {
    recommendations.push({
      name: "Atal Pension Yojana",
      description: "A pension scheme aimed at workers in the unorganized sector."
    });
  }
  
  // For all
  recommendations.push({
    name: "National Pension System (NPS)",
    description: "A voluntary, long-term retirement savings scheme with tax benefits under 80C and 80CCD(1B)."
  });
  
  return recommendations;
}