// Typeform Survey Automation Script
// Run this in the browser console while on your Typeform survey

class TypeformAutomation {
  constructor() {
    this.delay = 1500; // Delay between actions in milliseconds
    this.currentQuestion = 1;

    // Sample data arrays for realistic responses
    this.sampleNames = [
      "John Smith",
      "Sarah Johnson",
      "Michael Brown",
      "Emily Davis",
      "David Wilson",
      "Jessica Miller",
      "Christopher Taylor",
      "Amanda Anderson",
      "Matthew Thompson",
      "Jennifer Garcia",
      "James Rodriguez",
      "Lisa Martinez",
    ];

    this.positiveComments = [
      "The hands-on exercises were incredibly valuable and helped me understand the concepts better. The real-world examples made everything click.",
      "I really appreciated the collaborative environment and how everyone was encouraged to share ideas. The group dynamics were excellent.",
      "The pace was perfect - not too fast, not too slow. I felt challenged but never overwhelmed throughout the entire sprint.",
      "The facilitator's expertise really showed, and the way complex topics were broken down into digestible pieces was fantastic.",
      "The variety of learning activities kept me engaged throughout. I especially loved the practical application segments.",
    ];

    this.improvementComments = [
      "More time for Q&A sessions would be helpful. Sometimes I had questions that weren't fully addressed due to time constraints.",
      "Perhaps include more advanced topics for those who finish early. Some additional challenge problems would be great.",
      "The room setup could be improved for better visibility of the screen from all angles. Audio quality was sometimes inconsistent.",
      "More frequent breaks would help maintain energy levels throughout the day. Maybe shorter, more frequent intervals.",
      "Additional resources or reading materials beforehand would help participants come better prepared.",
    ];

    this.additionalComments = [
      "Overall fantastic experience! Looking forward to the next sprint. The networking opportunities were also valuable.",
      "Thank you for creating such a supportive learning environment. Would definitely recommend to colleagues.",
      "Great initiative! Hope to see more specialized tracks in the future. The practical approach really works.",
      "Excellent organization and execution. The follow-up materials would be helpful for continued learning.",
      "This format works much better than traditional classroom settings. More interactive and engaging overall.",
    ];
  }

  // Utility function to wait
  async wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Get random item from array
  getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  // Get random rating (weighted towards positive)
  getRandomRating() {
    const weights = [0.05, 0.1, 0.15, 0.3, 0.4]; // Favor higher ratings
    const random = Math.random();
    let cumulative = 0;

    for (let i = 0; i < weights.length; i++) {
      cumulative += weights[i];
      if (random <= cumulative) {
        return i + 1;
      }
    }
    return 5; // Default to highest rating
  }

  // Find and click next button
  async clickNext() {
    const nextSelectors = [
      '[data-qa="next-button"]',
      'button[type="submit"]',
      'button[data-qa="submit-button"]',
      'button:not([disabled])[aria-label*="next" i]',
      'button:not([disabled])[title*="next" i]',
      "button:not([disabled])",
      '[role="button"]:not([disabled])',
    ];

    for (const selector of nextSelectors) {
      const button = document.querySelector(selector);
      if (button && !button.disabled && button.offsetParent !== null) {
        console.log(`Clicking next button: ${selector}`);
        button.click();
        await this.wait(this.delay);
        return true;
      }
    }

    console.log("Next button not found, trying Enter key...");
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    await this.wait(this.delay);
    return false;
  }

  // Fill short text question (Question 1: Full name)
  async fillShortText() {
    const textSelectors = [
      'input[type="text"]',
      'input[data-qa="input"]',
      'input[placeholder*="John Smith"]',
      'input:not([type="hidden"]):not([type="submit"]):not([type="button"])',
    ];

    for (const selector of textSelectors) {
      const input = document.querySelector(selector);
      if (input && input.offsetParent !== null) {
        const name = this.getRandomItem(this.sampleNames);
        input.focus();
        input.value = name;
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
        console.log(`Question ${this.currentQuestion}: Filled name - ${name}`);
        return true;
      }
    }
    return false;
  }

  // Fill opinion scale questions (Questions 2-5)
  async fillOpinionScale() {
    const rating = this.getRandomRating();

    // Try different selectors for opinion scale
    const scaleSelectors = [
      `button[data-qa="choice-${rating}"]`,
      `button[aria-label="${rating}"]`,
      `button[value="${rating}"]`,
      `[data-value="${rating}"]`,
      `[role="radio"][aria-label*="${rating}"]`,
      `label[for*="${rating}"]`,
    ];

    for (const selector of scaleSelectors) {
      const option = document.querySelector(selector);
      if (option && option.offsetParent !== null) {
        option.click();
        console.log(
          `Question ${this.currentQuestion}: Selected rating - ${rating}`
        );
        return true;
      }
    }

    // Try clicking the nth button/option
    const buttons = document.querySelectorAll(
      'button:not([disabled]), [role="radio"], [role="button"]'
    );
    if (buttons.length >= rating) {
      buttons[rating - 1].click();
      console.log(
        `Question ${this.currentQuestion}: Selected option ${rating} by index`
      );
      return true;
    }

    return false;
  }

