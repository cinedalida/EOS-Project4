// Test script
console.log("JavaScript is working!");
console.log("Current page URL:", window.location.href);
console.log(
  "Available form elements:",
  document.querySelectorAll("input, textarea, button")
);

// Data Processing Functions (wala paaa)
function fetchAndProcessData() {
  // 1. Fetch data from Typeform API
  // 2. Clean and structure the data
  // 3. Update Google Sheets
  // 4. Generate insights
  // 5. Update dashboard
}

function cleanResponseData(rawData) {
  // Clean text fields, handle missing values
}

function updateDashboard() {
  // Update the master tracking sheet
}

function createMegaDataset() {
  // Aggregate data across all sprints
}

// Add Custom Menu for One-Click Execution
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu("Sprint Data Automation")
    .addItem("Fetch Latest Data", "fetchAndProcessData")
    .addItem("Generate Reports", "generateReports")
    .addToUi();
}
