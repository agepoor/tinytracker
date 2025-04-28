// Default screen elements
const container = document.getElementById("container");
const title = document.getElementsByTagName("H1")[0];
const habitlist = document.getElementById("habit-list");
const caldays = document.getElementById("cal-days");
const habitedit = document.getElementById("habit-edit");
const habiteditname = document.getElementById("habit-edit-name");
const current_day = new Date().getDay();

// Prompt screen elements
const prompt_container = document.getElementById("habit-prompt-container");
const prompt = document.getElementById("habit-prompt");
const add_habit = document.getElementById("add-habit");
const close_prompt = document.getElementById("close-prompt");
const habit_name = document.getElementById("habit-name");
const habit_days_container = document.getElementById("habit-days");
const habit_days = [...habit_days_container.getElementsByTagName("input")];
const habit_color = document.getElementById("habit-color");
const habit_colors = document
  .getElementById("habit-color")
  .getElementsByTagName("input");

// Action buttons
const reset_tracker = document.getElementById("reset-tracker");
const save_habits = document.getElementById("save-habits");
const import_habits = document.getElementById("import-habits");
const file_input = document.getElementById("file-input");

// Event listeners for action buttons
reset_tracker.addEventListener("click", resetTracker);
save_habits.addEventListener("click", saveHabitsToFile);
import_habits.addEventListener("click", () => file_input.click());
file_input.addEventListener("change", importHabitsFromFile);

// Function to reset the tracker
function resetTracker() {
  const modal = document.getElementById("reset-modal");
  const confirmBtn = document.getElementById("confirm-reset");
  const cancelBtn = document.getElementById("cancel-reset");

  modal.style.display = "flex";

  const handleConfirm = () => {
    habits.forEach((habit) => {
      habit.days = habit.days.map((day) => (day === 2 ? 1 : day));
      habit.finished = false;
    });

    // Reset DOM
    const habitRows = document.querySelectorAll(".habit");
    habitRows.forEach((row) => {
      row.classList.remove("finished");
      const days = row.querySelectorAll(".habit-day");
      days.forEach((day) => {
        if (day.dataset.hDay == 2) {
          day.dataset.hDay = 1;
          const span = day.querySelector("span");
          span.classList.remove("executed");
          span.classList.add("planned");
        }
      });
    });

    updateLocalStorage();
    modal.style.display = "none";
    cleanup();
  };

  const handleCancel = () => {
    modal.style.display = "none";
    cleanup();
  };

  const cleanup = () => {
    confirmBtn.removeEventListener("click", handleConfirm);
    cancelBtn.removeEventListener("click", handleCancel);
  };

  confirmBtn.addEventListener("click", handleConfirm);
  cancelBtn.addEventListener("click", handleCancel);
}

