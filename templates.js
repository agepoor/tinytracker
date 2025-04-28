// Habit templates for different levels and categories
const templates = {
  beginner: [
    {
      name: "💧 Drink Water",
      color: "blue",
      days: [1, 1, 1, 1, 1, 0, 0],
      finished: false,
    },
    {
      name: "🚶 Take a Walk",
      color: "green",
      days: [1, 0, 1, 0, 1, 0, 0],
      finished: false,
    },
    {
      name: "🧘 Stretch",
      color: "cyan",
      days: [1, 1, 1, 1, 1, 0, 0],
      finished: false,
    },
  ],

  medium: [
    {
      name: "💪 Exercise",
      color: "red",
      days: [1, 0, 1, 0, 1, 0, 0],
      finished: false,
    },
    {
      name: "📚 Read 20min",
      color: "yellow",
      days: [1, 1, 1, 1, 1, 0, 0],
      finished: false,
    },
    {
      name: "🧘‍♂️ Meditate",
      color: "violet",
      days: [1, 1, 0, 1, 1, 0, 0],
      finished: false,
    },
    {
      name: "🍎 No Snacks",
      color: "orange",
      days: [1, 1, 1, 1, 1, 0, 0],
      finished: false,
    },
  ],

  advanced: [
    {
      name: "🏃 5km Run",
      color: "orange",
      days: [1, 0, 1, 0, 1, 0, 0],
      finished: false,
    },
    {
      name: "💻 Code 1hr",
      color: "cyan",
      days: [1, 1, 1, 0, 1, 0, 0],
      finished: false,
    },
    {
      name: "🥗 Meal Prep",
      color: "pink",
      days: [0, 0, 0, 0, 0, 1, 0],
      finished: false,
    },
    {
      name: "📔 Journal",
      color: "violet",
      days: [1, 1, 1, 1, 1, 0, 0],
      finished: false,
    },
    {
      name: "🚿 Cold Shower",
      color: "blue",
      days: [1, 1, 1, 1, 1, 0, 0],
      finished: false,
    },
  ],

  nutrition: [
    {
      name: "🍎 Eat Fruit",
      color: "green",
      days: [1, 1, 1, 1, 1, 1, 1],
      finished: false,
    },
    {
      name: "🥗 Eat Vegetables",
      color: "lime",
      days: [1, 1, 1, 1, 1, 1, 1],
      finished: false,
    },
    {
      name: "🍳 Healthy Breakfast",
      color: "yellow",
      days: [1, 1, 1, 1, 1, 1, 1],
      finished: false,
    },
    {
      name: "🍗 Protein Intake",
      color: "red",
      days: [1, 1, 1, 1, 1, 1, 1],
      finished: false,
    },
  ],

  studying: [
    {
      name: "📚 Study 1hr",
      color: "blue",
      days: [1, 1, 1, 1, 1, 0, 0],
      finished: false,
    },
    {
      name: "📝 Review Notes",
      color: "cyan",
      days: [1, 1, 1, 1, 1, 0, 0],
      finished: false,
    },
    {
      name: "📖 Read Textbook",
      color: "indigo",
      days: [1, 1, 1, 1, 1, 0, 0],
      finished: false,
    },
    {
      name: "🧠 Practice Problems",
      color: "violet",
      days: [1, 1, 1, 1, 1, 0, 0],
      finished: false,
    },
  ],

  sports: [
    {
      name: "⚽ Soccer Practice",
      color: "green",
      days: [1, 0, 1, 0, 0, 0, 0],
      finished: false,
    },
    {
      name: "🏋️‍♂️ Gym Workout",
      color: "red",
      days: [0, 1, 0, 1, 0, 1, 0],
      finished: false,
    },
    {
      name: "🏊‍♂️ Swimming",
      color: "blue",
      days: [1, 0, 0, 1, 0, 0, 0],
      finished: false,
    },
    {
      name: "🚴‍♂️ Cycling",
      color: "yellow",
      days: [0, 1, 0, 0, 1, 0, 0],
      finished: false,
    },
  ],
};
