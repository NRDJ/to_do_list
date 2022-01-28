$(window).on("load", function () {


  var importTasks = function () {
    $.ajax({
      type: "GET",

      url: "https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=1",

      dataType: "json",

      success: function (response, textStatus) {
        var allTasksArr = response.tasks;
        console.log(allTasksArr);
      },

      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      },
    });
  };

  var addTaskToList = function (newTask) {};

  var sendTaskToApi = function (newTask) {
    $.ajax({
      type: "POST",
      url: "https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=224",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify({
        task: {
          content: newTask,
        },
      }),
      success: function (response, textStatus) {
        console.log(response);
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      },
    });
  };

  var addTask = function () {
    var newTask = document.querySelector("input").value;
    sendTaskToApi(newTask);
    addTaskToList(newTask);
  };

  $(".btn-add").click(function () {
    console.log("Button Clicked");
    addTask();
  });

  importTasks();
});
