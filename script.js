// Notes
// 1. whenever adding eventListener, add preventDefault() to prevent loading of page

// Approach
// 1. drag and drop functionality
// 2. Add count functionality to each column
// 3. Add Modal functionality to add new task
// 4. Local storage functionality to save tasks 

// Issues
// 1. After dropping task from column 1 to column 2, the tasksData doesnt show the updated data for column 1, it shows the data for column 2 instead. This is because we are updating the tasksData object with the new task data for the column after dropping the task, but we are not updating the tasksData object for the other columns. We need to update the tasksData object for all columns after dropping a task.


let tasksData = {};

const todo = document.getElementById("todo");
const progress = document.getElementById("progress");
const done = document.getElementById("done");
const tasks = document.querySelectorAll(".task");
const columns = [todo, progress, done];

const STORAGE_KEY = "kanbanTasks";

let dragElement = null;

function addTask(title, desc, column) {
  const div = document.createElement("div");
  div.classList.add("task");
  div.setAttribute("draggable", "true");
  div.innerHTML = `
        <h3>${title}</h3>
        <p>${desc}</p>
        <button>Delete</button>
    `;
  column.appendChild(div);
  div.addEventListener("dragstart", (event) => {
    dragElement = div;
  });

  const deleteButton = div.querySelector("button");
  deleteButton.addEventListener("click", (event) => {
    div.remove();
    updateTaskCount();
  });
  return div;
}

function updateTaskCount(){
  columns.forEach((col) => {
      const tasks = col.querySelectorAll(".task");
      const count = col.querySelector(".right");

      // Not understood
      // update the tasksData object with the new task data for the column
      tasksData[col.id] = Array.from(tasks).map((t) => {
        return {
          title: t.querySelector("h3").innerText,
          desc: t.querySelector("p").innerText,
        };
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasksData));
      count.innerText = tasks.length;
    });
}

if (localStorage.getItem(STORAGE_KEY)) {
  try {
    tasksData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; // if error will come, it will return empty object {}
  } catch (error) {
    tasksData = {};
  }

  for (const col in tasksData) {
    const column = document.getElementById(col);

    if (!column || !Array.isArray(tasksData[col])) continue;

    tasksData[col].forEach((task) => {
      addTask(task.title, task.desc, column);
    });
  }
  updateTaskCount();
}

tasks.forEach((task) => {
  task.addEventListener("dragstart", (event) => {
    // why prevent dafault was used here?
    dragElement = task;
  });
});

function addDragEventsOnColumn(column) {
  // column refers to - todo, progress, done

  column.addEventListener("dragenter", (event) => {
    event.preventDefault();
    column.classList.add("hover-over");
  });

  column.addEventListener("dragleave", (event) => {
    event.preventDefault();
    column.classList.remove("hover-over");
  });

  column.addEventListener("dragover", (event) => {
    event.preventDefault(); // enables dropping of element in column otherwise its not possible
  });

  column.addEventListener("drop", (event) => {
    event.preventDefault();

    column.appendChild(dragElement);
    column.classList.remove("hover-over");

    updateTaskCount();


    // columns.forEach((col) => {
    //   const tasks = col.querySelectorAll(".task");
    //   const count = col.querySelector(".right");
    //   count.innerText = tasks.length;
    // });
  });
}


addDragEventsOnColumn(todo);
addDragEventsOnColumn(progress);
addDragEventsOnColumn(done);

/* Modal Related Logic */
const toggleModalButton = document.getElementById("toggle-modal");
const modalBg = document.querySelector(".modal .bg");
const modal = document.querySelector(".modal");
const addNewButton = document.getElementById("add-new-task");

toggleModalButton.addEventListener("click", (event) => {
  modal.classList.toggle("active");
});

modalBg.addEventListener("click", (event) => {
  modal.classList.remove("active");
});

addNewButton.addEventListener("click", (event) => {
  const taskTitle = document.querySelector("#task-title-input").value;
  const taskDesc = document.querySelector("#task-desc-input").value;

  // creating new task using createElement
  addTask(taskTitle, taskDesc, todo);
  // creating new task using createElement
  updateTaskCount();

  modal.classList.remove("active");
  document.querySelector("#task-title-input").value = "";
  document.querySelector("#task-desc-input").value = "";
});

/* Modal Related Logic */
