// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
  if (nextId === null) {
    nextId = 1;
  } else {
    nextId++;
  }
  localStorage.setItem(JSON.stringify(nextId));
  return nextId;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    const card = $("<div></div>")
    .addClass("task-card" "ui-state-default")
    .data(
    .draggable({
        revert:
        start: function () {
            $(this).addClass("dragging");
        }
        stop: function() {
            $(this).removeClass("dragging");
        }
    })
    console.log(card)
    card.css("background-color", getTaskColor(task.taskDueDate))
    )
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    $("#to-do-cards").empty();
    taskList.forEach(task => {
        if (task.status === "todo-cards") {
            const taskCard = createTaskCard(task);
            $("#todo-cards").append(taskCard);
        }
        else if (task.status === "in-progress-cards") {
            const taskCard = createTaskCard(task);
            $("in-progress-cards").append(taskCard);
        }
        else if (task.status === "done-cards") {
            const taskCard = createTaskCard(task);
            $("done-cards").append(taskCard);
    })

    
    //   mHsp;
  // $(function() {
  //     $("#drag").drag();
  // )
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
  console.log(event);
  event.PreventDefault();
  const taskTitle = $("#taskTitle").val();
  const task = (
    title: taskTitle,
    date: taskDate,
    description: taskDescription,
  );
}
taskList.push(task);
localStorage.setItem("tasks", JSON.stringify(taskList));

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
    const taskId = taskList
    
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const droppedTaskId = ui.draggable.data("task-id");
    const newStatus = event.target.id;
console.log(newStatus)
console.log(droppedTaskId)
}
    const task = 

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();
    $("#submit").click(handleAddTask);
    $("$taskDueDate").datepicker({changeMonth: true, changeYear: true})

//     const taskButtonEl = document.getElementById("taskButton");
//   taskButtonEl.addEventListener("click", handleAddTask);
});
