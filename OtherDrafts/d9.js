// SIMPLIFIED TYPEFORM AUTOMATION
// This version focuses on direct DOM manipulation with Typeform's actual structure

class SimpleTypeformBot {
  constructor() {
    this.delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    // Realistic dummy data
    this.names = [
      "Alex Johnson",
      "Sarah Chen",
      "Michael Rodriguez",
      "Emma Thompson",
      "David Kim",
    ];

    this.responses = {
      enjoyed: [
        "The hands-on approach really helped me understand the concepts better. I loved how we could immediately apply what we learned.",
        "Great interactive sessions and the pace was perfect. The real-world examples made everything click for me.",
        "Excellent facilitator energy and the group dynamics were fantastic. Learned so much from peer discussions.",
      ],
      improvements: [
        "Could use more time for Q&A sessions. Sometimes felt rushed when diving into complex topics.",
        "More visual aids or diagrams would help explain some of the abstract concepts better.",
        "Would benefit from additional practice exercises to reinforce learning outside sessions.",
      ],
      additional: [
        "Overall fantastic experience! Looking forward to the next sprint. Keep up the great work!",
        "This format works really well for our team. Consider making it a regular occurrence.",
        "Great job creating an inclusive learning environment. Everyone felt heard and valued.",
      ],
      learningFormats: [
        "Hands-on exercises",
        "Group discussions",
        "Presentations/lectures",
        "Pair programming",
        "Independent study",
      ],
    };
  }

  random(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  getRandomRating() {
    // Weighted towards positive responses (3, 4, 5)
    const weights = [0.05, 0.1, 0.25, 0.35, 0.25];
    const rand = Math.random();
    let cumulative = 0;
    for (let i = 0; i < weights.length; i++) {
      cumulative += weights[i];
      if (rand <= cumulative) return i + 1;
    }
    return 4;
  }

  // Enhanced input filling with better Typeform integration
  async fillAnyInput(text) {
    console.log(`📝 Attempting to fill: "${text.substring(0, 50)}..."`);

    // Find any visible text input
    const inputs = document.querySelectorAll("input, textarea");

    for (let input of inputs) {
      // Check if input is visible and not disabled
      const rect = input.getBoundingClientRect();
      if (
        rect.width > 0 &&
        rect.height > 0 &&
        !input.disabled &&
        input.type !== "hidden"
      ) {
        console.log(
          `Found input: ${input.tagName} type="${input.type}" class="${input.className}"`
        );

        try {
          // Enhanced approach for Typeform
          input.click();
          await this.delay(300);
          input.focus();
          await this.delay(300);

          // Clear existing content multiple ways
          input.value = "";
          input.dispatchEvent(new Event("input", { bubbles: true }));
          await this.delay(100);

          // Try multiple methods to set the value

          // Method 1: Character by character typing simulation
          for (let i = 0; i < text.length; i++) {
            input.value = text.substring(0, i + 1);

            // Dispatch input event for each character
            input.dispatchEvent(
              new Event("input", {
                bubbles: true,
                inputType: "insertText",
                data: text[i],
              })
            );

            await this.delay(10); // Small delay between characters
          }

          // Method 2: Set value directly and trigger comprehensive events
          input.value = text;

          // Comprehensive event sequence
          const events = [
            new Event("input", { bubbles: true }),
            new Event("change", { bubbles: true }),
            new KeyboardEvent("keydown", { bubbles: true }),
            new KeyboardEvent("keyup", { bubbles: true }),
            new Event("blur", { bubbles: true }),
            new Event("focusout", { bubbles: true }),
          ];

          for (let event of events) {
            input.dispatchEvent(event);
            await this.delay(50);
          }

          // Method 3: Try React-style value setting (Typeform might use React)
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            "value"
          ).set;
          const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLTextAreaElement.prototype,
            "value"
          ).set;

          if (input.tagName === "INPUT") {
            nativeInputValueSetter.call(input, text);
          } else if (input.tagName === "TEXTAREA") {
            nativeTextAreaValueSetter.call(input, text);
          }

          // Final event dispatch
          input.dispatchEvent(new Event("input", { bubbles: true }));
          input.dispatchEvent(new Event("change", { bubbles: true }));

          // Wait and verify
          await this.delay(500);
          const finalValue = input.value;
          console.log(`✅ Input final value: "${finalValue}"`);

          // Additional verification - check if input appears "filled" in UI
          const hasValue = finalValue && finalValue.length > 0;
          if (hasValue) {
            console.log(
              `✅ SUCCESS: Input contains "${finalValue.substring(0, 30)}..."`
            );
            return true;
          } else {
            console.log(`⚠️ WARNING: Input appears empty after fill attempt`);

            // Last resort: try document.execCommand
            input.focus();
            document.execCommand("selectAll", false, null);
            document.execCommand("insertText", false, text);

            await this.delay(200);
            console.log(`🔧 Last resort result: "${input.value}"`);
            return input.value.length > 0;
          }
        } catch (error) {
          console.log(`❌ Failed to fill input: ${error.message}`);
        }
      }
    }

