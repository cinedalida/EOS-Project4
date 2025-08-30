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

  // Fill text input with better Typeform integration
  async fillTextInput(text) {
    console.log(`🎯 Trying to fill text: "${text.substring(0, 50)}..."`);

    const selectors = [
      'input[type="text"]',
      "textarea",
      'input[data-qa="input"]',
      '[data-qa="input"]',
      ".tf-input",
      '[role="textbox"]',
      'input:not([type="hidden"]):not([type="radio"]):not([type="checkbox"])',
      '[contenteditable="true"]',
    ];

    let input = this.findElement(selectors);

    // Enhanced search for any visible input
    if (!input) {
      const allInputs = document.querySelectorAll(
        "input, textarea, [contenteditable]"
      );
      for (let el of allInputs) {
        if (
          el.offsetWidth > 0 &&
          el.offsetHeight > 0 &&
          !el.disabled &&
          el.type !== "hidden" &&
          el.type !== "radio" &&
          el.type !== "checkbox"
        ) {
          input = el;
          break;
        }
      }
    }

    if (input) {
      console.log(
        `📝 Found input element: ${input.tagName} ${input.type || ""} ${
          input.className
        }`
      );

      try {
        // Focus first
        input.focus();
        await this.delay(300);

        // Clear existing content
        input.value = "";
        input.dispatchEvent(new Event("input", { bubbles: true }));

        // Type character by character (more realistic for Typeform)
        for (let i = 0; i < text.length; i++) {
          input.value = text.substring(0, i + 1);
          input.dispatchEvent(new Event("input", { bubbles: true }));
          await this.delay(20); // Small delay between characters
        }

        // Final events
        input.dispatchEvent(new Event("change", { bubbles: true }));
        input.dispatchEvent(new Event("blur", { bubbles: true }));

        // Wait a moment and verify
        await this.delay(500);
        const currentValue =
          input.value || input.textContent || input.innerHTML;
        console.log(
          `✅ Input filled. Current value: "${currentValue.substring(
            0,
            50
          )}..."`
        );

        // Additional verification - check if Typeform registered the input
        const isValid = currentValue.length > 0;
        if (!isValid) {
          console.log(
            "⚠️ Input appears empty after filling, trying alternative method..."
          );

          // Alternative: simulate real typing
          input.focus();
          document.execCommand("selectAll");
          document.execCommand("insertText", false, text);
          input.dispatchEvent(new Event("input", { bubbles: true }));
          input.dispatchEvent(new Event("change", { bubbles: true }));
        }

        return true;
      } catch (error) {
        console.error(`❌ Error filling input: ${error.message}`);
        return false;
      }
    }

    console.log("❌ No text input found");
    return false;
  }

  // Handle opinion scale (1-5 rating) - Enhanced version
  async fillOpinionScale(rating) {
    console.log(`🎯 Trying to select rating: ${rating}`);

    // First approach: look for buttons with the exact rating number
    let buttons = document.querySelectorAll(
      'button, [role="button"], [role="radio"]'
    );

    for (let btn of buttons) {
      const text = btn.textContent.trim();
      const ariaLabel = btn.getAttribute("aria-label") || "";

      // Check if button represents this rating
      if (
        text === rating.toString() ||
        ariaLabel.includes(rating.toString()) ||
        btn.value === rating.toString()
      ) {
        console.log(`⭐ Found rating button: "${text}" (${ariaLabel})`);
        btn.click();
        await this.delay(500);
        return true;
      }
    }

    // Second approach: look for buttons in a rating container
    const ratingContainers = document.querySelectorAll(
      '[data-qa*="rating"], .rating, .scale'
    );
    for (let container of ratingContainers) {
      const ratingButtons = container.querySelectorAll("button");
      if (ratingButtons.length >= rating && rating <= ratingButtons.length) {
        console.log(`⭐ Found rating in container, clicking button ${rating}`);
        ratingButtons[rating - 1].click();
        await this.delay(500);
        return true;
      }
    }

    // Third approach: find all numbered buttons and pick the right one
    const numberedButtons = Array.from(buttons)
      .filter((btn) => {
        const text = btn.textContent.trim();
        return /^[1-5]$/.test(text);
      })
      .sort((a, b) => parseInt(a.textContent) - parseInt(b.textContent));

    if (numberedButtons.length >= rating) {
      console.log(`⭐ Found numbered buttons, selecting position ${rating}`);
      numberedButtons[rating - 1].click();
      await this.delay(500);
      return true;
    }

    // Fourth approach: try nth-child selection within likely containers
    const possibleContainers = document.querySelectorAll("div, fieldset, form");
    for (let container of possibleContainers) {
      const containerButtons = container.querySelectorAll("button");
      if (containerButtons.length === 5) {
        // Likely a 1-5 scale
        console.log(`⭐ Found 5-button container, selecting button ${rating}`);
        containerButtons[rating - 1].click();
        await this.delay(500);
        return true;
      }
    }

    console.log(`❌ Could not find rating scale for rating ${rating}`);
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
      '[data-qa="next"]',
      ".tf-next-button",
      'button[aria-label*="next"]',
      'button[aria-label*="Next"]',
    ];

    let nextButton = this.findElement(selectors);

    // Primary approach: look for buttons with relevant text
    if (!nextButton) {
      const buttons = document.querySelectorAll("button");
      for (let btn of buttons) {
        const text = btn.textContent.toLowerCase().trim();
        const ariaLabel = (btn.getAttribute("aria-label") || "").toLowerCase();

        if (
          text.includes("next") ||
          text.includes("continue") ||
          text.includes("ok") ||
          text.includes("submit") ||
          ariaLabel.includes("next") ||
          ariaLabel.includes("continue")
        ) {
          nextButton = btn;
          break;
        }
      }
    }

    // Fallback: look for buttons with arrow symbols or common patterns
    if (!nextButton) {
      const buttons = document.querySelectorAll("button");
      for (let btn of buttons) {
        const text = btn.textContent.trim();
        if (
          text === "→" ||
          text === ">" ||
          text.includes("→") ||
          btn.innerHTML.includes("arrow") ||
          btn.innerHTML.includes("chevron")
        ) {
          nextButton = btn;
          break;
        }
      }
    }

    // Last resort: find the most likely button (usually the last visible enabled button)
    if (!nextButton) {
      const buttons = Array.from(document.querySelectorAll("button")).filter(
        (btn) =>
          !btn.disabled &&
          btn.offsetWidth > 0 &&
          btn.offsetHeight > 0 &&
          !btn.textContent.toLowerCase().includes("back")
      );
      if (buttons.length > 0) {
        nextButton = buttons[buttons.length - 1]; // Usually the last button is "next"
      }
    }

    if (nextButton && !nextButton.disabled) {
      console.log(
        `✓ Clicking button: "${nextButton.textContent.trim()}" (${
          nextButton.getAttribute("aria-label") || "no aria-label"
        })`
      );
      nextButton.click();
      await this.delay(1500); // Wait for page transition
      return true;
    }

    console.log("❌ Could not find next button");
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

  // Smart question detection and filling - Fixed version
  async detectAndFillCurrentQuestion() {
    console.log("🔍 Detecting current question type...");

    // Get the page context to understand what type of question this is
    const pageText = document.body.textContent.toLowerCase();
    const questionText =
      document
        .querySelector('h1, .question-title, [data-qa="question-title"]')
        ?.textContent?.toLowerCase() || pageText;

    console.log(`📋 Question context: "${questionText.substring(0, 100)}..."`);

    // Check for rating scales FIRST (priority)
    const ratingButtons = document.querySelectorAll('button, [role="button"]');
    const ratingNumbers = Array.from(ratingButtons).filter((btn) =>
      /^[1-5]$/.test(btn.textContent.trim())
    );

    if (ratingNumbers.length >= 3) {
      // Likely a rating scale
      console.log("⭐ Detected RATING SCALE question");
      const rating = this.getRandomRating();
      await this.fillOpinionScale(rating);
      return true;
    }

    // Check for multiple choice (buttons with longer text)
    const choiceButtons = Array.from(ratingButtons).filter((btn) => {
      const text = btn.textContent.trim();
      return (
        text.length > 5 &&
        !text.toLowerCase().includes("next") &&
        !text.toLowerCase().includes("ok") &&
        !text.toLowerCase().includes("submit") &&
        !text.toLowerCase().includes("back")
      );
    });

    if (choiceButtons.length > 1) {
      console.log("☑️ Detected MULTIPLE CHOICE question");
      const randomChoice =
        choiceButtons[Math.floor(Math.random() * choiceButtons.length)];
      randomChoice.click();
      console.log(`✓ Selected: ${randomChoice.textContent.trim()}`);
      await this.delay(500);
      return true;
    }

    // Check for text inputs
    const textInputs = document.querySelectorAll(
      'input[type="text"], textarea, [contenteditable="true"]'
    );
    if (textInputs.length > 0) {
      console.log("📝 Detected TEXT INPUT question");

      // Determine the appropriate response based on question content
      let responseText;

      if (questionText.includes("name") || questionText.includes("full name")) {
        responseText = this.random(this.names);
        console.log("👤 Filling NAME field");
      } else if (
        questionText.includes("enjoy") ||
        questionText.includes("liked") ||
        questionText.includes("positive") ||
        questionText.includes("most about")
      ) {
        responseText = this.random(this.positiveComments);
        console.log("😊 Filling POSITIVE FEEDBACK");
      } else if (
        questionText.includes("improve") ||
        questionText.includes("better") ||
        questionText.includes("areas need") ||
        questionText.includes("constructive")
      ) {
        responseText = this.random(this.improvementComments);
        console.log("🔧 Filling IMPROVEMENT SUGGESTIONS");
      } else if (
        questionText.includes("additional") ||
        questionText.includes("other") ||
        questionText.includes("suggestions") ||
        questionText.includes("comments")
      ) {
        responseText = this.random(this.additionalComments);
        console.log("💭 Filling ADDITIONAL COMMENTS");
      } else {
        // Default fallback
        responseText = this.random(this.additionalComments);
        console.log("📝 Filling with GENERAL RESPONSE");
      }

      await this.fillTextInput(responseText);
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

  // Debug function to inspect current page - Enhanced
  inspectPage() {
    console.log("🔍 DETAILED PAGE INSPECTION:");

    // Check inputs
    const textInputs = document.querySelectorAll(
      'input[type="text"], textarea, [contenteditable="true"]'
    );
    console.log(`📝 Text inputs found: ${textInputs.length}`);
    textInputs.forEach((input, i) => {
      console.log(
        `  Input ${i + 1}: ${input.tagName} ${input.type || ""} class="${
          input.className
        }" placeholder="${input.placeholder || ""}"`
      );
    });

    // Check buttons
    const buttons = document.querySelectorAll("button");
    console.log(`🔘 Buttons found: ${buttons.length}`);
    buttons.forEach((btn, i) => {
      const text = btn.textContent.trim();
      const ariaLabel = btn.getAttribute("aria-label") || "";
      console.log(
        `  Button ${i + 1}: "${text}" ${
          ariaLabel ? "(" + ariaLabel + ")" : ""
        } disabled=${btn.disabled}`
      );
    });

    // Check for radio buttons
    const radioInputs = document.querySelectorAll(
      'input[type="radio"], [role="radio"]'
    );
    console.log(`📻 Radio inputs: ${radioInputs.length}`);

    // Check page content for context
    const pageText = document.body.textContent;
    console.log(`📄 Page contains keywords:`);
    console.log(`  - "name": ${pageText.toLowerCase().includes("name")}`);
    console.log(`  - "rate": ${pageText.toLowerCase().includes("rate")}`);
    console.log(`  - "scale": ${pageText.toLowerCase().includes("scale")}`);
    console.log(`  - question numbers: ${/[1-5]/.test(pageText)}`);

    // Show current URL
    console.log(`🌐 Current URL: ${window.location.href}`);
  }

  // Test function to try filling current question with debugging
  async testFillCurrent() {
    console.log("🧪 TESTING CURRENT QUESTION FILL:");
    this.inspectPage();

    console.log("\n🎯 Attempting to fill...");
    const success = await this.detectAndFillCurrentQuestion();

    if (!success) {
      console.log("❌ Fill failed. Let's try manual approaches:");

      // Try to fill any visible input with test text
      const inputs = document.querySelectorAll(
        'input, textarea, [contenteditable="true"]'
      );
      for (let input of inputs) {
        if (input.offsetWidth > 0 && input.offsetHeight > 0) {
          console.log(
            `🔧 Manually trying input: ${input.tagName} ${input.className}`
          );
          input.focus();
          input.value = "Test Name";
          input.dispatchEvent(new Event("input", { bubbles: true }));
          input.dispatchEvent(new Event("change", { bubbles: true }));
          break;
        }
      }

      // Try clicking first reasonable button for rating
      const buttons = document.querySelectorAll("button");
      for (let btn of buttons) {
        const text = btn.textContent.trim();
        if (/^[1-5]$/.test(text) && text === "4") {
          console.log(`🔧 Manually clicking rating button: ${text}`);
          btn.click();
          break;
        }
      }
    }

    console.log("✅ Test completed");
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
