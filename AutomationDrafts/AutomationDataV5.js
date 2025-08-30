// Typeform Survey Automation Script (Improved)
// Run this in the browser console while on your Typeform survey

class TypeformAutomation {
  constructor() {
    this.delay = 2000; // Delay between actions in ms (increased for safety)
    this.currentQuestion = 1;

    // Sample data
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

  // Utility wait
  async wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Random utilities
  getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  getRandomRating() {
    const weights = [0.05, 0.1, 0.15, 0.3, 0.4];
    const random = Math.random();
    let cumulative = 0;
    for (let i = 0; i < weights.length; i++) {
      cumulative += weights[i];
      if (random <= cumulative) return i + 1;
    }
    return 5;
  }

  // Click "Next" or "Submit"
  async clickNext() {
    const selectors = [
      '[data-qa="next-button"]',
      'button[type="submit"]',
      'button[data-qa="submit-button"]',
      'button:not([disabled])[aria-label*="next" i]',
      'button:not([disabled])[title*="next" i]',
    ];

    const simulateClick = (el) => {
      // Always make sure we’re clicking the real <button>
      const realButton = el.closest("button") || el;

      if (typeof realButton.click === "function") {
        // Native click is safest
        realButton.click();
      } else {
        // Fallback if .click() isn’t available
        realButton.dispatchEvent(
          new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            composed: true,
            view: window,
            detail: 1, // number of clicks
            button: 0, // left click
          })
        );
      }
    };

    for (const selector of selectors) {
      const button = document.querySelector(selector);
      if (button && !button.disabled && button.offsetParent !== null) {
        console.log(`Clicking button: ${selector}`);
        simulateClick(button);
        await this.wait(this.delay);
        return true;
      }
    }

    // Fallback: find by text
    const textButton = Array.from(document.querySelectorAll("button")).find(
      (btn) =>
        (btn.innerText || "").toLowerCase().includes("next") ||
        (btn.innerText || "").toLowerCase().includes("submit")
    );
    if (textButton) {
      console.log("Clicking button by text:", textButton.innerText);
      simulateClick(textButton);
      await this.wait(this.delay);
      return true;
    }

