// Typeform Survey Automation Script
// Run this in your browser console while on the Typeform survey page

class TypeformAutomator {
  constructor() {
    this.delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    // Dummy data pools for realistic responses
    this.names = [
      "Alex Johnson",
      "Sarah Chen",
      "Michael Rodriguez",
      "Emma Thompson",
      "David Kim",
      "Jessica Martinez",
      "Ryan O'Connor",
      "Priya Patel",
      "Marcus Williams",
      "Lisa Zhang",
      "James Anderson",
      "Maria Garcia",
    ];

    this.positiveComments = [
      "The hands-on approach really helped me understand the concepts better. I loved how we could immediately apply what we learned.",
      "Great interactive sessions and the pace was perfect. The real-world examples made everything click for me.",
      "Excellent facilitator energy and the group dynamics were fantastic. Learned so much from peer discussions.",
      "The practical exercises were spot-on and relevant to my daily work. Very engaging throughout.",
      "Amazing content structure and the step-by-step approach made complex topics digestible.",
      "Love the collaborative environment and how everyone felt comfortable sharing ideas and questions.",
    ];

    this.improvementComments = [
      "Could use more time for Q&A sessions. Sometimes felt rushed when diving into complex topics.",
      "More visual aids or diagrams would help explain some of the abstract concepts better.",
      "Would benefit from additional practice exercises or homework to reinforce learning outside sessions.",
      "Some topics could use deeper exploration. Maybe extend certain modules by 15-30 minutes.",
      "Better pre-work materials would help participants come more prepared for discussions.",
      "Consider providing more resources or references for continued learning after the sprint.",
    ];

    this.additionalComments = [
      "Overall fantastic experience! Looking forward to the next sprint. Keep up the great work!",
      "This format works really well for our team. Consider making it a regular occurrence.",
      "Great job creating an inclusive learning environment. Everyone felt heard and valued.",
      "The networking aspect was an unexpected bonus. Made some great professional connections.",
      "Perfect balance of challenge and support. Pushed us without being overwhelming.",
      "Would love to see more advanced topics covered in future sprints using this same format.",
    ];

    this.learningFormats = [
      "Hands-on exercises",
      "Group discussions",
      "Presentations/lectures",
      "Pair programming",
      "Independent study",
    ];
  }

  // Utility function to find element with multiple selector strategies
  findElement(selectors) {
    for (let selector of selectors) {
      const element = document.querySelector(selector);
      if (element) return element;
    }
    return null;
  }

  // Fill text input (short or long text)
  async fillTextInput(text) {
    const selectors = [
      'input[type="text"]',
      "textarea",
      'input[data-qa="input"]',
      '[data-qa="input"]',
      ".tf-input",
      '[role="textbox"]',
    ];

    const input = this.findElement(selectors);
    if (input) {
      input.focus();
      await this.delay(500);
      input.value = text;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
      console.log(`✓ Filled text: "${text.substring(0, 50)}..."`);
      return true;
    }
    return false;
  }

  // Handle opinion scale (1-5 rating)
  async fillOpinionScale(rating) {
    const selectors = [
      `button[data-qa="choice"][aria-label*="${rating}"]`,
      `[data-qa="choice"]:nth-child(${rating})`,
      `button[aria-label*="${rating}"]`,
      `.tf-rating-scale button:nth-child(${rating})`,
      `[role="radio"][value="${rating}"]`,
    ];

    let button = this.findElement(selectors);

    // Alternative approach: look for buttons with text content
    if (!button) {
      const buttons = document.querySelectorAll('button, [role="radio"]');
      for (let btn of buttons) {
        if (
          btn.textContent.includes(rating.toString()) ||
          btn.getAttribute("aria-label")?.includes(rating.toString())
        ) {
          button = btn;
          break;
        }
      }
    }

    if (button) {
      button.click();
      console.log(`✓ Selected rating: ${rating}`);
      await this.delay(500);
      return true;
    }
    return false;
  }

  // Handle multiple choice selection
  async selectMultipleChoice(optionText) {
    const selectors = [
      `button[data-qa="choice"]`,
      `[data-qa="choice"]`,
      `input[type="radio"]`,
      `.tf-multiple-choice button`,
    ];

    // First try to find by exact text match
    const choices = document.querySelectorAll('button, [role="radio"], label');
    for (let choice of choices) {
      if (choice.textContent.trim().includes(optionText)) {
        choice.click();
        console.log(`✓ Selected: ${optionText}`);
        await this.delay(500);
        return true;
      }
    }

    return false;
  }

  // Click next/continue button
  async clickNext() {
    const selectors = [
      'button[data-qa="next-button"]',
      'button[type="submit"]',
      'button:contains("Next")',
      'button:contains("Continue")',
      'button:contains("OK")',
      '[data-qa="next"]',
      ".tf-next-button",
    ];

    let nextButton = this.findElement(selectors);

    // Alternative approach: look for buttons with relevant text
    if (!nextButton) {
      const buttons = document.querySelectorAll("button");
      for (let btn of buttons) {
        const text = btn.textContent.toLowerCase();
        if (
          text.includes("next") ||
          text.includes("continue") ||
          text.includes("ok") ||
          text.includes("submit")
        ) {
          nextButton = btn;
          break;
        }
      }
    }

    if (nextButton && !nextButton.disabled) {
      nextButton.click();
      console.log(`✓ Clicked next button`);
      await this.delay(1500); // Wait for page transition
      return true;
    }
    return false;
  }

