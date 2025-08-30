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
    await wait(5000);

    // Since Typeform shows one question at a time, we need to handle each step
    await fillCurrentQuestion();
  } catch (error) {
    console.error("❌ Error filling form:", error);
    // Try to continue
    setTimeout(() => {
      window.location.reload();
      setTimeout(fillTypeformResponse, 3000);
    }, 5000);
  }
}

// Handle filling the current visible question
// Fixed text input handler - paste this in console
async function fillCurrentQuestion() {
  console.log("🔍 Analyzing current question...");

  // 1. Check for text input with better handling
  const textInput =
    document.querySelector('input[class*="InputField"]') ||
    document.querySelector('input[type="text"]');

  if (textInput) {
    const questionText = document.body.innerText.toLowerCase();
    let answer = getRandomName();

    console.log("✓ Filling text field with:", answer);

    // ENHANCED text input simulation
    textInput.focus();

    // Clear existing value first
    textInput.value = "";

    // Simulate typing character by character (more realistic)
    for (let i = 0; i < answer.length; i++) {
      textInput.value += answer[i];
      textInput.dispatchEvent(new Event("input", { bubbles: true }));
      await wait(50); // Small delay between characters
    }

    // Final events to ensure Typeform recognizes the input
    textInput.dispatchEvent(new Event("change", { bubbles: true }));
    textInput.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true })
    );
    textInput.dispatchEvent(new Event("blur", { bubbles: true }));

    await wait(1500);

    // Check if we can proceed (look for enabled OK/Next button)
    const okButton = document.querySelector("button");
    if (okButton && !okButton.disabled) {
      okButton.click();
      console.log("✓ OK button clicked");
      await wait(5000);
      setTimeout(fillCurrentQuestion, 5000);
      return;
    } else {
      console.log("⚠️ OK button not enabled, trying again...");
      await wait(1000);
      // Try pressing Enter as alternative
      textInput.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "Enter",
          keyCode: 13,
          bubbles: true,
        })
      );
      await wait(5000);
      setTimeout(fillCurrentQuestion, 5000);
      return;
    }
  }

  // Rest of the function stays the same...
  // (rating, textarea, multiple choice, submit logic)

  // 2. Rating buttons
  const ratingButtons = document.querySelectorAll(
    'button[data-testid*="button"], button[class*="Button"], button:not([class*="ImageTooltip"])'
  );
  if (ratingButtons.length >= 3) {
    const validRatingButtons = Array.from(ratingButtons).filter(
      (btn) =>
        !btn.classList.toString().includes("ImageTooltip") &&
        btn.offsetHeight > 0 &&
        btn.offsetWidth > 0
    );

    if (validRatingButtons.length >= 3) {
      const rating = getRandomRating();
      const buttonIndex = Math.min(rating - 1, validRatingButtons.length - 1);
      validRatingButtons[buttonIndex].click();
      console.log(`✓ Rating ${rating} selected`);
      await wait(5000);
      setTimeout(fillCurrentQuestion, 5000);
      return;
    }
  }

  // 3. Textarea
  const textarea = document.querySelector("textarea");
  if (textarea) {
    const questionText = document.body.innerText.toLowerCase();
    if (questionText.includes("enjoy") || questionText.includes("positive")) {
      textarea.value = getRandomPositiveFeedback();
    } else {
      textarea.value = getRandomImprovementFeedback();
    }
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    await wait(1000);
    await clickNextButton();
    return;
  }

  // 4. Multiple choice
  const choiceButtons = document.querySelectorAll(
    'button[role="button"], div[role="button"], button:not([class*="ImageTooltip"])'
  );
  if (choiceButtons.length >= 3) {
    const validChoices = Array.from(choiceButtons).filter(
      (btn) =>
        !btn.classList.toString().includes("ImageTooltip") &&
        btn.offsetHeight > 20 &&
        btn.textContent.trim().length > 0
    );

    if (validChoices.length >= 3) {
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

  // 5. Submit
  const submitButton =
    document.querySelector('button[type="submit"]') ||
    Array.from(document.querySelectorAll("button")).find((btn) => {
      const text = btn.textContent.toLowerCase();
      return (
        text.includes("submit") ||
        text.includes("send") ||
        text.includes("done")
      );
    });

  if (submitButton) {
    submitButton.click();
    console.log(`✅ Response ${responseCount + 1} SUBMITTED!`);
    responseCount++;
    if (responseCount < maxResponses) {
      await wait(4000);
      window.location.reload();
      setTimeout(fillTypeformResponse, 4000);
    }
    return;
  }

  console.log("⚠️ No action taken, retrying...");
  setTimeout(fillCurrentQuestion, 5000);
}

// If we get here, try to find any "Next" button
await clickNextButton();

// Helper function to find and click Next/Continue/OK buttons
async function clickNextButton() {
  const nextSelectors = [
    'button[data-qa="next-button"]',
    'button[type="button"]',
  ];

  // Try strict CSS selectors first
  for (let selector of nextSelectors) {
    const button = document.querySelector(selector);
    if (button && button.offsetHeight > 0) {
      button.click();
      console.log("✓ Next button clicked (by selector)");
      await wait(5000);
      setTimeout(fillCurrentQuestion, 5000);
      return;
    }
  }

  // Fallback: scan all visible buttons by text
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

  // ✅ FIX: You forgot to actually click the fallback button
  if (nextButton) {
    nextButton.click();
    console.log("✓ Next button clicked (by text fallback)");
    await wait(5000);
    setTimeout(fillCurrentQuestion, 5000);
    return;
  }

  console.warn("⚠ No Next button found!");
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
setTimeout(fillTypeformResponse, 5000);
