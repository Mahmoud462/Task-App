"use strict";
const menu = document.querySelector("#menu");
const layer = document.querySelector("#layer");
const tasksContainer = document.querySelector("#tasks");
const progressBarElement = document.querySelector("#progress-bar");
const toggleMoodBtn = document.querySelector("#toggle-mood");
const newPageForm = document.querySelector("#new-page-menu");
class Task {
    constructor(title, boxesLength, completed = 0, id = randomId()) {
        this.title = title;
        this.boxesLength = boxesLength;
        this.completed = completed;
        this.id = id;
    }
    toLocalStorage() {
        const taskApp = JSON.parse(localStorage.taskApp);
        taskApp.tasks.push(this);
        localStorage.taskApp = JSON.stringify(taskApp);
    }
    toBody() {
        const taskElement = document.createElement("div");
        taskElement.classList.add("task");
        taskElement.id = this.id;
        taskElement.innerHTML = `
    <button class='copy-id' type='button'>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <path
        d="M502.6 70.63l-61.25-61.25C435.4 3.371 427.2 0 418.7 0H255.1c-35.35 0-64 28.66-64 64l.0195 256C192 355.4 220.7 384 256 384h192c35.2 0 64-28.8 64-64V93.25C512 84.77 508.6 76.63 502.6 70.63zM464 320c0 8.836-7.164 16-16 16H255.1c-8.838 0-16-7.164-16-16L239.1 64.13c0-8.836 7.164-16 16-16h128L384 96c0 17.67 14.33 32 32 32h47.1V320zM272 448c0 8.836-7.164 16-16 16H63.1c-8.838 0-16-7.164-16-16L47.98 192.1c0-8.836 7.164-16 16-16H160V128H63.99c-35.35 0-64 28.65-64 64l.0098 256C.002 483.3 28.66 512 64 512h192c35.2 0 64-28.8 64-64v-32h-47.1L272 448z" />
    </svg>
    </button>
    <h3>${this.title}</h3>
    <div class="boxes">
    </div>`;
        // Copy ID
        const copyBtn = taskElement.querySelector(".copy-id");
        copyBtn.addEventListener("click", () => navigator.clipboard.writeText(this.id));
        let completed = this.completed + 0;
        for (let i = 0; i < this.boxesLength; i++) {
            const boxes = taskElement.querySelector(".boxes");
            const box = document.createElement("div");
            box.classList.add("box");
            if (completed) {
                box.classList.add("checked");
                completed--;
            }
            box.addEventListener("click", boxClicked);
            boxes === null || boxes === void 0 ? void 0 : boxes.appendChild(box);
        }
        tasksContainer.appendChild(taskElement);
    }
}
window.onload = function () {
    const tasks = JSON.parse(localStorage.taskApp).tasks;
    tasks.forEach(({ title, id, completed, boxesLength }) => {
        const task = new Task(title, boxesLength, completed, id);
        task.toBody();
    });
    fillPrizeData();
};
function openMenu() {
    if (!menu)
        return;
    menu.classList.toggle("active");
}
newPageForm.addEventListener("submit", newPage);
function newPage(e) {
    e.preventDefault();
    const select = (query) => document.querySelector(`#new-page-menu [name='${query}']`);
    const daysCount = select("days-count").value;
    const prizeTitle = select("prize-title").value;
    const prizeDesc = select("prize-description").value;
    const prizeImage = select("prize-image").files;
    const theme = select("theme").value;
    localStorage.setItem("taskApp", JSON.stringify({
        beginDate: new Date(),
        daysCount,
        theme,
        prizeTitle,
        prizeDesc,
        prizeImage: `imgs/${prizeImage[0].name}`,
        tasks: [],
    }));
    document.location.reload();
}
function randomId() {
    return "abcdefghijklonopqrsxyz123456789*-/+"
        .split("")
        .sort(() => Math.random() - 0.5)
        .join("")
        .slice(0, 10);
}
function openCustomMenu(menuQuery) {
    var _a;
    if (!layer)
        return;
    closeMainMenu();
    (_a = document.querySelector(menuQuery)) === null || _a === void 0 ? void 0 : _a.classList.add("active");
    layer.classList.add("active");
    layer.onclick = function () {
        const openedMenu = document.querySelector(".custom-menu.active");
        openedMenu === null || openedMenu === void 0 ? void 0 : openedMenu.classList.remove("active");
        layer.classList.remove("active");
    };
}
function closeMainMenu() {
    menu === null || menu === void 0 ? void 0 : menu.classList.remove("active");
}
const newTaskForm = document.querySelector("#new-task-menu");
// Create New Task
newTaskForm === null || newTaskForm === void 0 ? void 0 : newTaskForm.addEventListener("submit", function (e) {
    var _a, _b;
    e.preventDefault();
    const title = (_a = newTaskForm.querySelector('[name="title"]')) === null || _a === void 0 ? void 0 : _a.value;
    const boxesLength = (_b = newTaskForm.querySelector('[name="boxes-length"]')) === null || _b === void 0 ? void 0 : _b.value;
    if (!title || !boxesLength)
        return;
    const task = new Task(title, +boxesLength);
    task.toLocalStorage();
    task.toBody();
    emptyInputs();
    closeMenus();
    progressBar();
});
function emptyInputs() {
    const inputs = document.querySelectorAll(".custom-menu input");
    inputs.forEach((input) => {
        input.value = "";
    });
}
function closeMenus() {
    const menus = document.querySelectorAll(".custom-menu");
    menus.forEach((menu) => menu.classList.remove("active"));
    layer === null || layer === void 0 ? void 0 : layer.classList.remove("active");
}
function boxClicked() {
    this.classList.toggle("checked");
    const task = this.closest(".task");
    const id = task.id;
    const taskApp = JSON.parse(localStorage.taskApp);
    const tasks = taskApp.tasks;
    const taskObj = tasks.find((e) => e.id === id);
    taskObj.completed = task.querySelectorAll(".checked").length;
    localStorage.taskApp = JSON.stringify(taskApp);
    progressBar();
}
function editTask() { }
const editTaskMenu = document.querySelector("#edit-task-menu");
editTaskMenu.addEventListener("submit", function (e) {
    e.preventDefault();
    const id = editTaskMenu.querySelector('[name="id"]')
        .value;
    const newTitle = editTaskMenu.querySelector('[name="title"]').value;
    const newBoxesLength = editTaskMenu.querySelector('[name="boxes-length"]').value;
    const taskApp = JSON.parse(localStorage.taskApp);
    const taskObj = taskApp.tasks.find((e) => e.id === id);
    if (!taskObj)
        return;
    if (newTitle.trim()) {
        taskObj.title = newTitle;
        taskObj.completed = 0;
    }
    if (newBoxesLength.trim()) {
        taskObj.boxesLength = +newBoxesLength;
        taskObj.completed = 0;
    }
    localStorage.taskApp = JSON.stringify(taskApp);
    document.location.reload();
});
const deleteTaskForm = document.querySelector("#delete-task-menu");
deleteTaskForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const id = deleteTaskForm.querySelector('[name="id"]')
        .value;
    const taskApp = JSON.parse(localStorage.taskApp);
    taskApp.tasks = taskApp.tasks.filter((e) => e.id !== id);
    localStorage.taskApp = JSON.stringify(taskApp);
    document.location.reload();
});
// Edit Json
function editJson() {
    openCustomMenu("#edit-json-menu");
    const jsonTextarea = document.querySelector("#json-text");
    jsonTextarea.value = JSON.stringify(JSON.parse(localStorage.taskApp), null, "\t");
    const editJsonForm = document.querySelector("#edit-json-menu");
    editJsonForm.addEventListener("submit", (e) => {
        e.preventDefault();
        localStorage.taskApp = jsonTextarea.value;
        document.location.reload();
    });
}
function progressBar() {
    const taskApp = JSON.parse(localStorage.taskApp);
    let allBoxes = 0;
    let completedBoxes = 0;
    taskApp.tasks.forEach((task) => {
        allBoxes += task.boxesLength;
        completedBoxes += task.completed;
    });
    const percentage = (completedBoxes / allBoxes) * 100;
    progressBarElement.style.width = percentage + "%";
}
progressBar();
// Toggle Mood
toggleMoodBtn.addEventListener("click", function (e) {
    if (this.classList.contains("dark")) {
        document.body.classList.add("dark");
        this.classList.remove("dark");
        this.classList.add("light");
    }
    else {
        document.body.classList.remove("dark");
        this.classList.add("dark");
        this.classList.remove("light");
    }
});
// Apply Theme
const theme = JSON.parse(localStorage.taskApp).theme || "dark";
if (theme === "dark")
    document.body.classList.add(theme);
