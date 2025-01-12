/* Default screen */
const container = document.getElementById("container");
const title = document.getElementsByTagName("H1")[0];
const habitlist = document.getElementById("habit-list");
const caldays = document.getElementById("cal-days");
const habitedit = document.getElementById("habit-edit");
const habiteditname = document.getElementById("habit-edit-name");
const current_day = new Date().getDay();

/* Prompt screen */
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

const reset_tracker = document.getElementById("reset-tracker");
const save_habits = document.getElementById("save-habits");
const import_habits = document.getElementById("import-habits");
const file_input = document.getElementById("file-input");

reset_tracker.addEventListener("click", resetTracker);
save_habits.addEventListener("click", saveHabitsToFile);
import_habits.addEventListener("click", () => file_input.click());
file_input.addEventListener("change", importHabitsFromFile);

function resetTracker() {
  const modal = document.getElementById('reset-modal');
  const confirmBtn = document.getElementById('confirm-reset');
  const cancelBtn = document.getElementById('cancel-reset');

  modal.style.display = 'flex';
  
  const handleConfirm = () => {
    habits.forEach(habit => {
      habit.days = habit.days.map(day => day === 2 ? 1 : day);
      habit.finished = false;
    });
    
    // Reset DOM
    const habitRows = document.querySelectorAll('.habit');
    habitRows.forEach(row => {
      row.classList.remove('finished');
      const days = row.querySelectorAll('.habit-day');
      days.forEach(day => {
        if (day.dataset.hDay == 2) {
          day.dataset.hDay = 1;
          const span = day.querySelector('span');
          span.classList.remove('executed');
          span.classList.add('planned');
        }
      });
    });
    
    updateLocalStorage();
    modal.style.display = 'none';
    cleanup();
  };
  
  const handleCancel = () => {
    modal.style.display = 'none';
    cleanup();
  };
  
  const cleanup = () => {
    confirmBtn.removeEventListener('click', handleConfirm);
    cancelBtn.removeEventListener('click', handleCancel);
  };
  
  confirmBtn.addEventListener('click', handleConfirm);
  cancelBtn.addEventListener('click', handleCancel);
}

function saveHabitsToFile() {
  const blob = new Blob([JSON.stringify(habits, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "habits.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function importHabitsFromFile(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const importedHabits = JSON.parse(e.target.result);
        
        // Validate the imported data
        if (Array.isArray(importedHabits) && importedHabits.every(habit => 
          habit.name && 
          habit.color && 
          Array.isArray(habit.days) && 
          habit.days.length === 7 &&
          typeof habit.finished === 'boolean'
        )) {
          // Show confirmation modal
          const modal = document.getElementById('template-modal');
          const confirmBtn = document.getElementById('confirm-template');
          const cancelBtn = document.getElementById('cancel-template');
          
          // Update modal text
          modal.querySelector('h3').textContent = 'Import Habits';
          modal.querySelector('p').textContent = 'Are you sure you want to import these habits? This will replace all your current habits.';
          modal.style.display = 'flex';
          
          const handleConfirm = () => {
            habits = importedHabits;
            habitlist.innerHTML = "";
            addHabits();
            updateLocalStorage();
            modal.style.display = 'none';
            cleanup();
          };
          
          const handleCancel = () => {
            modal.style.display = 'none';
            cleanup();
          };
          
          const cleanup = () => {
            confirmBtn.removeEventListener('click', handleConfirm);
            cancelBtn.removeEventListener('click', handleCancel);
            // Reset modal text
            modal.querySelector('h3').textContent = 'Load Template';
            modal.querySelector('p').textContent = 'Are you sure you want to load this template? This will replace all your current habits.';
          };
          
          confirmBtn.addEventListener('click', handleConfirm);
          cancelBtn.addEventListener('click', handleCancel);
        } else {
          alert('Invalid habits file format');
        }
      } catch (error) {
        alert('Error reading file: ' + error.message);
      }
    };
    reader.readAsText(file);
  }
  // Reset the file input so the same file can be imported again
  e.target.value = '';
}

const template_beginner = document.getElementById("template-beginner");
const template_medium = document.getElementById("template-medium");
const template_advanced = document.getElementById("template-advanced");

template_beginner.addEventListener("click", () => showTemplateConfirmation("beginner"));
template_medium.addEventListener("click", () => showTemplateConfirmation("medium"));
template_advanced.addEventListener("click", () => showTemplateConfirmation("advanced"));

