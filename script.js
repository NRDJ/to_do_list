$(window).on("load", function () {
  var deleteTask = false;

  var addTaskToDom = function (task) {
    var newCol = $(`
      <div class="row no-gutters">
        <div class="col-1"></div>
        <div class="col-9">
          <div class="form-check d-inline-block">
            <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
            <label class="form-check-label" for="flexCheckDefault">
            </label>
          </div>
          <p class='d-inline-block'>${task}</p>
        </div>
        <div class="col-2">
          <button type="button" class="btn btn-danger btn-sm btn-remove">X</button>
        </div>
      </div>`);

    $(newCol).appendTo(`.container`);
  };

  var importTasks = function (contentVal) {
    var taskID;

    $.ajax({
      type: "GET",

      url: "https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=1",

      dataType: "json",

      success: function (response, textStatus) {
        console.log("success");
        var allTasksArr = response.tasks;

        allTasksArr.forEach((element, i) => {
          var task = allTasksArr[i].content;
          if (!deleteTask) {
            addTaskToDom(task);
          } else {
            if (contentVal === allTasksArr[i].content) {
              taskID = allTasksArr[i].id;

              $.ajax({
                type: "DELETE",

                url: `https://altcademy-to-do-list-api.herokuapp.com/tasks/${taskID}?api_key=1`,

                success: function (response, textStatus) {
                  console.log(response);
                },

                error: function (request, textStatus, errorMessage) {
                  console.log(errorMessage);
                },
              });
            }
          }
        });
      },

      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      },
    });
  };

  //api key 224//

  var sendTaskToApi = function (newTask) {
    $.ajax({
      type: "POST",
      url: "https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=1",
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

    if (newTask) {
      sendTaskToApi(newTask);
      addTaskToDom(newTask);
    }
  };

  var removeTask = function (clickedBtn) {
    var removeFromApi = function (clickedBtn) {
      var contentVal = clickedBtn.parent().parent().find("p").text();

      deleteTask = true;
      importTasks(contentVal);
    };

    var removeFromDom = function (clickedBtn) {
      clickedBtn.parent().parent().remove();
    };

    removeFromApi(clickedBtn);
    removeFromDom(clickedBtn);
  };

  $(".btn-add").click(function () {
    addTask();
  });

  $(document).on("click", ".btn-remove", function (event) {
    removeTask($(this));
  });

  importTasks();
});
