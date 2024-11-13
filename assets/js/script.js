// Retrieves tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1; // Initialize nextId if null

// Generates a unique task id
function generateTaskId() {
  nextId++;
  localStorage.setItem("nextId", JSON.stringify(nextId));
  console.log(nextId);
  return nextId;
}

// Creates a task card and makes cards draggable
function createTaskCard(task) {
  const card = $("<div></div>")
    .attr("data-task-id", task.id)
    .addClass("task-card ui-state-default draggable")
    .draggable({
      start: function () {
        $(this).addClass("dragging");
      },
      stop: function () {
        $(this).removeClass("dragging");
      },
      snap: ".lane",
      snapMode: "inner",
    });

  const cardHeader = $("<div>").addClass("card-header h4").text(task.title);
  const cardBody = $("<div>").addClass("card-body");
  const cardDescription = $("<p>").addClass("card-text").text(task.description);
  const cardDueDate = $("<p>").addClass("card-date").text(task.date);
  const cardDeleteBtn = $("<button>")
    .addClass("btn btn-danger delete")
    .text("Delete")
    .attr("data-task-id", task.id)
    .on("click", handleDeleteTask);

  // Adds conditional styling based on due date
  if (task.date) {
    const now = dayjs(); // Gets the current date
    const taskDate = dayjs(task.date); // Parses task date

    if (now.isSame(taskDate, "day")) {
      card.addClass("bg-warning text-white"); // Today
    } else if (now.isAfter(taskDate)) {
      card.addClass("bg-danger text-white"); // Overdue
    }
  }

  // Appends elements to the card
  cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
  card.append(cardHeader, cardBody);

  return card; // Returns created card
}

// Initializes datepicker
$("#datepicker").datepicker({
  dateFormat: "mm/dd/yy",
  timeFormat: "hh:mm tt",
});

$(document).ready(function () {
  renderTaskList();
  $("#submit").click(handleAddTask);
  $("#taskDueDate").datepicker({ changeMonth: true, changeYear: true });
  $("#save-button").click(handleAddTask);

  const taskButtonEl = document.getElementById("taskButton");
  if (taskButtonEl) {
    taskButtonEl.addEventListener("click", handleAddTask);
    $(".lane").droppable({
      accept: ".draggable",
      drop: handleDrop,
    });
  }
});

// Adds a task to local storage and prints the project data
function handleAddTask(event) {
  event.preventDefault();

  const taskTitle = $("#taskTitle").val().trim();
  const taskDueDate = $("#taskDueDate").val().trim();
  const taskDescription = $("#taskDescription").val().trim();

  // Input validation
  if (!taskTitle || !taskDueDate || !taskDescription) {
    alert("Please fill in all fields.");
    return;
  }

  const task = {
    id: generateTaskId(),
    title: taskTitle,
    date: taskDueDate,
    description: taskDescription,
    status: "#todo-cards",
  };

  taskList.push(task);

  // Updates local storage
  try {
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList(); // Assuming this function updates the UI with the new task
  } catch (error) {
    console.error("Error saving to local storage:", error);
    alert("There was an error saving your task. Please try again.");
  }

  // Clears input fields
  $("#taskTitle").val("");
  $("#taskDueDate").val("");
  $("#taskDescription").val("");

  $("#modal").modal("hide"); // Hide the modal after adding the task
}

// Function to render the task list
function renderTaskList() {
  $("#to-do-cards").empty();

  let tasksToRender = taskList;
  tasksToRender.forEach((task) => {
    const taskElement = createTaskCard(task);
    console.log(taskElement);
    if (task.status === "#todo-cards") {
      $("#to-do-cards").append(taskElement);
    } else if (task.status === "in-progress-cards") {
      $("#in-progress-cards").append(taskElement);
    } else {
      $("done-cards").append(taskElement);
    }
  });
}

// Example of how to trigger sorting based on user selection
$("#sortOptions").on("change", function () {
  const selectedCriteria = $(this).val(); // Get the selected criteria
  renderTaskList(selectedCriteria); // Re-render the task list with sorting
});

// Function to read tasks from local storage
const readTasksFromStorage = () => {
  const tasks = localStorage.getItem("tasks");
  return tasks ? JSON.parse(tasks) : [];
};

// Function to save tasks to local storage
const saveTasksToStorage = (tasks) => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

// Removes a task from local storage and updates the UI
function handleDeleteTask() {
  const taskId = $(this).attr("data-task-id");
  let tasks = readTasksFromStorage();

  // Filter out the task with the given ID
  tasks = tasks.filter((task) => task.id !== taskId);

  saveTasksToStorage(tasks); // Save updated tasks
  renderTaskList(); // Refresh the task list in the UI
}

// Function to handle dropping a task into a new status lane
function handleDropTask(event, ui) {
  const droppedTaskId = ui.draggable[0].dataset.taskId;
  const newStatus = event.target.id;

  let tasks = readTasksFromStorage();
  tasks = tasks.map((task) => {
    if (task.id === droppedTaskId) {
      return { ...task, status: newStatus }; // Update status
    }
    return task;
  });

  saveTasksToStorage(tasks); // Save updated tasks
  renderTaskList(); // Refresh the task list in the UI
}

// Ensure you are binding the delete handler to the delete button
$(document).on("click", ".delete", handleDeleteTask);

function handleDropTask(event, ui) {
  const droppedTaskId = ui.draggable[0].dataset.taskId;
  const newStatus = event.target.id;

  let tasks = readTasksFromStorage();
  console.log(droppedTaskId);
  console.log(newStatus);
  // Check if tasks are retrieved successfully
  if (!tasks) {
    console.error("No tasks found in storage.");
    return;
  }

  // Update the task status
  tasks = tasks.map((task) => {
    if (task.id === droppedTaskId) {
      return { ...task, status: newStatus }; // Update status
    }
    return task;
  });

  // Save updated tasks
  try {
    saveTasksToStorage(tasks);
    renderTaskList(); // Refresh the task list in the UI
  } catch (error) {
    console.error("Error saving tasks to storage:", error);
  }
}

// Todo: when the page loads, render the task list, add event listeners,
// make lanes droppable, and make the due date field a date picker
