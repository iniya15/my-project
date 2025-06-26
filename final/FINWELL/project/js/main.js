// Main application functionality
document.addEventListener('DOMContentLoaded', function() {
  // Get page elements
  const landingPage = document.getElementById('landing-page');
  const quizContainer = document.getElementById('quiz-container');
  const resultsContainer = document.getElementById('results-container');
  const startPlanningBtn = document.getElementById('start-planning-btn');
  const exportPdfBtn = document.getElementById('export-pdf-btn');
  const startOverBtn = document.getElementById('start-over-btn');

  // Start planning button event listener
  startPlanningBtn.addEventListener('click', function() {
    landingPage.classList.add('hidden');
    quizContainer.classList.remove('hidden');
    updateProgress(1); // Initialize progress bar
  });

  // Export to PDF functionality
  exportPdfBtn.addEventListener('click', exportToPdf);

  // Start over button functionality
  startOverBtn.addEventListener('click', function() {
    resultsContainer.classList.add('hidden');
    landingPage.classList.remove('hidden');
    resetForm();
  });

  // Format currency input helper
  window.formatCurrency = function(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Reset all form fields
  function resetForm() {
    const allInputs = document.querySelectorAll('input');
    const allSelects = document.querySelectorAll('select');
    
    allInputs.forEach(input => {
      if (input.type === 'checkbox') {
        input.checked = false;
      } else if (input.type === 'number') {
        input.value = '';
      }
    });
    
    allSelects.forEach(select => {
      select.selectedIndex = 0;
    });
    
    // Reset the visibility of conditional elements
    document.getElementById('debt-details').classList.add('hidden');
    document.getElementById('insurance-details').classList.add('hidden');
    
    // Show step 1, hide others
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
      if (index === 0) {
        step.classList.remove('hidden');
      } else {
        step.classList.add('hidden');
      }
    });
    
    // Reset progress
    updateProgress(1);
  }

  // Export to PDF functionality
  function exportToPdf() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Get the results content
    const content = document.getElementById('results-content');
    
    // Show loading indicator while generating PDF
    const loadingIndicator = document.getElementById('loading-indicator');
    loadingIndicator.classList.remove('hidden');
    document.getElementById('results-content').classList.add('hidden');
    
    // Use html2canvas to capture the content
    html2canvas(content, {
      scale: 1,
      useCORS: true,
      logging: false
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      
      // Add title
      doc.setFontSize(20);
      doc.setTextColor(26, 115, 232); // Primary color
      doc.text('Your Personalized Retirement Plan', 105, 15, { align: 'center' });
      
      // Add date
      doc.setFontSize(10);
      doc.setTextColor(95, 99, 104); // Text medium color
      const today = new Date();
      const dateString = today.toLocaleDateString('en-IN');
      doc.text(`Generated on: ${dateString}`, 105, 22, { align: 'center' });
      
      // Add image of the results
      const imgWidth = doc.internal.pageSize.getWidth() - 20;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      doc.addImage(imgData, 'PNG', 10, 30, imgWidth, imgHeight);
      
      // Add footer
      doc.setFontSize(8);
      doc.setTextColor(95, 99, 104);
      doc.text('This retirement plan is for informational purposes only. Please consult with a financial advisor.', 105, 285, { align: 'center' });
      
      // Save the PDF
      doc.save('retirement-plan.pdf');
      
      // Hide loading indicator
      loadingIndicator.classList.add('hidden');
      document.getElementById('results-content').classList.remove('hidden');
    });
  }
});