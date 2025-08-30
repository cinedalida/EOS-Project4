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

  // Main automation function
  async fillSurvey() {
    console.log("🚀 Starting Typeform survey automation...");

    try {
      // Question 1: Full Name
      console.log("\n📝 Question 1: Full Name");
      await this.fillTextInput(this.random(this.names));
      await this.clickNext();

      // Question 2: Sprint Rating
      console.log("\n📝 Question 2: Sprint Rating");
      await this.fillOpinionScale(this.getRandomRating());
      await this.clickNext();

      // Question 3: Engagement Level
      console.log("\n📝 Question 3: Engagement Level");
      await this.fillOpinionScale(this.getRandomRating());
      await this.clickNext();

      // Question 4: Difficulty Level
      console.log("\n📝 Question 4: Difficulty Level");
      await this.fillOpinionScale(this.getRandomRating());
      await this.clickNext();

      // Question 5: Recommendation Likelihood
      console.log("\n📝 Question 5: Recommendation Likelihood");
      await this.fillOpinionScale(this.getRandomRating());
      await this.clickNext();

      // Question 6: What you enjoyed most
      console.log("\n📝 Question 6: What you enjoyed most");
      await this.fillTextInput(this.random(this.positiveComments));
      await this.clickNext();

      // Question 7: Areas for improvement
      console.log("\n📝 Question 7: Areas for improvement");
      await this.fillTextInput(this.random(this.improvementComments));
      await this.clickNext();

      // Question 8: Learning format preference
      console.log("\n📝 Question 8: Learning format preference");
      await this.selectMultipleChoice(this.random(this.learningFormats));
      await this.clickNext();

      // Question 9: Additional comments
      console.log("\n📝 Question 9: Additional comments");
      await this.fillTextInput(this.random(this.additionalComments));
      await this.clickNext();

      console.log("\n✅ Survey automation completed successfully!");
    } catch (error) {
      console.error("❌ Error during automation:", error);
      console.log(
        "💡 Try running the script step by step or check if page structure changed"
      );
    }
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
🎯 TYPEFORM AUTOMATION READY!

To use this script:

1. Navigate to your Typeform survey
2. Open browser console (F12 > Console)
3. Run one of these commands:

   // Start full automation:
   const automator = new TypeformAutomator();
   automator.fillSurvey();

   // Or run step by step:
   const automator = new TypeformAutomator();
   automator.inspectPage(); // Check page structure first
   
   // Then fill individual questions as needed:
   automator.fillTextInput("John Doe");
   automator.fillOpinionScale(4);
   automator.selectMultipleChoice("Hands-on exercises");
   automator.clickNext();

⚡ Features:
- Realistic dummy data with variety
- Handles all Typeform question types  
- Weighted ratings (slightly favors positive responses)
- Error handling and debugging tools
- Automatic progression through survey

🛠 Troubleshooting:
- If automation fails, try automator.inspectPage() to debug
- Run step-by-step instead of full automation
- Check browser console for specific error messages
`);

// Auto-create instance for immediate use
window.automator = new TypeformAutomator();
