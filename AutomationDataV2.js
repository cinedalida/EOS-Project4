// Typeform Auto-Fill Script - Customizable Version
let responseCount = 0;
const maxResponses = 25; // Adjust as needed

// Data generators

function getRandomName() {
  const names = [
    "Alex Johnson",
    "Sarah Chen",
    "Mike Rodriguez",
    "Emma Wilson",
    "David Kim",
    "Lisa Thompson",
    "James Brown",
    "Maria Garcia",
    "Kevin Patel",
    "Jessica Lee",
    "Ryan Murphy",
    "Aisha Hassan",
  ];
  return names[Math.floor(Math.random() * names.length)];
}

function getRandomRating() {
  return Math.floor(Math.random() * 5) + 1; // 1-5 rating
}

function getRandomPositiveFeedback() {
  const feedback = [
    "Great sprint! The hands-on exercises really helped me understand the concepts better.",
    "I loved the collaborative approach. Working in pairs made complex topics much easier to grasp.",
    "The pace was perfect - not too slow, not too fast. Very well structured content.",
    "Excellent balance between theory and practice. The project-based learning was engaging.",
    "The facilitator created a very supportive learning environment. Great experience overall.",
  ];
  return feedback[Math.floor(Math.random() * feedback.length)];
}

function getRandomImprovementFeedback() {
  const feedback = [
    "Could benefit from more time for Q&A sessions during the sprint.",
    "Would appreciate more real-world case studies to understand practical applications.",
    "Perhaps consider smaller group sizes for more personalized attention.",
    "More frequent breaks would help maintain focus during longer sessions.",
    "", // Sometimes no improvement feedback
  ];
  return feedback[Math.floor(Math.random() * feedback.length)];
}

// Wait function
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Main automation function - Customized for your Typeform
async function fillTypeformResponse() {
  if (responseCount >= maxResponses) {
    console.log(`✅ Completed ${responseCount} responses!`);
    return;
  }

  try {
    console.log(`📝 Starting response ${responseCount + 1}...`);

    // Wait for page to fully load
    await wait(2000);

    // Since Typeform shows one question at a time, we need to handle each step
    await fillCurrentQuestion();
  } catch (error) {
    console.error("❌ Error filling form:", error);
    // Try to continue
    setTimeout(() => {
      window.location.reload();
      setTimeout(fillTypeformResponse, 3000);
    }, 2000);
  }
}