    // Final fallback: simulate Enter key
    console.log("No button found, pressing Enter...");
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true })
    );
    await this.wait(this.delay);
    return false;
  }

  // Fill short text
  async fillShortText() {
    const selectors = [
      'input[type="text"]',
      'input[data-qa="input"]',
      'input:not([type="hidden"]):not([type="submit"]):not([type="button"])',
    ];

    for (const selector of selectors) {
      const input = document.querySelector(selector);
      if (input && input.offsetParent !== null) {
        const name = this.getRandomItem(this.sampleNames);
        input.focus();
        input.value = name;
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
        console.log(`Q${this.currentQuestion}: Filled name - ${name}`);
        return true;
      }
    }
    return false;
  }

  // Fill opinion scale
  async fillOpinionScale() {
    const rating = this.getRandomRating();
    const selectors = [
      `button[data-qa="choice-${rating}"]`,
      `button[aria-label="${rating}"]`,
      `button[value="${rating}"]`,
      `[data-value="${rating}"]`,
      `[role="radio"][aria-label*="${rating}"]`,
    ];

    for (const selector of selectors) {
      const option = document.querySelector(selector);
      if (option && option.offsetParent !== null) {
        option.click();
        console.log(`Q${this.currentQuestion}: Selected rating - ${rating}`);
        return true;
      }
    }

    // Fallback: by index
    const buttons = Array.from(document.querySelectorAll("button")).filter(
      (btn) => btn.offsetParent !== null
    );
    if (buttons.length >= rating) {
      buttons[rating - 1].click();
      console.log(
        `Q${this.currentQuestion}: Selected rating by index - ${rating}`
      );
      return true;
    }

    return false;
  }

  // Fill long text
  async fillLongText(type) {
    const selectors = [
      "textarea",
      'div[contenteditable="true"]',
      'div[role="textbox"]',
      '[data-qa="textarea"]',
    ];
    let text = "";
    if (type === "enjoyment") text = this.getRandomItem(this.positiveComments);
    if (type === "improvement")
      text = this.getRandomItem(this.improvementComments);
    if (type === "additional")
      text = this.getRandomItem(this.additionalComments);

    for (const selector of selectors) {
      const textarea = document.querySelector(selector);
      if (textarea && textarea.offsetParent !== null) {
        textarea.focus();
        if (textarea.tagName === "TEXTAREA") {
          textarea.value = text;
        } else {
          textarea.innerText = text; // for contenteditable
        }
        textarea.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true }));
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
        textarea.dispatchEvent(new Event("change", { bubbles: true }));
        console.log(
          `Q${this.currentQuestion}: Filled text - ${text.substring(0, 50)}...`
        );
        return true;
      }
    }
    return false;
  }

  // Fill multiple choice
  async fillMultipleChoice() {
    const options = [
      "Hands-on exercises",
      "Group discussions",
      "Presentations/lectures",
      "Pair programming",
      "Independent study",
    ];
    const selectedOption = this.getRandomItem(options);

    const allOptions = document.querySelectorAll(
      "button, [role='radio'], [role='button'], label"
    );
    for (const opt of allOptions) {
      const text = (opt.innerText || opt.ariaLabel || "").toLowerCase();
      if (text.includes(selectedOption.toLowerCase())) {
        opt.click();
        console.log(`Q${this.currentQuestion}: Selected - ${selectedOption}`);
        return true;
      }
    }

    // Fallback
    const firstOption = document.querySelector(
      "button:not([disabled]), [role='radio']"
    );
    if (firstOption) {
      firstOption.click();
      console.log(`Q${this.currentQuestion}: Selected first available option`);
      return true;
    }
    return false;
  }

  // Main automation
  async runAutomation() {
    console.log("🤖 Starting Typeform Automation...");
    try {
      console.log("\n📝 Q1: Full name");
      await this.wait(this.delay);
      await this.fillShortText();
      await this.clickNext();
      this.currentQuestion++;

      console.log("\n⭐ Q2: Rate sprint");
      await this.wait(this.delay);
      await this.fillOpinionScale();
      await this.clickNext();
      this.currentQuestion++;

      console.log("\n⭐ Q3: Engagement level");
      await this.wait(this.delay);
      await this.fillOpinionScale();
      await this.clickNext();
      this.currentQuestion++;

      console.log("\n⭐ Q4: Difficulty level");
      await this.wait(this.delay);
      await this.fillOpinionScale();
      await this.clickNext();
      this.currentQuestion++;

      console.log("\n⭐ Q5: Recommendation likelihood");
      await this.wait(this.delay);
      await this.fillOpinionScale();
      await this.clickNext();
      this.currentQuestion++;

      console.log("\n📄 Q6: What you enjoyed");
      await this.wait(this.delay);
      await this.fillLongText("enjoyment");
      await this.clickNext();
      this.currentQuestion++;

      console.log("\n📄 Q7: Areas for improvement");
      await this.wait(this.delay);
      await this.fillLongText("improvement");
      await this.clickNext();
      this.currentQuestion++;

      console.log("\n☑️ Q8: Learning format preference");
      await this.wait(this.delay);
      await this.fillMultipleChoice();
      await this.clickNext();
      this.currentQuestion++;

      console.log("\n📄 Q9: Additional comments");
      await this.wait(this.delay);
      await this.fillLongText("additional");
      await this.clickNext();

      console.log("\n✅ Automation completed successfully!");
    } catch (err) {
      console.error("❌ Error during automation:", err);
      console.log("Stopped at question:", this.currentQuestion);
    }
  }
}

// Initialize
const automation = new TypeformAutomation();
console.log(
  "🚀 Script loaded. Run automation with: automation.runAutomation()"
);