function showTemplateConfirmation(level) {
  const modal = document.getElementById('template-modal');
  const confirmBtn = document.getElementById('confirm-template');
  const cancelBtn = document.getElementById('cancel-template');
  
  modal.style.display = 'flex';
  
  const handleConfirm = () => {
    loadTemplate(level);
    modal.style.display = 'none';
    cleanup();
  };
  
  const handleCancel = () => {
    modal.style.display = 'none';
    cleanup();
  };
  
  const cleanup = () => {
    confirmBtn.removeEventListener('click', handleConfirm);
    cancelBtn.removeEventListener('click', handleCancel);
  };
  
  confirmBtn.addEventListener('click', handleConfirm);
  cancelBtn.addEventListener('click', handleCancel);
}

function loadTemplate(level) {
  let templateHabits = [];
  if (level === "beginner") {
    templateHabits = [
      { name: "Drink Water", color: "blue", days: [1, 1, 1, 1, 1, 0, 0], finished: false },
      { name: "Take a Walk", color: "green", days: [1, 0, 1, 0, 1, 0, 0], finished: false },
      { name: "Stretch", color: "cyan", days: [1, 1, 1, 1, 1, 0, 0], finished: false }
    ];
  } else if (level === "medium") {
    templateHabits = [
      { name: "Exercise", color: "red", days: [1, 0, 1, 0, 1, 0, 0], finished: false },
      { name: "Read 20min", color: "yellow", days: [1, 1, 1, 1, 1, 0, 0], finished: false },
      { name: "Meditate", color: "violet", days: [1, 1, 0, 1, 1, 0, 0], finished: false },
      { name: "No Snacks", color: "orange", days: [1, 1, 1, 1, 1, 0, 0], finished: false }
    ];
  } else if (level === "advanced") {
    templateHabits = [
      { name: "5km Run", color: "orange", days: [1, 0, 1, 0, 1, 0, 0], finished: false },
      { name: "Code 1hr", color: "cyan", days: [1, 1, 1, 0, 1, 0, 0], finished: false },
      { name: "Meal Prep", color: "pink", days: [0, 0, 0, 0, 0, 1, 0], finished: false },
      { name: "Journal", color: "violet", days: [1, 1, 1, 1, 1, 0, 0], finished: false },
      { name: "Cold Shower", color: "blue", days: [1, 1, 1, 1, 1, 0, 0], finished: false }
    ];
  }

  habits = templateHabits;
  habitlist.innerHTML = "";
  addHabits();
  updateLocalStorage();
}

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

let habitsList = [
  // {
  //   name: "Voetbal",
  //   color: "red",
  //   days: [0, 0, 0, 0, 0, 0, 0],
  //   finished: false,
  // }
];

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
// Update styleCalendar function to work with table header cells
function styleCalendar() {
  const days = [...document.querySelectorAll('.cal-day')].slice(0, current_day - 1);
  days.forEach((item) => {
    item.classList.add("past");
  });
}

function addColors() {
  colors.forEach((i) => {
    addColorInput(i);
  });
  habit_color.children[0].children[0].checked = true;
}

function addColorInput(color) {
  const colorItem = `<label class="${color}">${color}<input type="radio" name="color" class="${color}" id="${color}" value="${color}"><span class="radio ${color}"></span></label>`;
  habit_color.innerHTML += colorItem;
}

addHabits();
styleCalendar();
addColors();

