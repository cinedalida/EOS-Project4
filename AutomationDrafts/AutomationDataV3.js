// Typeform Dummy Data Automation Script
// Run this in browser console when the Typeform is open

(function () {
  "use strict";

  // Configuration
  const DELAY_BETWEEN_ACTIONS = 1000; // 1 second delay between actions
  const TYPING_DELAY = 50; // Delay between keystrokes for natural typing

  // Sample data pools
  const sampleNames = [
    "Alex Johnson",
    "Sarah Chen",
    "Michael Rodriguez",
    "Emily Davis",
    "David Thompson",
    "Jessica Wu",
    "Ryan Martinez",
    "Amanda Kim",
    "Christopher Lee",
    "Maria Garcia",
    "James Wilson",
    "Lisa Anderson",
    "Robert Taylor",
    "Jennifer Brown",
    "William Jones",
    "Ashley Miller",
  ];

  const positiveComments = [
    "The hands-on exercises were incredibly valuable and helped solidify my understanding of the concepts.",
    "I really appreciated the collaborative environment and how everyone supported each other throughout the sprint.",
    "The pace was perfect - challenging enough to keep me engaged but not overwhelming.",
    "The real-world examples used in the presentations made the content much more relatable and easier to understand.",
    "I loved the variety of learning activities. It kept things interesting and catered to different learning styles.",
    "The facilitator was knowledgeable and created a safe space for questions and experimentation.",
    "The pair programming sessions were enlightening and I learned so much from my partner.",
    "Great balance between theory and practical application. Everything felt relevant to my work.",
    "The group discussions brought different perspectives that enriched my understanding.",
    "I enjoyed how the sprint built upon previous knowledge and connected concepts together seamlessly.",
  ];

  const improvementSuggestions = [
    "Could benefit from more time allocated to the practical exercises. Some sessions felt rushed.",
    "Would be helpful to have more advanced examples for those who grasp concepts quickly.",
    "Consider providing pre-reading materials to help participants prepare better.",
    "The room setup could be improved for better visibility during presentations.",
    "More frequent breaks would help maintain focus during longer sessions.",
    "Would appreciate having digital copies of all materials shared in advance.",
    "Consider adding more interactive elements to the lecture portions.",
    "Some technical difficulties with the setup delayed progress. Better preparation needed.",
    "Could use more diverse examples that represent different industries and use cases.",
    "Would benefit from clearer learning objectives outlined at the beginning of each session.",
  ];

  const additionalComments = [
    "Overall excellent experience. Looking forward to applying these skills in my daily work.",
    "Thank you for creating such an engaging and informative learning environment.",
    "This format works really well for our team. Would love to see more sprints like this.",
    "Great job adapting to different learning preferences within the group.",
    "The networking opportunities during breaks were an unexpected bonus.",
    "Would recommend this approach to other teams struggling with similar challenges.",
    "Perfect timing for our current project needs. Very practical and applicable.",
    "Appreciate the follow-up resources provided. Will definitely reference them later.",
    "The energy and enthusiasm of the facilitator was contagious and motivating.",
    "Hope we can implement some of these practices in our regular workflow.",
  ];

  const learningFormats = [
    "Hands-on exercises",
    "Group discussions",
    "Presentations/lectures",
    "Pair programming",
    "Independent study",
  ];

  // Utility functions
  function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  function getRandomRating() {
    // Weighted towards positive ratings (3-5)
    const weights = [0.05, 0.1, 0.25, 0.35, 0.25]; // 5% for 1, 10% for 2, 25% for 3, 35% for 4, 25% for 5
    const random = Math.random();
    let cumulative = 0;

    for (let i = 0; i < weights.length; i++) {
      cumulative += weights[i];
      if (random <= cumulative) {
        return i + 1;
      }
    }
    return 5; // fallback
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function typeText(element, text) {
    element.focus();
    element.value = "";

    for (let i = 0; i < text.length; i++) {
      element.value += text[i];
      element.dispatchEvent(new Event("input", { bubbles: true }));
      await sleep(TYPING_DELAY);
    }

    element.dispatchEvent(new Event("change", { bubbles: true }));
    element.dispatchEvent(new Event("blur", { bubbles: true }));
  }

  // Question handlers
  async function handleShortText(questionText, placeholder) {
    console.log(`Handling: ${questionText}`);

    const input = document.querySelector(
      'input[type="text"], input[placeholder*="' +
        placeholder.split(" ")[1] +
        '"]'
    );
    if (input) {
      const name = getRandomElement(sampleNames);
      await typeText(input, name);
      console.log(`✓ Entered name: ${name}`);
    } else {
      console.log("✗ Short text input not found");
    }
  }

  async function handleOpinionScale(questionText) {
    console.log(`Handling: ${questionText}`);

    const rating = getRandomRating();

    // Try different selectors for opinion scale buttons
    const selectors = [
      `button[data-qa="opinion-scale-${rating}"]`,
      `button[aria-label*="${rating}"]`,
      `button[title*="${rating}"]`,
      `.opinion-scale button:nth-child(${rating})`,
      `[data-rating="${rating}"]`,
      `button:contains("${rating}")`,
      `.rating-button[data-value="${rating}"]`,
    ];

    let button = null;
    for (const selector of selectors) {
      button = document.querySelector(selector);
      if (button) break;
    }

    // Fallback: look for buttons with text content matching the rating
    if (!button) {
      const buttons = document.querySelectorAll(
        'button, [role="button"], .clickable'
      );
      button = Array.from(buttons).find(
        (btn) =>
          btn.textContent.trim() === rating.toString() ||
          btn.getAttribute("aria-label")?.includes(rating.toString()) ||
          btn.title?.includes(rating.toString())
      );
    }

    if (button) {
      button.click();
      console.log(`✓ Selected rating: ${rating}`);
    } else {
      console.log(`✗ Opinion scale button for rating ${rating} not found`);
    }
  }

  async function handleLongText(questionText, isPositive = true) {
    console.log(`Handling: ${questionText}`);

    const textarea = document.querySelector("textarea");
    if (textarea) {
      const comments = isPositive ? positiveComments : improvementSuggestions;
      const text = getRandomElement(comments);
      await typeText(textarea, text);
      console.log(`✓ Entered long text (${text.length} chars)`);
    } else {
      console.log("✗ Textarea not found");
    }
  }

  async function handleMultipleChoice() {
    console.log("Handling: Multiple choice question");

    const format = getRandomElement(learningFormats);

    // Try different selectors for multiple choice options
    const selectors = [
      `button:contains("${format}")`,
      `label:contains("${format}")`,
      `[data-qa*="choice"]:contains("${format}")`,
      `.choice:contains("${format}")`,
      `.option:contains("${format}")`,
    ];

    let option = null;

    // Look for buttons or labels containing the format text
    const clickableElements = document.querySelectorAll(
      'button, label, [role="button"], [role="option"], .clickable, .choice, .option'
    );
    option = Array.from(clickableElements).find((el) =>
      el.textContent.toLowerCase().includes(format.toLowerCase())
    );

    if (option) {
      option.click();
      console.log(`✓ Selected: ${format}`);
    } else {
      console.log(`✗ Multiple choice option "${format}" not found`);
    }
  }

  async function handleAdditionalComments() {
    console.log("Handling: Additional comments");

    const textarea = document.querySelector("textarea");
    if (textarea) {
      const comment = getRandomElement(additionalComments);
      await typeText(textarea, comment);
      console.log(`✓ Entered additional comment (${comment.length} chars)`);
    } else {
      console.log("✗ Textarea for additional comments not found");
    }
  }

  async function clickNextButton() {
    // strict selectors
    const nextSelectors = [
      'button[data-qa="next-button"]',
      'button[type="submit"]',
    ];

    for (let selector of nextSelectors) {
      const button = document.querySelector(selector);
      if (button && button.offsetHeight > 0) {
        button.click();
        console.log("✓ Next button clicked (by selector)");
        await sleep(2000);
        return true;
      }
    }

    // fallback
    const allButtons = document.querySelectorAll("button");
    const nextButton = Array.from(allButtons).find((btn) => {
      const text = btn.textContent.toLowerCase().trim();
      return (
        text.includes("next") ||
        text.includes("continue") ||
        text.includes("ok") ||
        text.includes("→")
      );
    });

    if (nextButton) {
      nextButton.click();
      console.log("✓ Next button clicked (by text fallback)");
      await sleep(2000);
      return true;
    }

    console.warn("⚠ No Next button found!");
    return false;
  }

  // Main automation function
  async function automateForm() {
    console.log("🤖 Starting Typeform automation...");

    const questions = [
      {
        type: "shortText",
        text: "What is your full name?",
        handler: () =>
          handleShortText("What is your full name?", "e.g., John Smith"),
      },
      {
        type: "opinionScale",
        text: "Overall, how would you rate this sprint?",
        handler: () =>
          handleOpinionScale("Overall, how would you rate this sprint?"),
      },
      {
        type: "opinionScale",
        text: "How engaged did you feel during this sprint?",
        handler: () =>
          handleOpinionScale("How engaged did you feel during this sprint?"),
      },
      {
        type: "opinionScale",
        text: "How would you rate the difficulty level?",
        handler: () =>
          handleOpinionScale("How would you rate the difficulty level?"),
      },
      {
        type: "opinionScale",
        text: "How likely are you to recommend this sprint format to others?",
        handler: () =>
          handleOpinionScale(
            "How likely are you to recommend this sprint format to others?"
          ),
      },
      {
        type: "longText",
        text: "What did you enjoy most about this sprint?",
        handler: () =>
          handleLongText("What did you enjoy most about this sprint?", true),
      },
      {
        type: "longText",
        text: "What areas need improvement?",
        handler: () => handleLongText("What areas need improvement?", false),
      },
      {
        type: "multipleChoice",
        text: "Which learning format was most effective for you?",
        handler: () => handleMultipleChoice(),
      },
      {
        type: "longText",
        text: "Any additional comments or suggestions?",
        handler: () => handleAdditionalComments(),
      },
    ];

    for (let i = 0; i < questions.length; i++) {
      console.log(`\n📝 Processing question ${i + 1}/${questions.length}`);

      await sleep(DELAY_BETWEEN_ACTIONS);

      // Execute the handler for this question
      await questions[i].handler();

      await sleep(DELAY_BETWEEN_ACTIONS);

      // Click next button (except for the last question which might be submit)
      const success = await clickNextButton();
      if (!success && i < questions.length - 1) {
        console.log(
          "⚠️ Could not proceed to next question. Manual intervention may be required."
        );
        break;
      }
    }

    console.log("🎉 Form automation completed!");
  }

  // Add CSS contains selector support for older browsers
  if (!document.querySelector.toString().includes("contains")) {
    console.log("Adding contains selector support...");
    document.querySelectorAll = function (selector) {
      if (selector.includes(":contains(")) {
        const parts = selector.split(":contains(");
        const baseSelector = parts[0];
        const text = parts[1].replace(")", "").replace(/['"]/g, "");

        const elements = document.querySelectorAll(baseSelector || "*");
        return Array.from(elements).filter((el) =>
          el.textContent.toLowerCase().includes(text.toLowerCase())
        );
      }
      return Document.prototype.querySelectorAll.call(this, selector);
    };
  }

  // Start automation
  console.log("🚀 Typeform Dummy Data Automation loaded!");
  console.log("⚡ Starting in 3 seconds...");

  setTimeout(automateForm, 3000);
})();
