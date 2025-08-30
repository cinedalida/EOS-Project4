// =============================================================================
// TYPEFORM GOOGLE SHEETS INTEGRATION
// Complete Google Apps Script implementation for automated data processing
// =============================================================================

// Configuration - Replace with your actual values
const CONFIG = {
  TYPEFORM_TOKEN: "YOUR_TYPEFORM",
  FORM_ID: "YOUR_FORM_ID",
  SHEET_NAMES: {
    RAW_DATA: "Raw Data",
    PROCESSED_DATA: "Processed Data",
    DASHBOARD: "Dashboard",
    MEGA_DATASET: "Mega Dataset",
  },
  API_BASE_URL: "https://api.typeform.com",
};

// =============================================================================
// PHASE 3.1: Basic Typeform Connection
// =============================================================================

/**
 * Test script to verify Typeform API connection
 */
function testTypeformConnection() {
  try {
    console.log("Testing Typeform connection...");

    const response = UrlFetchApp.fetch(
      `${CONFIG.API_BASE_URL}/forms/${CONFIG.FORM_ID}/responses?page_size=1`,
      {
        headers: {
          Authorization: `Bearer ${CONFIG.TYPEFORM_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.getResponseCode() !== 200) {
      throw new Error(
        `API Error: ${response.getResponseCode()} - ${response.getContentText()}`
      );
    }

    const data = JSON.parse(response.getContentText());
    console.log("✅ Connection successful!");
    console.log("Total responses:", data.total_items);

    if (data.items && data.items.length > 0) {
      console.log("First response preview:", {
        id: data.items[0].response_id,
        submitted_at: data.items[0].submitted_at,
        answers_count: data.items[0].answers ? data.items[0].answers.length : 0,
      });
    }

    return true;
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
    SpreadsheetApp.getUi().alert(
      "Connection Error",
      error.message,
      SpreadsheetApp.getUi().Button.OK
    );
    return false;
  }
}

// =============================================================================
// PHASE 3.2: Data Processing Functions
// =============================================================================

/**
 * Main function to fetch and process all Typeform data
 */
function fetchAndProcessData() {
  try {
    console.log("🚀 Starting data fetch and processing...");

    // Step 1: Fetch data from Typeform API
    const rawData = fetchTypeformData();
    if (!rawData || rawData.length === 0) {
      console.log("No new data to process");
      return;
    }

    // Step 2: Clean and structure the data
    const cleanedData = cleanResponseData(rawData);

    // Step 3: Update Google Sheets
    updateRawDataSheet(rawData);
    updateProcessedDataSheet(cleanedData);

    // Step 4: Generate insights
    const insights = generateInsights(cleanedData);

    // Step 5: Update dashboard
    updateDashboard(insights);

    // Step 6: Update mega dataset
    createMegaDataset(cleanedData);

    console.log("✅ Data processing completed successfully!");
    SpreadsheetApp.getUi().alert(
      "Success",
      "Data has been updated successfully!",
      SpreadsheetApp.getUi().Button.OK
    );
  } catch (error) {
    console.error("❌ Error in fetchAndProcessData:", error);
    SpreadsheetApp.getUi().alert(
      "Error",
      `Processing failed: ${error.message}`,
      SpreadsheetApp.getUi().Button.OK
    );
  }
}

/**
 * Fetch all responses from Typeform API with pagination
 */
function fetchTypeformData() {
  const allResponses = [];
  let pageToken = null;
  const pageSize = 1000; // Max allowed by Typeform

  try {
    do {
      let url = `${CONFIG.API_BASE_URL}/forms/${CONFIG.FORM_ID}/responses?page_size=${pageSize}`;
      if (pageToken) {
        url += `&before=${pageToken}`;
      }

      const response = UrlFetchApp.fetch(url, {
        headers: {
          Authorization: `Bearer ${CONFIG.TYPEFORM_TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      if (response.getResponseCode() !== 200) {
        throw new Error(`API Error: ${response.getResponseCode()}`);
      }

      const data = JSON.parse(response.getContentText());
      allResponses.push(...data.items);

      pageToken =
        data.items.length === pageSize
          ? data.items[data.items.length - 1].token
          : null;

      console.log(
        `Fetched ${data.items.length} responses. Total so far: ${allResponses.length}`
      );

      // Rate limiting - be nice to the API
      if (pageToken) {
        Utilities.sleep(100);
      }
    } while (pageToken);

    console.log(`✅ Total responses fetched: ${allResponses.length}`);
    return allResponses;
  } catch (error) {
    console.error("Error fetching Typeform data:", error);
    throw error;
  }
}

/**
 * Clean and normalize response data
 */
function cleanResponseData(rawData) {
  console.log("🧹 Cleaning response data...");

  return rawData.map((response) => {
    const cleaned = {
      response_id: response.response_id || "",
      submitted_at: response.submitted_at || "",
      landing_id: response.landing_id || "",
      token: response.token || "",
      metadata: response.metadata || {},
      answers: {},
    };

    // Process answers
    if (response.answers && Array.isArray(response.answers)) {
      response.answers.forEach((answer) => {
        const fieldId = answer.field.id;
        let value = "";

        // Handle different answer types
        switch (answer.type) {
          case "text":
          case "email":
          case "url":
            value = cleanTextValue(answer.text || "");
            break;
          case "number":
            value = answer.number || 0;
            break;
          case "boolean":
            value = answer.boolean || false;
            break;
          case "choice":
            value = answer.choice
              ? answer.choice.label || answer.choice.other || ""
              : "";
            break;
          case "choices":
            value = answer.choices
              ? answer.choices.map((c) => c.label || c.other || "").join(", ")
              : "";
            break;
          case "date":
            value = answer.date || "";
            break;
          case "file_url":
            value = answer.file_url || "";
            break;
          default:
            value = JSON.stringify(answer[answer.type] || "");
        }

        cleaned.answers[fieldId] = value;
      });
    }

    return cleaned;
  });
}

/**
 * Clean text values - remove extra whitespace, handle special characters
 */
function cleanTextValue(text) {
  if (!text || typeof text !== "string") return "";

  return text
    .trim()
    .replace(/\s+/g, " ") // Replace multiple whitespace with single space
    .replace(/[\r\n]+/g, " ") // Replace line breaks with space
    .substring(0, 50000); // Prevent extremely long values that might break sheets
}

/**
 * Update the raw data sheet
 */
function updateRawDataSheet(rawData) {
  console.log("📊 Updating raw data sheet...");

  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAMES.RAW_DATA);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(CONFIG.SHEET_NAMES.RAW_DATA);
  }

  // Clear existing data
  sheet.clear();

  if (rawData.length === 0) return;

  // Create headers
  const headers = [
    "Response ID",
    "Submitted At",
    "Landing ID",
    "Token",
    "Raw JSON",
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");

  // Add data
  const rows = rawData.map((response) => [
    response.response_id,
    response.submitted_at,
    response.landing_id,
    response.token,
    JSON.stringify(response),
  ]);

  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  }

  // Auto-resize columns
  sheet.autoResizeColumns(1, headers.length);
}

/**
 * Update the processed data sheet
 */
function updateProcessedDataSheet(cleanedData) {
  console.log("📊 Updating processed data sheet...");

  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAMES.PROCESSED_DATA);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(CONFIG.SHEET_NAMES.PROCESSED_DATA);
  }

  // Clear existing data
  sheet.clear();

  if (cleanedData.length === 0) return;

  // Get all unique field IDs to create dynamic columns
  const fieldIds = new Set();
  cleanedData.forEach((response) => {
    Object.keys(response.answers).forEach((fieldId) => fieldIds.add(fieldId));
  });

  // Create headers
  const headers = [
    "Response ID",
    "Submitted At",
    "Landing ID",
    "Token",
    ...Array.from(fieldIds),
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");

  // Add data
  const rows = cleanedData.map((response) => {
    const row = [
      response.response_id,
      response.submitted_at,
      response.landing_id,
      response.token,
    ];

    // Add answer values in the same order as headers
    fieldIds.forEach((fieldId) => {
      row.push(response.answers[fieldId] || "");
    });

    return row;
  });

  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  }

  // Auto-resize columns
  sheet.autoResizeColumns(1, headers.length);
}