// Adds habit items to DOM
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
    <td class="habit-name"><h3>${habit.name}</h3></td>
    ${habitDaysHTML}
  `;

  habitlist.appendChild(habitRow);
  addHabitDaysDOM();
}

// Inserts habit states into DOM
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

// Updates habit day data attributes and styles after click
const clickSound = new Audio('raw/main/assets/ding.mp3');
clickSound.volume = 0.2; // Not too loud, just a subtle tick

const applauseSound = new Audio('raw/main/assets/applause.mp3');
applauseSound.volume = 0.5; // A bit louder for the applause

const applauseCheerSound = new Audio('raw/main/assets/applause-cheer.mp3');
applauseCheerSound.volume = 0.5; // Even louder for the cheer

const discoFunkSound = new Audio('raw/main/assets/disco-funk.mp3');
discoFunkSound.volume = 0.5; // Funky disco sound

const bongoDrumSound = new Audio('raw/main/assets/bongo-and-drum.mp3');
bongoDrumSound.volume = 0.5; // Bongo and drum sound

let currentAnimationTimeout = null;
let currentSound = null;

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

function updateHabits() {
  const spanElement = this.children[0];
  const habit_title = this.parentNode.dataset.hTitle;
  const habit_container = this.parentNode;
  const day_index = [...this.parentNode.children].indexOf(this) - 1; // Subtract 1 to account for habit name cell
  let habit_state = false;

  if (this.dataset.hDay == 0) {
    this.dataset.hDay = 1;
    spanElement.classList.add("planned");
  } else if (this.dataset.hDay == 1) {
    this.dataset.hDay = 2;
    spanElement.classList.remove("planned");
    spanElement.classList.add("executed");
    clickSound.currentTime = 0;  // Reset sound in case it's still playing
    clickSound.play();  // Play the tick sound
  } else {
    this.dataset.hDay = 0;
    spanElement.classList.remove("executed");
  }

  // Check if all days are either executed (2) or empty (0) - no planned days (1)
  const days = [...habit_container.children].slice(1); // Skip the habit name cell
  const hasPlannedDays = days.some(day => day.dataset.hDay == 1);
  const hasExecutedDays = days.some(day => day.dataset.hDay == 2);
  
  // Set finished state if there are no planned days and at least one executed day
  if (!hasPlannedDays && hasExecutedDays && this.dataset.hDay != 0) {
    habit_state = true;
    habit_container.classList.add("finished");
  } else {
    habit_state = false;
    habit_container.classList.remove("finished");
  }

  updateHabitsData(habit_title, day_index, this.dataset.hDay, habit_state);

  // Check if all habits are finished and no checkmark was set to 0
  const allFinished = habits.every(habit => habit.finished);
  if (allFinished) {
    stopCurrentEffect();
    const effects = [
      { sound: applauseCheerSound, animation: "ecstatic", duration: 8000 },
      { sound: discoFunkSound, animation: "disco", duration: 15000 },
      { sound: bongoDrumSound, animation: "banana", duration: 15000 }
    ];
    const randomEffect = effects[Math.floor(Math.random() * effects.length)];
    
    randomEffect.sound.currentTime = 0;  // Reset sound in case it's still playing
    randomEffect.sound.play();  // Play the random sound
    currentSound = randomEffect.sound;
    document.body.classList.add(randomEffect.animation);  // Add random animation to body
    currentAnimationTimeout = setTimeout(() => {
      document.body.classList.remove(randomEffect.animation);
      currentSound = null;
    }, randomEffect.duration);  // Remove animation after specified duration
  } else if (habit_state) {
    stopCurrentEffect();
    applauseSound.currentTime = 0;  // Reset sound in case it's still playing
    applauseSound.play();  // Play the applause sound
    currentSound = applauseSound;
    habit_container.classList.add("celebrate");  // Add celebration animation
    currentAnimationTimeout = setTimeout(() => {
      habit_container.classList.remove("celebrate");
      currentSound = null;
    }, 15000);  // Remove animation after 15 seconds
  }
}

// Updates Habits Object
function updateHabitsData(name, index, data, state) {
  habits.forEach((item) => {
    if (item.name == name) {
      item.days[index] = parseInt(data);
      item.finished = state;
    }
  });

  updateLocalStorage();
}

function updateLocalStorage() {
  localStorage.setItem("habits", JSON.stringify(habits));
}

// Show prompt
function showPrompt() {
  prompt_container.style.visibility = "visible";
  prompt.style.visibility = "visible";
  title.style.filter = "blur(5px)";
  container.style.filter = "blur(5px)";
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
  addEditListeners();
}

function addEditListeners() {
  const editButtons = document.querySelectorAll(".habit-edit-button");
  editButtons.forEach((item) => {
    item.addEventListener("click", openEditHabit);
  });
}

function openEditHabit() {
  const editButtons = document.querySelectorAll(".habit-edit-button");
  editButtons.forEach((element) => {
    element.classList.remove("clicked");
  });
  addEditListeners();
  this.removeEventListener("click", openEditHabit);
  closeEditElements();
  this.classList.add("clicked");
  const thisElement = this.closest(".habit").dataset.hTitle;
  const editElement = document.createElement("div");
  editElement.id = "habit-edit";
  editElement.classList.add("habit-edit");
  colorElements = ``;
  colors.forEach((i) => {
    colorElements += `<div class="color-btn"><input type="radio" id="${i}" name="color-edit"><label for="${i}" class="color-btn ${i}"></label></div>`;
  });
  // console.log(colorElements);
  editElement.innerHTML = `
      <h5>Edit habit</h5>
      <form id="habit-edit-form">
        <div class="form-control">
          <label for="habit-edit-name"><input
            type="text"
            name="habit-edit-name"
            id="habit-edit-name"
            placeholder="Habit name"
            value="${thisElement}"
          /></label>
          
        </div>
        <div class="clrs form-control">
          ${colorElements}
        </div>
        <div class="btns form-control">
          <button id="close-btn" class="close-btn btn">Close</button>
          <button id="save-btn" class="save-btn btn">Save</button>
        </div>
      </form>`;
  this.appendChild(editElement);

  /* TODO: set selected color */
  const returnCurrentColor = colors
    .filter((i) => {
      return this.closest(".habit").classList.contains(i);
    })
    .toString();
  const colorInput = document.querySelector(
    `[name="color-edit"]#${returnCurrentColor}`
  );
  colorInput.checked = true;

  // console.log(returnCurrentColor, colorInput, colorInput.checked);

  const habiteditclose = document.getElementById("close-btn");
  const habiteditsave = document.getElementById("save-btn");
  habiteditclose.addEventListener("click", closeEditHabit);
  habiteditsave.addEventListener("click", saveEditHabit);
}