// Function to save habits to a file
function saveHabitsToFile() {
  const blob = new Blob([JSON.stringify(habits, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "habits.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Function to import habits from a file
function importHabitsFromFile(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const importedHabits = JSON.parse(e.target.result);

        // Validate the imported data
        if (
          Array.isArray(importedHabits) &&
          importedHabits.every(
            (habit) =>
              habit.name &&
              habit.color &&
              Array.isArray(habit.days) &&
              habit.days.length === 7 &&
              typeof habit.finished === "boolean"
          )
        ) {
          // Show confirmation modal
          const modal = document.getElementById("template-modal");
          const confirmBtn = document.getElementById("confirm-template");
          const cancelBtn = document.getElementById("cancel-template");

          // Update modal text
          modal.querySelector("h3").textContent = "Import Habits";
          modal.querySelector("p").textContent =
            "Are you sure you want to import these habits? This will replace all your current habits.";
          modal.style.display = "flex";

          const handleConfirm = () => {
            habits = importedHabits;
            habitlist.innerHTML = "";
            addHabits();
            updateLocalStorage();
            modal.style.display = "none";
            cleanup();
          };

          const handleCancel = () => {
            modal.style.display = "none";
            cleanup();
          };

          const cleanup = () => {
            confirmBtn.removeEventListener("click", handleConfirm);
            cancelBtn.removeEventListener("click", handleCancel);
            // Reset modal text
            modal.querySelector("h3").textContent = "Load Template";
            modal.querySelector("p").textContent =
              "Are you sure you want to load this template? This will replace all your current habits.";
          };

          confirmBtn.addEventListener("click", handleConfirm);
          cancelBtn.addEventListener("click", handleCancel);
        } else {
          alert("Invalid habits file format");
        }
      } catch (error) {
        alert("Error reading file: " + error.message);
      }
    };
    reader.readAsText(file);
  }
  // Reset the file input so the same file can be imported again
  e.target.value = "";
}

// Template buttons
const template_beginner = document.getElementById("template-beginner");
const template_medium = document.getElementById("template-medium");
const template_advanced = document.getElementById("template-advanced");

template_beginner.addEventListener("click", () =>
  showTemplateConfirmation("beginner")
);
template_medium.addEventListener("click", () =>
  showTemplateConfirmation("medium")
);
template_advanced.addEventListener("click", () =>
  showTemplateConfirmation("advanced")
);

const template_nutrition = document.getElementById("template-nutrition");
const template_studying = document.getElementById("template-studying");
const template_sports = document.getElementById("template-sports");

template_nutrition.addEventListener("click", () =>
  showTemplateConfirmation("nutrition")
);
template_studying.addEventListener("click", () =>
  showTemplateConfirmation("studying")
);
template_sports.addEventListener("click", () =>
  showTemplateConfirmation("sports")
);

// Function to show template confirmation modal
function showTemplateConfirmation(level) {
  const modal = document.getElementById("template-modal");
  const confirmBtn = document.getElementById("confirm-template");
  const cancelBtn = document.getElementById("cancel-template");

  modal.style.display = "flex";

  const handleConfirm = () => {
    loadTemplate(level);
    modal.style.display = "none";
    cleanup();
  };

  const handleCancel = () => {
    modal.style.display = "none";
    cleanup();
  };

  const cleanup = () => {
    confirmBtn.removeEventListener("click", handleConfirm);
    cancelBtn.removeEventListener("click", handleCancel);
  };

  confirmBtn.addEventListener("click", handleConfirm);
  cancelBtn.addEventListener("click", handleCancel);
}

// Function to load a template
function loadTemplate(level) {
  let templateHabits = [];
  if (level === "beginner") {
    templateHabits = [
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
    ];
  } else if (level === "medium") {
    templateHabits = [
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
    ];
  } else if (level === "advanced") {
    templateHabits = [
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
    ];
  } else if (level === "nutrition") {
    templateHabits = [
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
    ];
  } else if (level === "studying") {
    templateHabits = [
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
    ];
  } else if (level === "sports") {
    templateHabits = [
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
    ];
  }

  habits = templateHabits;
  habitlist.innerHTML = "";
  addHabits();
  updateLocalStorage();
}

// Color options
let colors = [
  "gray",
  "red",
  "pink",
  "grape",
  "violet",
  "indigo",
  "blue",
  "cyan",
  "teal",
  "green",
  "lime",
  "yellow",
  "orange",
];

// Initial habits list
let habitsList = [
  // {
  //   name: "Voetbal",
  //   color: "red",
  //   days: [0, 0, 0, 0, 0, 0, 0],
  //   finished: false,
  // }
];

// Load habits from local storage or use default list
const localStorageHabits = JSON.parse(localStorage.getItem("habits"));
let habits =
  localStorage.getItem("habits") !== null ? localStorageHabits : habitsList;

// Add existing habits to DOM
function addHabits() {
  habits.forEach((habit) => {
    addHabitDOM(habit);
  });
  addEventListeners();
}

// Style calendar days
function styleCalendar() {
  const days = [...document.querySelectorAll(".cal-day")].slice(
    0,
    current_day - 1
  );
  days.forEach((item) => {
    item.classList.add("past");
  });
}

// Add color options to the color picker
function addColors() {
  colors.forEach((i) => {
    addColorInput(i);
  });
  habit_color.children[0].children[0].checked = true;
}

// Add a single color option to the color picker
function addColorInput(color) {
  const colorItem = `<label class="${color}">${color}<input type="radio" name="color" class="${color}" id="${color}" value="${color}"><span class="radio ${color}"></span></label>`;
  habit_color.innerHTML += colorItem;
}

// Initialize habits, calendar, and colors
addHabits();
styleCalendar();
addColors();

// Add a habit to the DOM
function addHabitDOM(habit) {
  const habitRow = document.createElement("tr");
  habitRow.classList.add("habit");
  habitRow.classList.add(habit.color);
  if (habit.finished) {
    habitRow.classList.add("finished");
  }

  habitRow.setAttribute("data-h-title", habit.name);

  let habitDaysHTML = "";
  habit.days.forEach((day, index) => {
    habitDaysHTML += `<td class="habit-day" data-h-day="${day}"></td>`;
  });

  habitRow.innerHTML = `
    <td class="habit-context">
      <button class="habit-context-btn">
        <i class="fas fa-ellipsis-v"></i>
      </button>
    </td>
    <td class="habit-name"><h3>${habit.name}</h3></td>
    ${habitDaysHTML}
  `;

  habitlist.appendChild(habitRow);

  // Add context menu handlers for the new habit
  const contextBtn = habitRow.querySelector(".habit-context-btn");
  contextBtn.addEventListener("click", handleContextMenu);
  contextBtn.addEventListener("contextmenu", handleContextMenu);

  addHabitDaysDOM();
}

// Handle context menu events
function handleContextMenu(e) {
  e.preventDefault();
  e.stopPropagation();
  const habitRow = e.target.closest(".habit");
  const contextMenu = document.querySelector(".context-menu");

  contextMenu.style.display = "flex";
  contextMenu.style.top = `${e.clientY + window.scrollY}px`;
  contextMenu.style.left = `${e.clientX + window.scrollY}px`;

  const editItem = contextMenu.querySelector(".context-menu-item:nth-child(1)");
  const deleteItem = contextMenu.querySelector(
    ".context-menu-item:nth-child(2)"
  );

  editItem.onclick = () => {
    showEditModal(habitRow);
    contextMenu.style.display = "none";
  };

  deleteItem.onclick = () => {
    showDeleteConfirmation(habitRow);
    contextMenu.style.display = "none";
  };
}

// Insert habit states into the DOM
function addHabitDaysDOM() {
  const habitDays = document.querySelectorAll(".habit-day");

  habitDays.forEach((item) => {
    if (item.dataset.hDay == 0) {
      item.innerHTML = `<span><i class="fas fa-check"></i></span>`;
    } else if (item.dataset.hDay == 1) {
      item.innerHTML = `<span class="planned"><i class="fas fa-check"></i></span>`;
    } else {
      item.innerHTML = `<span class="executed"><i class="fas fa-check"></i></span>`;
    }

    item.addEventListener("click", updateHabits);
  });
}

// Sound effects
const clickSound = new Audio("raw/main/assets/ding.mp3");
clickSound.volume = 0.2; // Not too loud, just a subtle tick

const applauseSound = new Audio("raw/main/assets/applause.mp3");
applauseSound.volume = 0.5; // A bit louder for the applause

const applauseCheerSound = new Audio("raw/main/assets/applause-cheer.mp3");
applauseCheerSound.volume = 0.5; // Even louder for the cheer

const discoFunkSound = new Audio("raw/main/assets/disco-funk.mp3");
discoFunkSound.volume = 0.5; // Funky disco sound

const bongoDrumSound = new Audio("raw/main/assets/bongo-and-drum.mp3");
bongoDrumSound.volume = 0.5; // Bongo and drum sound

let currentAnimationTimeout = null;
let currentSound = null;

// Stop current sound and animation
function stopCurrentEffect() {
  if (currentAnimationTimeout) {
    clearTimeout(currentAnimationTimeout);
    currentAnimationTimeout = null;
  }
  if (currentSound) {
    currentSound.pause();
    currentSound.currentTime = 0;
    currentSound = null;
  }
  document.body.classList.remove("ecstatic", "disco", "banana");
}

// Update habits after click
function updateHabits() {
  const spanElement = this.children[0];
  const habit_title = this.parentNode.dataset.hTitle;
  const habit_container = this.parentNode;
  // Fix: Account for both context menu button and habit name columns
  const day_index = [...this.parentNode.children].indexOf(this) - 2;
  let habit_state = false;

  if (this.dataset.hDay == 0) {
    this.dataset.hDay = 1;
    spanElement.classList.add("planned");
  } else if (this.dataset.hDay == 1) {
    this.dataset.hDay = 2;
    spanElement.classList.remove("planned");
    spanElement.classList.add("executed");
    clickSound.currentTime = 0;
    clickSound.play();
  } else {
    this.dataset.hDay = 0;
    spanElement.classList.remove("executed");
  }

  // Check all days excluding context menu and name columns
  const days = [...habit_container.children].slice(2);
  const hasPlannedDays = days.some((day) => day.dataset.hDay == 1);
  const hasExecutedDays = days.some((day) => day.dataset.hDay == 2);

  if (!hasPlannedDays && hasExecutedDays && this.dataset.hDay != 0) {
    habit_state = true;
    habit_container.classList.add("finished");
  } else {
    habit_state = false;
    habit_container.classList.remove("finished");
  }

  updateHabitsData(habit_title, day_index, this.dataset.hDay, habit_state);

  // Check if all habits are finished and no checkmark was set to 0
  const allFinished = habits.every((habit) => habit.finished);
  if (allFinished) {
    stopCurrentEffect();
    const effects = [
      { sound: applauseCheerSound, animation: "ecstatic", duration: 8000 },
      { sound: discoFunkSound, animation: "disco", duration: 15000 },
      { sound: bongoDrumSound, animation: "banana", duration: 15000 },
    ];
    const randomEffect = effects[Math.floor(Math.random() * effects.length)];

    randomEffect.sound.currentTime = 0; // Reset sound in case it's still playing
    randomEffect.sound.play(); // Play the random sound
    currentSound = randomEffect.sound;
    document.body.classList.add(randomEffect.animation); // Add random animation to body
    currentAnimationTimeout = setTimeout(() => {
      document.body.classList.remove(randomEffect.animation);
      currentSound = null;
    }, randomEffect.duration); // Remove animation after specified duration
  } else if (habit_state) {
    stopCurrentEffect();
    applauseSound.currentTime = 0; // Reset sound in case it's still playing
    applauseSound.play(); // Play the applause sound
    currentSound = applauseSound;
    habit_container.classList.add("celebrate"); // Add celebration animation
    currentAnimationTimeout = setTimeout(() => {
      habit_container.classList.remove("celebrate");
      currentSound = null;
    }, 15000); // Remove animation after 15 seconds
  }
}

// Update habits data
function updateHabitsData(name, index, data, state) {
  habits.forEach((item) => {
    if (item.name == name) {
      item.days[index] = parseInt(data);
      item.finished = state;
    }
  });

  updateLocalStorage();
}

// Update local storage
function updateLocalStorage() {
  localStorage.setItem("habits", JSON.stringify(habits));
}

// Show prompt for adding a new habit
function showPrompt() {
  const promptContainer = document.getElementById("habit-prompt-container");
  promptContainer.style.display = "flex";

  // Reset form
  habit_name.value = "";
  habit_days.forEach((day) => (day.checked = false));
  habit_colors[0].checked = true;

  // Focus on input
  habit_name.focus();

  // Add escape key handler
  const handleEscape = (e) => {
    if (e.key === "Escape") {
      closePrompt(e);
      document.removeEventListener("keydown", handleEscape);
    }
  };
  document.addEventListener("keydown", handleEscape);
}

// Close the prompt
function closePrompt(e) {
  e.preventDefault();
  document.getElementById("habit-prompt-container").style.display = "none";
}

// Add a new habit
function addHabit(e) {
  e.preventDefault();

  // Boolean function for namecheck
  const names = habits.map((item) => item.name);
  const doubleCheck = (item) => item === habit_name.value;

  if (habit_name.value.trim() === "") {
    alert("Please enter a habit name");
    return;
  }

  if (names.some(doubleCheck) === false) {
    const days = [];

    habit_days.forEach((item) => {
      if (item.checked == false) {
        days.push(0);
      } else {
        days.push(1);
      }
    });

    let color = "";
    [...habit_colors].forEach((i) => {
      if (i.checked == true) {
        color = i.value;
      }
    });

    const habit = {
      name: habit_name.value,
      days: days,
      color: color,
      finished: false,
    };

    habits.push(habit);
    addHabitDOM(habit);
    addEventListeners();
    updateLocalStorage();
    document.getElementById("habit-prompt-container").style.display = "none";
  } else {
    alert("A habit with this name already exists");
  }
}

// Event listeners
add_habit.addEventListener("click", addHabit);
close_prompt.addEventListener("click", closePrompt);

// Add Event Listeners (for griplines, color edit button and delete button)
function addEventListeners() {
  const deleteElements = document.querySelectorAll(".habit-delete");
  const colorElements = document.querySelectorAll(".color-edit");

  deleteElements.forEach((item) => {
    item.addEventListener("click", deleteHabit);
  });
  colorElements.forEach((item) => {
    item.addEventListener("click", changeColor);
    item.addEventListener("contextmenu", changeColor);
  });
}

// Delete a habit
function deleteHabit() {
  const nameHabit = this.parentNode.dataset.hTitle;
  const filteredHabits = habits.filter((item) => item.name !== nameHabit);
  habits = filteredHabits;
  this.parentNode.remove();
  updateLocalStorage();
}

// Change habit color
function changeColor(e) {
  e.preventDefault();
  const currentName = this.parentNode.innerText.trim();
  let indexCurrentColor = colors.findIndex(
    (i) => i == habits.filter((item) => item.name == currentName)[0].color
  );
  const indexCurrentName = habits.findIndex((i) => i.name == currentName);
  const oldColor = habits[indexCurrentName].color;

  if (e.type === "click") {
    leftClick();
  } else if ("contextmenu") {
    rightClick();
  }

  function leftClick() {
    if (colors.length - 1 == indexCurrentColor) {
      habits[indexCurrentName].color = colors[0];
    } else {
      habits[indexCurrentColor].color = colors[indexCurrentColor + 1];
    }
  }

  function rightClick() {
    if (indexCurrentColor == 0) {
      habits[indexCurrentName].color = colors[colors.length - 1];
    } else {
      habits[indexCurrentName].color = colors[indexCurrentColor - 1];
    }
  }

  this.parentNode.parentNode.parentNode.classList.remove(oldColor);
  this.parentNode.parentNode.parentNode.classList.add(
    habits[indexCurrentName].color
  );

  updateLocalStorage();
}

/* Swap elements (not used yet) */
function swapElements(list, position1, position2) {
  temp = list[position1];

  list[position1] = list[position2];
  list[position2] = temp;

  updateLocalStorage();
}

// Dark mode toggle
const darkModeToggle = document.getElementById("dark-mode-toggle");
const moonIcon = darkModeToggle.querySelector("i");
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
const currentTheme = localStorage.getItem("theme");

// Set initial theme based on user preference or system settings
if (currentTheme === "dark" || (!currentTheme && prefersDarkScheme.matches)) {
  document.body.setAttribute("data-theme", "dark");
  moonIcon.classList.remove("fa-moon");
  moonIcon.classList.add("fa-sun");
}

// Toggle dark mode on button click
darkModeToggle.addEventListener("click", () => {
  if (document.body.getAttribute("data-theme") === "dark") {
    document.body.removeAttribute("data-theme");
    localStorage.setItem("theme", "light");
    moonIcon.classList.remove("fa-sun");
    moonIcon.classList.add("fa-moon");
  } else {
    document.body.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
    moonIcon.classList.remove("fa-moon");
    moonIcon.classList.add("fa-sun");
  }
});

// Highlight the current day in the calendar
const currentDayIndex = new Date().getDay();
const calDays = document.querySelectorAll(".cal-day");
calDays[currentDayIndex === 0 ? 6 : currentDayIndex - 1].classList.add(
  "current-day"
);

// Handle Enter key press for modals
function handleEnterKey(modal, confirmButton) {
  modal.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      confirmButton.click();
    }
  });
}

