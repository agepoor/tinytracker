const container = document.getElementById("container"),
  title = document.getElementsByTagName("H1")[0],
  habitlist = document.getElementById("habit-list"),
  caldays = document.getElementById("cal-days"),
  current_day = new Date().getDay(),
  prompt_container = document.getElementById("habit-prompt-container"),
  prompt = document.getElementById("habit-prompt"),
  add_habit = document.getElementById("add-habit"),
  close_prompt = document.getElementById("close-prompt"),
  habit_name = document.getElementById("habit-name"),
  habit_days_container = document.getElementById("habit-days"),
  habit_days = [...habit_days_container.getElementsByTagName("input")],
  habit_color = document.getElementById("habit-color"),
  habit_colors = document
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
  ],
  habitsList = [];
const localStorageHabits = JSON.parse(localStorage.getItem("habits"));
let habits =
  null !== localStorage.getItem("habits") ? localStorageHabits : habitsList;
function addHabits() {
  habits.forEach((t) => {
    addHabitDOM(t);
  }),
    addEventListeners();
}
function styleCalendar() {
  [...caldays.children].slice(0, current_day).forEach((t) => {
    t.firstChild.classList.add("past");
  });
}
function addColors() {
  colors.forEach((t) => {
    addColorInput(t);
  }),
    (habit_color.children[0].children[0].checked = !0);
}
function addColorInput(t) {
  const a = `<label class="${t}">${t}<input type="radio" name="color" class="${t}" id="${t}" value="${t}"><span class="radio ${t}"></span></label>`;
  habit_color.innerHTML += a;
}
function addHabitDOM(t) {
  const a = document.createElement("div");
  a.classList.add("habit"),
    a.classList.add(t.color),
    1 == t.finished && a.classList.add("finished"),
    a.setAttribute("data-h-title", t.name),
    a.setAttribute("draggable", "true"),
    (a.innerHTML = `\n    <div class="habit-grip"><i class="fas fa-grip-lines"></i></div>\n    <div class="habit-name"><h3>${t.name} <i class="fad fa-paint-brush color-edit"></i></div>\n    <div class="habit-days">\n      <div class="habit-day" data-h-day="${t.days[0]}">✓</div>\n      <div class="habit-day" data-h-day="${t.days[1]}"></div>\n      <div class="habit-day" data-h-day="${t.days[2]}">✓</div>\n      <div class="habit-day" data-h-day="${t.days[3]}"></div>\n      <div class="habit-day" data-h-day="${t.days[4]}"></div>\n      <div class="habit-day" data-h-day="${t.days[5]}"></div>\n      <div class="habit-day" data-h-day="${t.days[6]}"></div>\n    </div>\n    <div class="habit-delete"><i class="fad fa-trash"></i></div>`),
    habitlist.appendChild(a),
    addHabitDaysDOM();
}
function addHabitDaysDOM() {
  document.querySelectorAll(".habit-day").forEach((t) => {
    0 == t.dataset.hDay
      ? (t.innerHTML = '<span><i class="fas fa-check"></i></span>')
      : 1 == t.dataset.hDay
      ? (t.innerHTML =
          '<span class="planned"><i class="fas fa-check"></i>\t\n</span>')
      : (t.innerHTML =
          '<span class="executed"><i class="fas fa-check"></i></span>'),
      t.addEventListener("click", updateHabits);
  });
}
function updateHabits() {
  const t = this.children[0],
    a = this.parentNode.parentNode.dataset.hTitle,
    e = this.parentNode.parentNode,
    i = [...this.parentElement.children].indexOf(this);
  let s = "";
  0 == this.dataset.hDay
    ? ((this.dataset.hDay = 1), t.classList.add("planned"))
    : 1 == this.dataset.hDay
    ? ((this.dataset.hDay = 2),
      t.classList.remove("planned"),
      t.classList.add("executed"))
    : ((this.dataset.hDay = 0), t.classList.remove("executed"));
  const d = [...this.parentElement.children]
      .map((t) => t.dataset.hDay)
      .some(function (t) {
        return 1 == t;
      }),
    n = [...this.parentElement.children]
      .map((t) => Math.floor(t.dataset.hDay))
      .reduce((t, a) => t + a);
  0 == d && n > 0
    ? (e.classList.add("finished"), console.log("finished!"), (s = !0))
    : (e.classList.remove("finished"), (s = !1)),
    console.log(s),
    updateHabitsData(a, i, this.dataset.hDay, s);
}
function updateHabitsData(t, a, e, i) {
  habits.forEach((s) => {
    s.name == t && ((s.days[a] = parseInt(e)), (s.finished = i));
  }),
    updateLocalStorage();
}
function updateLocalStorage() {
  localStorage.setItem("habits", JSON.stringify(habits));
}
function showPrompt() {
  (prompt_container.style.visibility = "visible"),
    (prompt.style.visibility = "visible"),
    (title.style.filter = "blur(5px)"),
    (container.style.filter = "blur(5px)");
}
function addEventListeners() {
  const t = document.querySelectorAll(".habit-delete"),
    a = document.querySelectorAll(".color-edit");
  t.forEach((t) => {
    t.addEventListener("click", deleteHabit);
  }),
    a.forEach((t) => {
      t.addEventListener("click", changeColor),
        t.addEventListener("contextmenu", changeColor);
    });
}
function deleteHabit() {
  const t = this.parentNode.dataset.hTitle,
    a = habits.filter((a) => a.name !== t);
  (habits = a), this.parentNode.remove(), updateLocalStorage();
}
function changeColor() {
  event.preventDefault();
  const t = this.parentNode.innerText.trim();
  let a = colors.findIndex(
    (a) => a == habits.filter((a) => a.name == t)[0].color
  );
  const e = habits.findIndex((a) => a.name == t),
    i = habits[e].color;
  "click" === event.type
    ? colors.length - 1 == a
      ? (habits[e].color = colors[0])
      : (habits[e].color = colors[a + 1])
    : (habits[e].color = 0 == a ? colors[colors.length - 1] : colors[a - 1]),
    this.parentNode.parentNode.parentNode.classList.remove(i),
    this.parentNode.parentNode.parentNode.classList.add(habits[e].color),
    updateLocalStorage();
}
function addHabit(t) {
  t.preventDefault();
  if (!1 === habits.map((t) => t.name).some((t) => t === habit_name.value)) {
    const t = [];
    habit_days.forEach((a) => {
      0 == a.checked ? t.push(0) : t.push(1);
    }),
      [...habit_colors].forEach((t) => {
        1 == t.checked && (color = t.value);
      }),
      console.log(color);
    const a = { name: habit_name.value, days: t, color: color };
    habits.push(a), addHabitDOM(a), addEventListeners(), updateLocalStorage();
  } else alert("Did you already add a habit with this name?");
}
function closePrompt(t) {
  t.preventDefault(),
    (prompt_container.style.visibility = "hidden"),
    (prompt.style.visibility = "hidden"),
    (title.style.filter = "blur(0px)"),
    (container.style.filter = "blur(0px)");
}
function swapElements(t, a, e) {
  (temp = t[a]), (t[a] = t[e]), (t[e] = temp), updateLocalStorage();
}
addHabits(),
  styleCalendar(),
  addColors(),
  add_habit.addEventListener("click", addHabit),
  close_prompt.addEventListener("click", closePrompt);