function saveEditHabit(e) {  // Add 'e' parameter here
  e.preventDefault();
  const newName = document.getElementById("habit-edit-name").value;
  const thisElement = this.closest(".habit");
  const oldHabit = habits.find((i) => i.name == thisElement.dataset.hTitle);

  const DOMHabitIndex = [...thisElement.parentElement.children].findIndex(
    (i) => i == thisElement
  );
  const checkIfExists = habits.some((i) => i.name == newName);
  const existingIndex = habits.findIndex((i) => i.name == newName);

  /* update habit name */
  if (checkIfExists == true && DOMHabitIndex !== existingIndex) {
    alert("Name already exists!");
  } else {
    /* Update habit list*/
    oldHabit.name = newName;

    /* DOM Updates */
    const elementName = thisElement.getElementsByClassName("habit-name");
    [...elementName].forEach((i) => {
      i.innerHTML = `<h3>${newName}</h3>`;
    });
    thisElement.dataset.hTitle = `${newName}`;
  }

  /* update color */
  const selectedClr = document.querySelector('input[name="color-edit"]:checked')
    .id;
  console.log(selectedClr);
  colors.forEach((element) => {
    if (thisElement.classList.contains(element)) {
      thisElement.classList.remove(element);
    }
  });
  oldHabit.color = selectedClr;
  thisElement.classList.add(selectedClr);

  /* DOM Removals */
  this.closest(".habit-edit-button").classList.remove("clicked");
  this.closest(".habit-edit").remove();

  setTimeout(addEditListeners, 100);
  updateLocalStorage();
}

function closeEditElements() {
  const editElements = document.querySelectorAll(".habit-edit");
  editElements.forEach((i) => {
    i.parentNode.removeChild(i);
    console.log(i);
  });
}

/* From https://www.blustemy.io/detecting-a-click-outside-an-element-in-javascript/ */

/* Fires when clicked outside of box or with close button */
function closeEditHabit(e) {  // Already has 'e' parameter, no change needed
  e.preventDefault();
  const closestEditButton = this.closest(".habit-edit-button");
  closestEditButton.classList.remove("clicked");

  closeEditElements();
  setTimeout(addEditListeners, 100);
  // editElementButton.parentNode.removeChild(editElementChild);
  /* Option 1a: Clicked close */

  /* Option 1: Clicked outside of box */

  /* Option 2: CLicked different */
  // addEditListeners();
}

function deleteHabit() {
  const nameHabit = this.parentNode.dataset.hTitle;
  const filteredHabits = habits.filter((item) => item.name !== nameHabit);
  habits = filteredHabits;
  // console.log(habits);
  this.parentNode.remove();
  updateLocalStorage();
}

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

function addHabit(e) {
  e.preventDefault();

  // Boolean function for namecheck
  const names = habits.map((item) => {
    return item.name;
  });

  const doubleCheck = (item) => item === habit_name.value;

  if (names.some(doubleCheck) === false) {
    const days = [];

    habit_days.forEach((item) => {
      if (item.checked == false) {
        days.push(0);
      } else {
        days.push(1);
      }
    });

    // let color = "red";

    [...habit_colors].forEach((i) => {
      if (i.checked == true) {
        color = i.value;
      }
    });

    console.log(color);

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
  } else {
    alert("Did you already add a habit with this name?");
  }
}

function closePrompt(e) {
  e.preventDefault();

  prompt_container.style.visibility = "hidden";
  prompt.style.visibility = "hidden";
  title.style.filter = "blur(0px)";
  container.style.filter = "blur(0px)";
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

// Check for saved theme preference or use system preference
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
const currentTheme = localStorage.getItem("theme");

if (currentTheme === "dark" || (!currentTheme && prefersDarkScheme.matches)) {
  document.body.setAttribute("data-theme", "dark");
  moonIcon.classList.remove("fa-moon");
  moonIcon.classList.add("fa-sun");
}

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

const currentDayIndex = new Date().getDay();
const calDays = document.querySelectorAll('.cal-day');
calDays[currentDayIndex === 0 ? 6 : currentDayIndex - 1].classList.add('current-day');