// Edit habit modal function - moved outside DOMContentLoaded for global access
function showEditModal(habitRow) {
  const editModal = document.getElementById("edit-modal");
  const editForm = document.getElementById("edit-form");
  const editNameInput = document.getElementById("edit-name");
  const editColorsContainer = document.getElementById("edit-colors");

  const habitName = habitRow.querySelector(".habit-name h3").textContent;
  const habitColor = habitRow.classList[1];

  editNameInput.value = habitName;
  editColorsContainer.innerHTML = colors
    .map(
      (color) => `
    <label class="color-btn">
      <input type="radio" name="edit-color" value="${color}" ${
        color === habitColor ? "checked" : ""
      }>
      <span class="radio ${color}"></span>
    </label>
  `
    )
    .join("");

  editModal.style.display = "flex";
}

// DOMContentLoaded event to initialize event listeners and context menu
document.addEventListener("DOMContentLoaded", () => {
  const helpButton = document.getElementById("help-button");
  const helpModal = document.getElementById("help-modal");
  const closeHelpButton = document.getElementById("close-help");

  // Show help modal
  helpButton.addEventListener("click", () => {
    helpModal.style.display = "flex";
  });

  // Close help modal
  closeHelpButton.addEventListener("click", () => {
    helpModal.style.display = "none";
  });

  // Create context menu
  const contextMenu = document.createElement("div");
  contextMenu.classList.add("context-menu");
  contextMenu.innerHTML = `
    <div class="context-menu-item">Edit</div>
    <div class="context-menu-item">Delete</div>
  `;
  document.body.appendChild(contextMenu);

  // Hide context menu when clicking outside
  document.addEventListener("click", (e) => {
    if (
      !e.target.closest(".context-menu") &&
      !e.target.closest(".habit-context-btn")
    ) {
      contextMenu.style.display = "none";
    }
  });

  // Show context menu on right-click
  document.addEventListener("contextmenu", (e) => {
    if (e.target.closest(".habit-context-btn")) {
      e.preventDefault();
      const habitRow = e.target.closest(".habit");
      contextMenu.style.display = "flex";
      // Adjust for scrolling
      contextMenu.style.top = `${e.clientY + window.scrollY}px`;
      contextMenu.style.left = `${e.clientX + window.scrollY}px`;

      const editItem = contextMenu.querySelector(
        ".context-menu-item:nth-child(1)"
      );
      const deleteItem = contextMenu.querySelector(
        ".context-menu-item:nth-child(2)"
      );

      editItem.onclick = () => {
        habitRow.querySelector(".habit-edit-button").click();
        contextMenu.style.display = "none";
      };

      deleteItem.onclick = () => {
        showDeleteConfirmation(habitRow);
        contextMenu.style.display = "none";
      };
    } else {
      contextMenu.style.display = "none";
    }
  });

  // Attach context menu to habit buttons
  document.querySelectorAll(".habit-context-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      const habitRow = e.target.closest(".habit");
      contextMenu.style.display = "flex";
      // Adjust for scrolling
      contextMenu.style.top = `${e.clientY + window.scrollY}px`;
      contextMenu.style.left = `${e.clientX + window.scrollY}px`;

      const editItem = contextMenu.querySelector(
        ".context-menu-item:nth-child(1)"
      );
      const deleteItem = contextMenu.querySelector(
        ".context-menu-item:nth-child(2)"
      );

      editItem.onclick = () => {
        showEditModal(habitRow);
        contextMenu.style.display = "none";
      };

      deleteItem.onclick = () => {
        showDeleteConfirmation(habitRow);
        contextMenu.style.display = "none";
      };
    });
  });

  // Show delete confirmation modal
  const showDeleteConfirmation = (habitRow) => {
    const modal = document.getElementById("delete-modal");
    const confirmBtn = document.getElementById("confirm-delete");
    const cancelBtn = document.getElementById("cancel-delete");

    modal.style.display = "flex";

    const handleConfirm = () => {
      habitRow.remove();
      const nameHabit = habitRow.dataset.hTitle;
      habits = habits.filter((habit) => habit.name !== nameHabit);
      updateLocalStorage();
      modal.style.display = "none";
      cleanup();
    };

    const handleCancel = () => {
      modal.style.display = "none";
      cleanup();
    };

    const cleanup = () => {
      confirmBtn.removeEventListener("click", handleConfirm);
      cancelBtn.removeEventListener("click", handleCancel);
    };

    confirmBtn.addEventListener("click", handleConfirm);
    cancelBtn.addEventListener("click", handleCancel);
  };

  // Edit habit modal elements
  const editModal = document.getElementById("edit-modal");
  const editForm = document.getElementById("edit-form");
  const editNameInput = document.getElementById("edit-name");
  const editColorsContainer = document.getElementById("edit-colors");
  const cancelEditButton = document.getElementById("cancel-edit");
  const saveEditButton = document.getElementById("save-edit");

  let currentEditHabit = null;

  // Show edit modal (just update currentEditHabit)
  const originalShowEditModal = showEditModal;
  showEditModal = function (habitRow) {
    currentEditHabit = habitRow;
    originalShowEditModal(habitRow);
  };

  // Cancel edit
  cancelEditButton.addEventListener("click", (e) => {
    e.preventDefault();
    editModal.style.display = "none";
  });

  // Save edited habit
  saveEditButton.addEventListener("click", (e) => {
    e.preventDefault();
    const newName = editNameInput.value.trim();
    const newColor = editForm.querySelector(
      'input[name="edit-color"]:checked'
    ).value;

    if (newName && newColor) {
      const oldName =
        currentEditHabit.querySelector(".habit-name h3").textContent;
      currentEditHabit.querySelector(".habit-name h3").textContent = newName;
      currentEditHabit.classList.remove(currentEditHabit.classList[1]);
      currentEditHabit.classList.add(newColor);

      const habitIndex = habits.findIndex((habit) => habit.name === oldName);
      habits[habitIndex].name = newName;
      habits[habitIndex].color = newColor;

      updateLocalStorage();
      editModal.style.display = "none";
    } else {
      alert("Please enter a valid name and select a color.");
    }
  });

  // Handle Enter key for modals
  const resetModal = document.getElementById("reset-modal");
  const confirmResetButton = document.getElementById("confirm-reset");
  handleEnterKey(resetModal, confirmResetButton);

  const templateModal = document.getElementById("template-modal");
  const confirmTemplateButton = document.getElementById("confirm-template");
  handleEnterKey(templateModal, confirmTemplateButton);

  const deleteModal = document.getElementById("delete-modal");
  const confirmDeleteButton = document.getElementById("confirm-delete");
  handleEnterKey(deleteModal, confirmDeleteButton);

  handleEnterKey(helpModal, closeHelpButton);

  handleEnterKey(editModal, saveEditButton);
});
