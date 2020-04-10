/* Default screen */
const container = document.getElementById("container");
const title = document.getElementsByTagName("H1")[0];
const habitlist = document.getElementById("habit-list");
const caldays = document.getElementById("cal-days");
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
  // },
  // {
  //   name: "Roken",
  //   color: "blue",
  //   days: [0, 0, 0, 0, 0, 0, 0],
  //   finished: false,
  // },
  // {
  //   name: "Vroeg opstaan",
  //   color: "green",
  //   days: [0, 0, 0, 0, 0, 0, 0],
  //   finished: false,
  // },
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
// Style calendar days
function styleCalendar() {
  const days = [...caldays.children].slice(0, current_day);
  // console.log(days);
  days.forEach((item) => {
    item.firstChild.classList.add("past");
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
  const habitItem = document.createElement("div");
  // console.log(habit.color);

  habitItem.classList.add("habit");
  habitItem.classList.add(habit.color);
  if (habit.finished == true) {
    habitItem.classList.add("finished");
  }

  habitItem.setAttribute("data-h-title", habit.name);
  habitItem.setAttribute("draggable", "true");

  habitItem.innerHTML = `
    <div class="habit-grip"><i class="fas fa-grip-lines"></i></div>
    <div class="habit-name"><h3>${habit.name} <i class="fad fa-paint-brush color-edit"></i></div>
    <div class="habit-days">
      <div class="habit-day" data-h-day="${habit.days[0]}">✓</div>
      <div class="habit-day" data-h-day="${habit.days[1]}"></div>
      <div class="habit-day" data-h-day="${habit.days[2]}">✓</div>
      <div class="habit-day" data-h-day="${habit.days[3]}"></div>
      <div class="habit-day" data-h-day="${habit.days[4]}"></div>
      <div class="habit-day" data-h-day="${habit.days[5]}"></div>
      <div class="habit-day" data-h-day="${habit.days[6]}"></div>
    </div>
    <div class="habit-delete"><i class="fad fa-trash"></i></div>`;

  habitlist.appendChild(habitItem);

  addHabitDaysDOM();
}

// Inserts habit states into DOM
function addHabitDaysDOM() {
  const habitDays = document.querySelectorAll(".habit-day");

  habitDays.forEach((item) => {
    if (item.dataset.hDay == 0) {
      item.innerHTML = `<span><i class="fas fa-check"></i></span>`;
    } else if (item.dataset.hDay == 1) {
      item.innerHTML = `<span class="planned"><i class="fas fa-check"></i>	
</span>`;
    } else {
      item.innerHTML = `<span class="executed"><i class="fas fa-check"></i></span>`;
    }

    item.addEventListener("click", updateHabits);
  });
}

// Updates habit day data attributes and styles after click
function updateHabits() {
  const spanElement = this.children[0];
  const habit_title = this.parentNode.parentNode.dataset.hTitle;
  const habit_container = this.parentNode.parentNode;
  const day_index = [...this.parentElement.children].indexOf(this);
  let habit_state = "";

  if (this.dataset.hDay == 0) {
    this.dataset.hDay = 1;
    spanElement.classList.add("planned");
  } else if (this.dataset.hDay == 1) {
    this.dataset.hDay = 2;
    spanElement.classList.remove("planned");
    spanElement.classList.add("executed");
  } else {
    this.dataset.hDay = 0;
    spanElement.classList.remove("executed");
  }

  /* Check if there are unfinished days and updates container element */
  function checkHDay(day) {
    return day == 1;
  }

  const day_children_some = [...this.parentElement.children]
    .map((x) => x.dataset.hDay)
    .some(checkHDay);

  // console.log(day_children_some);

  const day_children_none = [...this.parentElement.children]
    .map((x) => Math.floor(x.dataset.hDay))
    .reduce((x, y) => x + y);

  // console.log(day_children_none);

  if (day_children_some == false && day_children_none > 0) {
    habit_container.classList.add("finished");
    console.log("finished!");
    habit_state = true;
  } else {
    habit_container.classList.remove("finished");
    habit_state = false;
  }

  console.log(habit_state);

  const day_data = this.dataset.hDay;
  updateHabitsData(habit_title, day_index, day_data, habit_state);
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
}

function deleteHabit() {
  const nameHabit = this.parentNode.dataset.hTitle;
  const filteredHabits = habits.filter((item) => item.name !== nameHabit);
  habits = filteredHabits;
  // console.log(habits);
  this.parentNode.remove();
  updateLocalStorage();
}

function changeColor() {
  event.preventDefault();
  const currentName = this.parentNode.innerText.trim();
  let indexCurrentColor = colors.findIndex(
    (i) => i == habits.filter((item) => item.name == currentName)[0].color
  );
  const indexCurrentName = habits.findIndex((i) => i.name == currentName);
  const oldColor = habits[indexCurrentName].color;

  if (event.type === "click") {
    leftClick();
  } else if ("contextmenu") {
    rightClick();
  }

  function leftClick() {
    if (colors.length - 1 == indexCurrentColor) {
      habits[indexCurrentName].color = colors[0];
    } else {
      habits[indexCurrentName].color = colors[indexCurrentColor + 1];
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
