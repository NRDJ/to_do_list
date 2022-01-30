$(window).on("load", function () {
  var deleteTask = false;

  var deleteTaskFromApi = function (contentVal, taskID, allTasksArr, i) {
    if (contentVal === allTasksArr[i].content) {
      taskID = allTasksArr[i].id;

      $.ajax({
        type: "DELETE",

        url: `https://altcademy-to-do-list-api.herokuapp.com/tasks/${taskID}?api_key=224`,

        success: function (response, textStatus) {
          console.log(response);
        },

        error: function (request, textStatus, errorMessage) {
          console.log(errorMessage);
        },
      });
    }
  }

  var addTaskContentToDom = function (taskContent) {
    var newCol = $(`
      <div class="row no-gutters">
        <div class="col-1"></div>
        <div class="col-9">
          <div class="d-inline-block">
            <input type="checkbox">
          </div>
          <p class='d-inline-block' id='task'>${taskContent}</p>
        </div>
        <div class="col-2">
          <button type="button" class="btn btn-danger btn-sm btn-remove">X</button>
        </div>
      </div>`);

    $(newCol).appendTo(`.container`);
  };

  var getAllTasksFromApi = function (contentVal) {
    var taskID;

    $.ajax({
      type: "GET",

      url: "https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=224",

      dataType: "json",

      success: function (response, textStatus) {
        console.log("success");

        var allTasksArr = response.tasks;

        allTasksArr.forEach((element, i) => {
          var taskContent = allTasksArr[i].content;
          if (!deleteTask) {
            addTaskContentToDom(taskContent);
          } else {
            deleteTaskFromApi(contentVal, taskID, allTasksArr, i)
          }
        });
      },

      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      },
    });
  };

  var postTaskToApi = function (newTask) {
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
    document.querySelector("input").value = '';

    if (newTask) {
      postTaskToApi(newTask);
      addTaskContentToDom(newTask);
    }
  };

  var removeTask = function (clickedBtn) {
    var removeFromApi = function (clickedBtn) {
      var contentVal = clickedBtn.parent().parent().find("p").text();

      deleteTask = true;
      getAllTasksFromApi(contentVal);
    };

    var removeFromDom = function (clickedBtn) {
      clickedBtn.parent().parent().remove();
    };

    removeFromApi(clickedBtn);
    removeFromDom(clickedBtn);
  };

  $(document).on("change", "input", function (event) {
    var paragraph = $(this).parent().parent().find('p')

    if (this.checked) {
      paragraph.css('text-decoration', 'line-through');
      paragraph.css('color', '#d9d9d9');
    } else {
      paragraph.css('text-decoration', 'none');
      paragraph.css('color', 'black');
    }

  });

  $(document).on("click", ".btn-remove", function (event) {
    removeTask($(this));
  });

  $(".btn-add").click(function () {
    addTask();
  });

  getAllTasksFromApi();
});