  // Fill long text questions (Questions 6, 7, 9)
  async fillLongText(questionType) {
    const textareaSelectors = [
      "textarea",
      'div[contenteditable="true"]',
      'div[role="textbox"]',
      '[data-qa="textarea"]',
    ];

    let text = "";
    switch (questionType) {
      case "enjoyment":
        text = this.getRandomItem(this.positiveComments);
        break;
      case "improvement":
        text = this.getRandomItem(this.improvementComments);
        break;
      case "additional":
        text = this.getRandomItem(this.additionalComments);
        break;
    }

    for (const selector of textareaSelectors) {
      const textarea = document.querySelector(selector);
      if (textarea && textarea.offsetParent !== null) {
        textarea.focus();

        if (textarea.tagName === "TEXTAREA") {
          textarea.value = text;
          textarea.dispatchEvent(new Event("input", { bubbles: true }));
        } else {
          // For contenteditable divs
          textarea.textContent = text;
          textarea.dispatchEvent(new Event("input", { bubbles: true }));
        }

        textarea.dispatchEvent(new Event("change", { bubbles: true }));
        console.log(
          `Question ${
            this.currentQuestion
          }: Filled long text - ${text.substring(0, 50)}...`
        );
        return true;
      }
    }
    return false;
  }

  // Fill multiple choice question (Question 8)
  async fillMultipleChoice() {
    const options = [
      "Hands-on exercises",
      "Group discussions",
      "Presentations/lectures",
      "Pair programming",
      "Independent study",
    ];

    const selectedOption = this.getRandomItem(options);

    // Try to find the option by text content
    const allButtons = document.querySelectorAll(
      'button, [role="radio"], [role="button"], label'
    );

    for (const button of allButtons) {
      const text = button.textContent.trim().toLowerCase();
      if (
        text.includes(selectedOption.toLowerCase()) ||
        selectedOption.toLowerCase().includes(text)
      ) {
        button.click();
        console.log(
          `Question ${this.currentQuestion}: Selected - ${selectedOption}`
        );
        return true;
      }
    }

    // Fallback: click first available option
    const firstOption = document.querySelector(
      'button:not([disabled]), [role="radio"]:first-of-type'
    );
    if (firstOption) {
      firstOption.click();
      console.log(
        `Question ${this.currentQuestion}: Selected first available option`
      );
      return true;
    }

    return false;
  }

  // Main automation function
  async runAutomation() {
    console.log("🤖 Starting Typeform Automation...");

    try {
      // Question 1: Full name (Short text)
      console.log("\n📝 Processing Question 1: Full name");
      await this.wait(this.delay);
      await this.fillShortText();
      await this.clickNext();
      this.currentQuestion++;

      // Question 2: Rate sprint (Opinion scale)
      console.log("\n⭐ Processing Question 2: Rate sprint");
      await this.wait(this.delay);
      await this.fillOpinionScale();
      await this.clickNext();
      this.currentQuestion++;

      // Question 3: Engagement level (Opinion scale)
      console.log("\n⭐ Processing Question 3: Engagement level");
      await this.wait(this.delay);
      await this.fillOpinionScale();
      await this.clickNext();
      this.currentQuestion++;

      // Question 4: Difficulty level (Opinion scale)
      console.log("\n⭐ Processing Question 4: Difficulty level");
      await this.wait(this.delay);
      await this.fillOpinionScale();
      await this.clickNext();
      this.currentQuestion++;

      // Question 5: Recommendation likelihood (Opinion scale)
      console.log("\n⭐ Processing Question 5: Recommendation likelihood");
      await this.wait(this.delay);
      await this.fillOpinionScale();
      await this.clickNext();
      this.currentQuestion++;

      // Question 6: What you enjoyed (Long text)
      console.log("\n📄 Processing Question 6: What you enjoyed");
      await this.wait(this.delay);
      await this.fillLongText("enjoyment");
      await this.clickNext();
      this.currentQuestion++;

      // Question 7: Areas for improvement (Long text)
      console.log("\n📄 Processing Question 7: Areas for improvement");
      await this.wait(this.delay);
      await this.fillLongText("improvement");
      await this.clickNext();
      this.currentQuestion++;

      // Question 8: Learning format preference (Multiple choice)
      console.log("\n☑️  Processing Question 8: Learning format preference");
      await this.wait(this.delay);
      await this.fillMultipleChoice();
      await this.clickNext();
      this.currentQuestion++;

      // Question 9: Additional comments (Long text)
      console.log("\n📄 Processing Question 9: Additional comments");
      await this.wait(this.delay);
      await this.fillLongText("additional");
      await this.clickNext();

      console.log("\n✅ Automation completed successfully!");
      console.log("📋 All questions have been filled with dummy data.");
    } catch (error) {
      console.error("❌ Error during automation:", error);
      console.log(
        "Current question when error occurred:",
        this.currentQuestion
      );
    }
  }
}

// Initialize and run the automation
const automation = new TypeformAutomation();

console.log("🚀 Typeform Automation Script Loaded!");
console.log(
  "📋 This script will fill out all 9 questions with realistic dummy data."
);
console.log("⏱️  There's a 1.5 second delay between each action.");
console.log("\n🎯 To start the automation, run: automation.runAutomation()");
console.log(
  "⚠️  Make sure you're on the first question of the Typeform before running!"
);

// Uncomment the line below to auto-start the automation
// automation.runAutomation();