// Handle filling the current visible question
async function fillCurrentQuestion() {
  console.log("🔍 Analyzing current question...");

  // 1. Check for text input (Name or Sprint name questions)
  const textInput =
    document.querySelector('input[class*="InputField"]') ||
    document.querySelector('input[type="text"]');

  if (textInput) {
    // Determine if it's name or sprint field based on question text
    const questionText = document.body.innerText.toLowerCase();

    if (questionText.includes("name")) {
      textInput.value = getRandomName();
      console.log("✓ Name filled:", textInput.value);
    } else if (questionText.includes("sprint")) {
      textInput.value = getRandomSprintName();
      console.log("✓ Sprint name filled:", textInput.value);
    } else {
      // Default to name if unclear
      textInput.value = getRandomName();
      console.log("✓ Text field filled:", textInput.value);
    }

    textInput.dispatchEvent(new Event("input", { bubbles: true }));
    textInput.dispatchEvent(new Event("change", { bubbles: true }));
    await wait(1000);

    // Click Next/OK button after filling text
    await clickNextButton();
    return;
  }

  // 2. Check for rating/opinion scale (buttons with numbers or rating options)
  const ratingButtons = document.querySelectorAll(
    'button[data-testid*="button"], button[class*="Button"], button:not([class*="ImageTooltip"])'
  );

  if (ratingButtons.length >= 3) {
    // Likely rating scale
    // Filter out non-rating buttons
    const validRatingButtons = Array.from(ratingButtons).filter(
      (btn) =>
        !btn.classList.toString().includes("ImageTooltip") &&
        btn.offsetHeight > 0 && // Visible
        btn.offsetWidth > 0
    );

    if (validRatingButtons.length >= 3) {
      const rating = getRandomRating();
      const buttonIndex = Math.min(rating - 1, validRatingButtons.length - 1);
      const selectedButton = validRatingButtons[buttonIndex];

      selectedButton.click();
      console.log(`✓ Rating ${rating} selected (button ${buttonIndex})`);
      await wait(1500);

      // Auto-advance might happen, or we need to click next
      await wait(2000);
      const stillOnSamePage = document.querySelector(
        'button[data-testid*="button"]'
      );
      if (stillOnSamePage) {
        await clickNextButton();
      }
      return;
    }
  }

  // 3. Check for textarea (feedback questions)
  const textarea = document.querySelector("textarea");
  if (textarea) {
    const questionText = document.body.innerText.toLowerCase();

    if (questionText.includes("enjoy") || questionText.includes("positive")) {
      textarea.value = getRandomPositiveFeedback();
      console.log("✓ Positive feedback filled");
    } else if (
      questionText.includes("improve") ||
      questionText.includes("better")
    ) {
      textarea.value = getRandomImprovementFeedback();
      console.log("✓ Improvement feedback filled");
    } else {
      textarea.value = getRandomPositiveFeedback(); // Default
      console.log("✓ Feedback filled");
    }

    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    textarea.dispatchEvent(new Event("change", { bubbles: true }));
    await wait(1000);

    await clickNextButton();
    return;
  }

  // 4. Check for multiple choice options (including Sprint selection)
  const choiceButtons = document.querySelectorAll(
    'button[role="button"], div[role="button"], button:not([class*="ImageTooltip"])'
  );
  if (choiceButtons.length >= 3) {
    const validChoices = Array.from(choiceButtons).filter(
      (btn) =>
        !btn.classList.toString().includes("ImageTooltip") &&
        btn.offsetHeight > 20 && // Reasonable size
        btn.textContent.trim().length > 0
    );

    if (validChoices.length >= 3) {
      const questionText = document.body.innerText.toLowerCase();

      // Check if this is the sprint selection question
      if (questionText.includes("sprint")) {
        // Look for buttons containing sprint options
        const sprintButtons = validChoices.filter(
          (btn) =>
            btn.textContent.includes("Sprint 2025") ||
            btn.textContent.includes("Q1") ||
            btn.textContent.includes("Q2") ||
            btn.textContent.includes("Q3") ||
            btn.textContent.includes("Q4")
        );

        if (sprintButtons.length > 0) {
          const randomSprint =
            sprintButtons[Math.floor(Math.random() * sprintButtons.length)];
          randomSprint.click();
          console.log("✓ Sprint selected:", randomSprint.textContent.trim());
          await wait(1500);
          return;
        }
      }

      // Handle other multiple choice questions (like learning format)
      const randomChoice =
        validChoices[Math.floor(Math.random() * validChoices.length)];
      randomChoice.click();
      console.log(
        "✓ Multiple choice selected:",
        randomChoice.textContent.trim()
      );
      await wait(1500);
      return;
    }
  }

  // 5. Check if we're at the end (Submit button)
  const submitButton =
    document.querySelector('button[type="submit"]') ||
    Array.from(document.querySelectorAll("button")).find((btn) =>
      btn.textContent.toLowerCase().includes("submit")
    );

  if (submitButton) {
    submitButton.click();
    console.log(`✅ Response ${responseCount + 1} SUBMITTED!`);
    responseCount++;

    // Wait and start new response
    await wait(4000);
    if (responseCount < maxResponses) {
      console.log(`🔄 Starting response ${responseCount + 1}...`);
      window.location.reload();
      setTimeout(fillTypeformResponse, 4000);
    }
    return;
  }

  // If we get here, try to find any "Next" button
  await clickNextButton();
}

// Helper function to find and click Next/Continue/OK buttons
async function clickNextButton() {
  const nextSelectors = [
    'button[data-qa="next-button"]',
    'button:contains("Next")',
    'button:contains("OK")',
    'button:contains("Continue")',
    'button[type="button"]',
  ];

  // Try CSS selectors first
  for (let selector of nextSelectors) {
    try {
      const button = document.querySelector(selector);
      if (button && button.offsetHeight > 0) {
        button.click();
        console.log("✓ Next button clicked");
        await wait(2000);
        setTimeout(fillCurrentQuestion, 2000); // Continue to next question
        return;
      }
    } catch (e) {} // Ignore errors with :contains selector
  }

  // Fallback: find any button that looks like "Next"
  const allButtons = document.querySelectorAll("button");
  const nextButton = Array.from(allButtons).find((btn) => {
    const text = btn.textContent.toLowerCase().trim();
    return (
      (text.includes("next") ||
        text.includes("continue") ||
        text.includes("ok") ||
        text === "→") &&
      !btn.classList.toString().includes("ImageTooltip") &&
      btn.offsetHeight > 0
    );
  });

  if (nextButton) {
    nextButton.click();
    console.log("✓ Next button clicked (fallback)");
    await wait(2000);
    setTimeout(fillCurrentQuestion, 2000);
  } else {
    console.log("⚠️ No Next button found, waiting...");
    await wait(2000);
    setTimeout(fillCurrentQuestion, 2000);
  }
}

// Helper function to inspect current form state
function inspectCurrentForm() {
  console.log("=== CURRENT FORM INSPECTION ===");
  console.log("Text inputs:", document.querySelectorAll('input[type="text"]'));
  console.log("Textareas:", document.querySelectorAll("textarea"));
  console.log("All buttons:", document.querySelectorAll("button"));
  console.log("Elements with data-qa:", document.querySelectorAll("[data-qa]"));
  console.log("Form elements:", document.querySelectorAll("form *"));
}

// Start the automation
console.log("🚀 Starting Typeform automation...");
console.log("📊 Target responses:", maxResponses);
console.log("");

// First inspect the form
inspectCurrentForm();

// Start filling after inspection
setTimeout(fillTypeformResponse, 2000);