// Shortcuts
window.addEventListener("keydown", (event) => {
    var _a;
    const { key, ctrlKey, shiftKey, altKey } = event;
    if (key === "Enter") {
        const activeForm = document.querySelector(".custom-menu.active");
        if (activeForm) {
            (_a = activeForm.querySelector("button")) === null || _a === void 0 ? void 0 : _a.click();
        }
    }
    if (!shiftKey)
        return;
    if (key.toLowerCase() === "n") {
        openCustomMenu("#new-task-menu");
        document.querySelector("#new-task-menu input").focus();
    }
    else if (key.toLowerCase() === "e") {
        openCustomMenu("#edit-task-menu");
        document.querySelector("#edit-task-menu input").focus();
    }
    else if (key.toLowerCase() === "d") {
        openCustomMenu("#delete-task-menu");
        document.querySelector("#delete-task-menu input").focus();
    }
});
function fillPrizeData() {
    const taskApp = JSON.parse(localStorage.taskApp || "");
    if (!taskApp)
        return;
    const prizeTitle = document.querySelector("#prize-menu h2");
    const prizeImage = document.querySelector("#prize-menu img");
    const prizeDesc = document.querySelector("#prize-menu p");
    prizeTitle.innerHTML = taskApp.prizeTitle;
    prizeImage.src = taskApp.prizeImage;
    prizeDesc.innerHTML = taskApp.prizeDesc;
}