  // Get random item from array
  random(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  // Get random rating (weighted towards positive)
  getRandomRating() {
    const weights = [0.05, 0.1, 0.2, 0.35, 0.3]; // Slightly favor 4-5 ratings
    const rand = Math.random();
    let cumulative = 0;

    for (let i = 0; i < weights.length; i++) {
      cumulative += weights[i];
      if (rand <= cumulative) {
        return i + 1;
      }
    }
    return 4; // Default to 4 if something goes wrong
  }

  // Smart question detection and filling
  async detectAndFillCurrentQuestion() {
    console.log("🔍 Detecting current question type...");

    // Check for text inputs (short or long text)
    const textInputs = document.querySelectorAll(
      'input[type="text"], textarea, [contenteditable="true"]'
    );
    if (textInputs.length > 0) {
      console.log("📝 Detected text input question");

      // Determine if it's asking for name, positive feedback, improvement, or additional comments
      const pageText = document.body.textContent.toLowerCase();

      if (pageText.includes("name") || pageText.includes("full name")) {
        await this.fillTextInput(this.random(this.names));
      } else if (
        pageText.includes("enjoy") ||
        pageText.includes("positive") ||
        pageText.includes("liked")
      ) {
        await this.fillTextInput(this.random(this.positiveComments));
      } else if (
        pageText.includes("improve") ||
        pageText.includes("better") ||
        pageText.includes("feedback")
      ) {
        await this.fillTextInput(this.random(this.improvementComments));
      } else {
        await this.fillTextInput(this.random(this.additionalComments));
      }
      return true;
    }

    // Check for rating scales (look for numbered buttons)
    const ratingButtons = document.querySelectorAll('button, [role="button"]');
    const hasRatingScale = Array.from(ratingButtons).some(
      (btn) =>
        /^[1-5]$/.test(btn.textContent.trim()) ||
        btn.textContent.includes("1") ||
        btn.textContent.includes("5")
    );

    if (hasRatingScale) {
      console.log("⭐ Detected rating scale question");
      await this.fillOpinionScale(this.getRandomRating());
      return true;
    }

    // Check for multiple choice (buttons with longer text)
    const choiceButtons = Array.from(ratingButtons).filter(
      (btn) =>
        btn.textContent.trim().length > 3 &&
        !btn.textContent.toLowerCase().includes("next") &&
        !btn.textContent.toLowerCase().includes("ok")
    );

    if (choiceButtons.length > 1) {
      console.log("☑️ Detected multiple choice question");
      const randomChoice =
        choiceButtons[Math.floor(Math.random() * choiceButtons.length)];
      randomChoice.click();
      console.log(`✓ Selected: ${randomChoice.textContent.trim()}`);
      await this.delay(500);
      return true;
    }

    console.log("❓ Could not detect question type");
    return false;
  }

  // Main automation function - adaptive approach
  async fillSurvey() {
    console.log("🚀 Starting adaptive Typeform survey automation...");

    let questionCount = 0;
    const maxQuestions = 10; // Safety limit

    while (questionCount < maxQuestions) {
      questionCount++;
      console.log(`\n📝 Processing question ${questionCount}...`);

      // Wait a moment for page to load
      await this.delay(1000);

      // Try to fill current question
      const filled = await this.detectAndFillCurrentQuestion();

      if (!filled) {
        console.log(
          "⚠️ Could not fill current question, trying to continue..."
        );
      }

      // Try to go to next question
      await this.delay(1000);
      const nextClicked = await this.clickNext();

      if (!nextClicked) {
        console.log("🏁 No next button found - survey might be complete!");
        break;
      }

      // Check if we've reached the end
      await this.delay(2000);
      const currentUrl = window.location.href;
      if (
        currentUrl.includes("thank") ||
        currentUrl.includes("complete") ||
        document.body.textContent.toLowerCase().includes("thank you")
      ) {
        console.log("🎉 Survey completed!");
        break;
      }
    }

    console.log(
      `\n✅ Survey automation finished after ${questionCount} questions!`
    );
  }

  // Step-by-step helper for manual control
  async fillCurrentAndNext() {
    console.log("🎯 Filling current question and moving to next...");
    await this.detectAndFillCurrentQuestion();
    await this.delay(1000);
    await this.clickNext();
    await this.delay(1500);
    this.inspectPage();
  }

  // Debug function to inspect current page
  inspectPage() {
    console.log("🔍 Page inspection:");
    console.log(
      "Text inputs:",
      document.querySelectorAll('input[type="text"], textarea').length
    );
    console.log("Buttons:", document.querySelectorAll("button").length);
    console.log(
      "Radio inputs:",
      document.querySelectorAll('input[type="radio"]').length
    );
    console.log(
      "Visible elements with 'choice' in data-qa:",
      document.querySelectorAll('[data-qa*="choice"]').length
    );
  }
}

// Usage Instructions:
console.log(`
🎯 ADAPTIVE TYPEFORM AUTOMATION READY!

Based on your page inspection, try these commands:

1. FULL AUTOMATION (Recommended):
   automator.fillSurvey();

2. STEP-BY-STEP (For testing):
   automator.fillCurrentAndNext(); // Fills current question and moves to next
   
3. MANUAL CONTROL:
   automator.detectAndFillCurrentQuestion(); // Just fill current question
   automator.clickNext(); // Just click next
   automator.inspectPage(); // Check what's on the page

4. DEBUGGING:
   // Check what buttons are available:
   console.log("Available buttons:", Array.from(document.querySelectorAll('button')).map(b => b.textContent.trim()));

⚡ New Smart Features:
- Auto-detects question types by analyzing page content
- Adapts to actual Typeform structure (no hardcoded assumptions)
- Handles any question order
- Stops automatically when survey is complete
- Safe limits to prevent infinite loops

🔧 Current Page Status:
- Text inputs: 1 (likely the name field)
- Buttons: 10 (including next/navigation)
- This looks like question 1 - ready to go!
`);

// Auto-create instance for immediate use
window.automator = new TypeformAutomator();