/**
 * Generate insights from processed data
 */
function generateInsights(cleanedData) {
  console.log("🔍 Generating insights...");

  const insights = {
    totalResponses: cleanedData.length,
    dateRange: {
      earliest: null,
      latest: null,
    },
    responseRate: {
      daily: {},
      weekly: {},
      monthly: {},
    },
    completionStats: {
      completed: 0,
      partial: 0,
    },
  };

  cleanedData.forEach((response) => {
    const submitDate = new Date(response.submitted_at);

    // Date range
    if (
      !insights.dateRange.earliest ||
      submitDate < insights.dateRange.earliest
    ) {
      insights.dateRange.earliest = submitDate;
    }
    if (!insights.dateRange.latest || submitDate > insights.dateRange.latest) {
      insights.dateRange.latest = submitDate;
    }

    // Response rates
    const dateKey = submitDate.toISOString().split("T")[0];
    insights.responseRate.daily[dateKey] =
      (insights.responseRate.daily[dateKey] || 0) + 1;

    // Completion stats (basic check - you might want to customize this)
    const answerCount = Object.keys(response.answers).length;
    if (answerCount > 0) {
      insights.completionStats.completed++;
    } else {
      insights.completionStats.partial++;
    }
  });

  return insights;
}

/**
 * Update the dashboard sheet with insights and summaries
 */
