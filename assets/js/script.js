// Retrieves tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1; // Initialize nextId if null

// Generates a unique task id
function generateTaskId() {
  nextId++;
  localStorage.setItem("nextId", JSON.stringify(nextId));
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
  dateFormat: "yy-mm-dd",
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
    renderTaskList();
    localStorage.setItem("tasks", JSON.stringify(taskDueDate));
    renderTaskDueDate();
    localStorage.setItem("tasks", JSON.stringify(taskDescription));
    renderTaskDescription();
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
function renderTaskList(sortCriteria = null) {
  $("#to-do-cards").empty();

  let tasksToRender = taskList;
  if (sortCriteria) {
    tasksToRender = sortCards(taskList, sortCriteria);
  }

  //   tasksToRender.forEach((task) => {
  //     const taskElement = `<div class="task" data-task-id="${task.id}">${task.title}</div>`;
  //     $("#to-do-cards").append(taskElement);
  //   });
  // }

  // Function to sort cards based on the given criteria
  const sortCards = (cards, criteria) => {
    return cards.sort((a, b) => {
      if (a[criteria] < b[criteria]) return -1;
      if (a[criteria] > b[criteria]) return 1;
      return 0;
    });
  };

  // Example of how to trigger sorting based on user selection
  $("#sortOptions").on("change", function () {
    const selectedCriteria = $(this).val(); // Get the selected criteria
    renderTaskList(selectedCriteria); // Re-render the task list with sorting
  });

  const handleSortChange = (criteria) => {
    const sortedCards = sortCards([...cards], criteria);
    setCards(sortedCards);
  };

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

  function handleDrop(event, ui) {
    const droppedTaskId = ui.draggable[0].dataset.taskId; // Get the ID of the dragged task
    const newStatus = event.target.id; // Get the new status from the drop target

    let tasks = readTasksFromStorage();
    tasks = tasks.map((task) => {
      if (task.id === droppedTaskId) {
        return { ...task, status: newStatus }; // Update the status
      }
      return task;
    });

    // Save updated tasks and refresh the UI
    saveTasksToStorage(tasks);
    renderTaskList();
  }

  // Todo: when the page loads, render the task list, add event listeners,
  // make lanes droppable, and make the due date field a date picker
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
}
