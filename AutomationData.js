function getRandomSprintName() {
  const sprints = [
    "Sprint 2024-Q1-Week1",
    "Sprint 2024-Q1-Week2",
    "Sprint 2024-Q1-Week3",
    "Sprint 2024-Q1-Week4",
    "Sprint 2024-Q2-Week1",
    "Sprint 2024-Q2-Week2",
  ];
  return sprints[Math.floor(Math.random() * sprints.length)];
}

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
    "Carlos Mendez",
    "Sophie Anderson",
    "Jordan Taylor",
    "Priya Sharma",
  ];
  return names[Math.floor(Math.random() * names.length)];
}

function getRandomPositiveFeedback() {
  const feedback = [
    "Great sprint! The hands-on exercises really helped me understand the concepts better. The facilitator was very knowledgeable and answered all our questions thoroughly.",
    "I loved the collaborative approach. Working in pairs made complex topics much easier to grasp. The real-world examples were particularly valuable.",
    "The pace was perfect - not too slow, not too fast. I appreciated having time to practice each concept before moving on to the next one.",
    "Excellent balance between theory and practice. The project-based learning approach kept me engaged throughout the entire sprint.",
    "The facilitator created a very supportive learning environment. I felt comfortable asking questions and making mistakes.",
    "Really enjoyed the interactive discussions. Learning from other participants' experiences added great value to the content.",
    "The material was well-structured and built logically from basic to advanced concepts. Very impressed with the curriculum design.",
  ];
  return feedback[Math.floor(Math.random() * feedback.length)];
}

function getRandomImprovementFeedback() {
  const feedback = [
    "Could benefit from more time for Q&A sessions. Sometimes we moved on before everyone's questions were fully addressed.",
    "Would appreciate more real-world case studies to better understand practical applications of the concepts.",
    "The documentation could be improved. Having better reference materials would help during independent practice.",
    "Perhaps consider smaller group sizes for more personalized attention and feedback.",
    "Would like more advanced exercises for those who finish early to keep everyone challenged.",
    "Better audio/video setup would improve the remote learning experience for virtual participants.",
    "More frequent breaks would help maintain focus during longer sessions.",
    "", // Sometimes no improvement feedback
  ];
  return feedback[Math.floor(Math.random() * feedback.length)];
}

function getRandomLearningFormat() {
  const formats = [
    "Hands-on exercises",
    "Group discussions",
    "Presentations/lectures",
    "Pair programming",
    "Independent study",
  ];
  return formats[Math.floor(Math.random() * formats.length)];
}

function getRandomAdditionalComments() {
  const comments = [
    "Looking forward to the next sprint! This has been a great learning experience.",
    "Thank you for creating such an engaging learning environment.",
    "Would love to see more advanced topics covered in future sprints.",
    "The community aspect of this program is fantastic - great peer learning.",
    "Keep up the excellent work with the curriculum development!",
    "", // Sometimes no additional comments
  ];
  return comments[Math.floor(Math.random() * comments.length)];
}