function updateDashboard(insights = null) {
  console.log("📈 Updating dashboard...");

  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAMES.DASHBOARD);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(CONFIG.SHEET_NAMES.DASHBOARD);
  }

  // Clear existing data
  sheet.clear();

  // Create dashboard headers
  sheet.getRange("A1").setValue("SPRINT DATA DASHBOARD");
  sheet.getRange("A1").setFontSize(16).setFontWeight("bold");

  sheet.getRange("A3").setValue("Last Updated:");
  sheet.getRange("B3").setValue(new Date());

  if (insights) {
    sheet.getRange("A5").setValue("SUMMARY STATISTICS");
    sheet.getRange("A5").setFontWeight("bold");

    sheet.getRange("A7").setValue("Total Responses:");
    sheet.getRange("B7").setValue(insights.totalResponses);

    sheet.getRange("A8").setValue("Completed Responses:");
    sheet.getRange("B8").setValue(insights.completionStats.completed);

    sheet.getRange("A9").setValue("Partial Responses:");
    sheet.getRange("B9").setValue(insights.completionStats.partial);

    if (insights.dateRange.earliest && insights.dateRange.latest) {
      sheet.getRange("A11").setValue("Date Range:");
      sheet
        .getRange("B11")
        .setValue(
          `${insights.dateRange.earliest.toDateString()} to ${insights.dateRange.latest.toDateString()}`
        );
    }
  }

  // Auto-resize columns
  sheet.autoResizeColumns(1, 2);
}

/**
 * Create or update the mega dataset by aggregating data across sprints
 */
function createMegaDataset(newData = null) {
  console.log("📚 Creating mega dataset...");

  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAMES.MEGA_DATASET);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(CONFIG.SHEET_NAMES.MEGA_DATASET);
    // Add headers for new sheet
    const headers = [
      "Sprint",
      "Response ID",
      "Submitted At",
      "Data Source",
      "Aggregated At",
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
  }

  if (newData && newData.length > 0) {
    const currentSprint = `Sprint_${new Date().toISOString().split("T")[0]}`;
    const lastRow = sheet.getLastRow();

    const newRows = newData.map((response) => [
      currentSprint,
      response.response_id,
      response.submitted_at,
      "Typeform API",
      new Date(),
    ]);

    sheet.getRange(lastRow + 1, 1, newRows.length, 5).setValues(newRows);
  }

  // Auto-resize columns
  sheet.autoResizeColumns(1, 5);
}