    console.log("❌ No suitable input found");
    return false;
  }

  // Simple approach to clicking rating buttons
  async clickRating(rating) {
    console.log(`⭐ Looking for rating: ${rating}`);

    // Find all clickable elements
    const clickables = document.querySelectorAll(
      'button, [role="button"], [role="radio"], div[data-qa], span[data-qa]'
    );

    for (let element of clickables) {
      const text = element.textContent.trim();
      const ariaLabel = element.getAttribute("aria-label") || "";

      // Check if this element represents our target rating
      if (text === rating.toString() || ariaLabel.includes(rating.toString())) {
        console.log(`Found rating element: "${text}" (${element.tagName})`);

        try {
          element.click();
          console.log(`✅ Clicked rating: ${rating}`);
          await this.delay(500);
          return true;
        } catch (error) {
          console.log(`❌ Failed to click rating: ${error.message}`);
        }
      }
    }

    // Fallback: try to find rating buttons in sequence
    const numberButtons = Array.from(clickables).filter((el) =>
      /^[1-5]$/.test(el.textContent.trim())
    );
    if (numberButtons.length >= rating) {
      console.log(`Fallback: clicking button at position ${rating}`);
      try {
        numberButtons[rating - 1].click();
        console.log(`✅ Clicked rating: ${rating}`);
        return true;
      } catch (error) {
        console.log(`❌ Fallback failed: ${error.message}`);
      }
    }

    console.log(`❌ Could not find rating: ${rating}`);
    return false;
  }

  // Simple approach to clicking multiple choice
  async clickChoice(choiceText) {
    console.log(`☑️ Looking for choice: "${choiceText}"`);

    const clickables = document.querySelectorAll(
      'button, [role="button"], div[data-qa], span[data-qa]'
    );

    for (let element of clickables) {
      const text = element.textContent.trim();

      if (text.includes(choiceText) || choiceText.includes(text)) {
        console.log(`Found choice: "${text}"`);

        try {
          element.click();
          console.log(`✅ Selected: ${choiceText}`);
          await this.delay(500);
          return true;
        } catch (error) {
          console.log(`❌ Failed to click choice: ${error.message}`);
        }
      }
    }

    console.log(`❌ Could not find choice: ${choiceText}`);
    return false;
  }

  // Simple next button clicking
  async clickNext() {
    console.log("🔄 Looking for next button...");

    const buttons = document.querySelectorAll("button");

    for (let button of buttons) {
      const text = button.textContent.toLowerCase().trim();
      const ariaLabel = (button.getAttribute("aria-label") || "").toLowerCase();

      if (
        !button.disabled &&
        (text.includes("ok") ||
          text.includes("next") ||
          text.includes("continue") ||
          text.includes("submit") ||
          ariaLabel.includes("next") ||
          ariaLabel.includes("continue"))
      ) {
        console.log(`Found next button: "${button.textContent.trim()}"`);

        try {
          button.click();
          console.log("✅ Clicked next");
          await this.delay(2000); // Wait for transition
          return true;
        } catch (error) {
          console.log(`❌ Failed to click next: ${error.message}`);
        }
      }
    }

    // Fallback: click the last enabled button
    const enabledButtons = Array.from(buttons).filter((b) => !b.disabled);
    if (enabledButtons.length > 0) {
      const lastButton = enabledButtons[enabledButtons.length - 1];
      console.log(
        `Fallback: clicking last button: "${lastButton.textContent.trim()}"`
      );
      try {
        lastButton.click();
        await this.delay(2000);
        return true;
      } catch (error) {
        console.log(`❌ Fallback failed: ${error.message}`);
      }
    }

    console.log("❌ No next button found");
    return false;
  }

  // Analyze current page to determine question type
  analyzeQuestion() {
    const pageText = document.body.textContent.toLowerCase();
    const hasNumberedButtons =
      document.querySelectorAll("button").length > 0 &&
      Array.from(document.querySelectorAll("button")).some((b) =>
        /^[1-5]$/.test(b.textContent.trim())
      );
    const hasTextInput =
      document.querySelectorAll('input[type="text"], textarea').length > 0;
    const hasLongChoices = Array.from(document.querySelectorAll("button")).some(
      (b) =>
        b.textContent.trim().length > 10 &&
        !b.textContent.toLowerCase().includes("ok")
    );

    console.log("📊 Page Analysis:");
    console.log(`  - Has numbered buttons (1-5): ${hasNumberedButtons}`);
    console.log(`  - Has text input: ${hasTextInput}`);
    console.log(`  - Has long choice buttons: ${hasLongChoices}`);
    console.log(`  - Page contains "name": ${pageText.includes("name")}`);
    console.log(`  - Page contains "rate": ${pageText.includes("rate")}`);
    console.log(`  - Page contains "enjoy": ${pageText.includes("enjoy")}`);

    return { hasNumberedButtons, hasTextInput, hasLongChoices, pageText };
  }

  // Main automation function - step by step
  async fillCurrentQuestion() {
    console.log("\n🎯 PROCESSING CURRENT QUESTION");

    const analysis = this.analyzeQuestion();
    const pageText = analysis.pageText;

    // Determine question type and fill accordingly
    if (analysis.hasNumberedButtons) {
      console.log("🎯 RATING SCALE detected");
      const rating = this.getRandomRating();
      await this.clickRating(rating);
    } else if (analysis.hasLongChoices) {
      console.log("🎯 MULTIPLE CHOICE detected");
      const choice = this.random(this.responses.learningFormats);
      await this.clickChoice(choice);
    } else if (analysis.hasTextInput) {
      console.log("🎯 TEXT INPUT detected");

      let responseText;
      if (pageText.includes("name")) {
        responseText = this.random(this.names);
        console.log("  → Filling NAME");
      } else if (
        pageText.includes("enjoy") ||
        pageText.includes("most about")
      ) {
        responseText = this.random(this.responses.enjoyed);
        console.log("  → Filling POSITIVE FEEDBACK");
      } else if (pageText.includes("improve") || pageText.includes("better")) {
        responseText = this.random(this.responses.improvements);
        console.log("  → Filling IMPROVEMENT FEEDBACK");
      } else {
        responseText = this.random(this.responses.additional);
        console.log("  → Filling ADDITIONAL COMMENTS");
      }

      await this.fillAnyInput(responseText);
    } else {
      console.log("❓ Unknown question type");
      return false;
    }

    return true;
  }

  // Complete survey automation
  async completeSurvey() {
    console.log("🚀 STARTING TYPEFORM AUTOMATION");
    console.log("===============================");

    for (let i = 1; i <= 10; i++) {
      console.log(`\n📝 QUESTION ${i}`);

      // Wait for page to load
      await this.delay(1000);

      // Try to fill current question
      const filled = await this.fillCurrentQuestion();

      if (!filled) {
        console.log("⚠️ Could not fill question, but continuing...");
      }

      // Wait a bit then try to go next
      await this.delay(1000);
      const nextClicked = await this.clickNext();

      if (!nextClicked) {
        console.log("🏁 No next button - survey complete or stuck");
        break;
      }

      // Check if we're done
      await this.delay(1500);
      if (
        window.location.href.includes("thank") ||
        document.body.textContent.toLowerCase().includes("thank you")
      ) {
        console.log("🎉 SURVEY COMPLETED!");
        break;
      }
    }

    console.log("\n✅ AUTOMATION FINISHED");
  }

  // Manual step-by-step helper
  async nextStep() {
    console.log("👆 MANUAL STEP");
    await this.fillCurrentQuestion();
    await this.delay(1000);
    await this.clickNext();
  }
}

// Create instance and provide simple commands
const bot = new SimpleTypeformBot();

console.log(`
🤖 SIMPLE TYPEFORM BOT READY!

Commands:
  bot.completeSurvey()     // Auto-complete entire survey
  bot.nextStep()           // Fill current question and go to next
  bot.fillCurrentQuestion() // Just fill current question
  bot.analyzeQuestion()    // See what the bot detects

Current page analysis:
`);

bot.analyzeQuestion();