// =============================================================================
// PHASE 3.3: Custom Menu for One-Click Execution
// =============================================================================

/**
 * Create custom menu when spreadsheet opens
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu("🚀 Sprint Data Automation")
    .addItem("🔌 Test Connection", "testTypeformConnection")
    .addSeparator()
    .addItem("📥 Fetch Latest Data", "fetchAndProcessData")
    .addItem("📊 Update Dashboard Only", "updateDashboard")
    .addItem("📚 Refresh Mega Dataset", "createMegaDataset")
    .addSeparator()
    .addItem("📋 Generate Reports", "generateReports")
    .addItem("🔧 Setup Automation", "setupAutomation")
    .addToUi();
}

// =============================================================================
// PHASE 4 & 5: Additional Functions for Automation and Reporting
// =============================================================================

/**
 * Generate comprehensive reports
 */
function generateReports() {
  try {
    console.log("📋 Generating reports...");

    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const processedSheet = spreadsheet.getSheetByName(
      CONFIG.SHEET_NAMES.PROCESSED_DATA
    );

    if (!processedSheet || processedSheet.getLastRow() <= 1) {
      SpreadsheetApp.getUi().alert(
        "No Data",
        "Please fetch data first before generating reports.",
        SpreadsheetApp.getUi().Button.OK
      );
      return;
    }

    // Create or update reports sheet
    let reportsSheet = spreadsheet.getSheetByName("Reports");
    if (!reportsSheet) {
      reportsSheet = spreadsheet.insertSheet("Reports");
    }

    reportsSheet.clear();
    reportsSheet.getRange("A1").setValue("AUTOMATED REPORTS");
    reportsSheet.getRange("A1").setFontSize(16).setFontWeight("bold");

    reportsSheet.getRange("A3").setValue("Generated on:");
    reportsSheet.getRange("B3").setValue(new Date());

    // Add your custom report logic here
    reportsSheet
      .getRange("A5")
      .setValue(
        "Custom reports can be added here based on your specific needs"
      );

    SpreadsheetApp.getUi().alert(
      "Success",
      "Reports generated successfully!",
      SpreadsheetApp.getUi().Button.OK
    );
  } catch (error) {
    console.error("Error generating reports:", error);
    SpreadsheetApp.getUi().alert(
      "Error",
      `Report generation failed: ${error.message}`,
      SpreadsheetApp.getUi().Button.OK
    );
  }
}

/**
 * Setup automation triggers
 */
function setupAutomation() {
  const ui = SpreadsheetApp.getUi();
  const result = ui.alert(
    "Setup Automation",
    "This will create a daily trigger to automatically fetch data. Continue?",
    ui.Button.YES_NO
  );

  if (result === ui.Button.YES) {
    try {
      // Delete existing triggers
      const triggers = ScriptApp.getProjectTriggers();
      triggers.forEach((trigger) => {
        if (trigger.getHandlerFunction() === "fetchAndProcessData") {
          ScriptApp.deleteTrigger(trigger);
        }
      });

      // Create new daily trigger
      ScriptApp.newTrigger("fetchAndProcessData")
        .timeBased()
        .everyDays(1)
        .atHour(9) // 9 AM
        .create();

      ui.alert(
        "Success",
        "Daily automation trigger has been set up for 9 AM!",
        ui.Button.OK
      );
    } catch (error) {
      ui.alert(
        "Error",
        `Failed to setup automation: ${error.message}`,
        ui.Button.OK
      );
    }
  }
}

/**
 * Error handling wrapper for scheduled functions
 */
function scheduledDataFetch() {
  try {
    fetchAndProcessData();
  } catch (error) {
    console.error("Scheduled fetch failed:", error);

    // Optional: Send email notification on failure
    // MailApp.sendEmail({
    //   to: 'your-email@example.com',
    //   subject: 'Sprint Data Automation Failed',
    //   body: `The automated data fetch failed with error: ${error.message}`
    // });
  }
}
