$(window).on("load", function () {

  var getTaskId = function (task, paragraphText) {
    if (paragraphText === task.content) {
      var taskID = task.id;
      return taskID;
    }
  }

  var addTaskContentToDom = function (taskContent, taskID, isCompleted) {
    var newCol = $(`
      <div class="row no-gutters">
        <div class="col-1"></div>
        <div class="col-9">
          <div class="d-inline-block">
            <label for="accept">
              <input type="checkbox" id="accept" name="accept" value="yes">
            </label>
          </div>
          <p class='d-inline-block' id='${taskID}'>${taskContent}</p>
        </div>
        <div class="col-2">
          <button type="button" class="btn btn-danger btn-sm btn-remove">X</button>
        </div>
      </div>`);

    $(newCol).appendTo(`.container`);
    if (isCompleted) {
      var checkBox = $(`#${taskID}`).prev().find('input');
      var paragraph = $(`#${taskID}`);
      editParagraph(paragraph, 'line-through', '#d9d9d9');
      $(checkBox).prop('checked', true);
    }
  };

  var deleteTaskFromApi = function (taskID) {
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

  var setTaskCompleted = function(taskID, isCompleted) {

    $.ajax({
      type: 'PUT',
      url: `https://altcademy-to-do-list-api.herokuapp.com//tasks/${taskID}/mark_complete?api_key=224`,
      
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({
        task: {
          completed: isCompleted
        }
      }),
      success: function (response, textStatus) {
        console.log(response);
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
  }

  var getAllTasksFromApi = function (action, paragraphText, isCompleted) {
    $.ajax({
      type: "GET",

      url: "https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=224",

      dataType: "json",

      success: function (response, textStatus) {
        console.log("success");
        console.log(response);

        var allTasksArr = response.tasks;

        allTasksArr.forEach((task, i) => {
          var taskID = getTaskId(task, paragraphText);
          switch (action) {
            case 'add':
              taskID = task.id;
              var taskContent = task.content;
              var isCompleted = task.completed;
              addTaskContentToDom(taskContent, taskID, isCompleted);
              break;
            case 'delete':
              if (taskID) {
                deleteTaskFromApi(taskID)
              }
              break;
            case 'edit':
              if (taskID) {
                setTaskCompleted(taskID, isCompleted);
              }
              break;
            default:
              console.log('error!');
              break;
          }
        });
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      },
    });
  };

  var addTask = function () {
    var newTask = document.querySelector("input").value;
    document.querySelector("input").value = '';

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

    if (newTask) {
      postTaskToApi(newTask);
      addTaskContentToDom(newTask);
    }
  };

  var removeTask = function (clickedBtn) {
    var removeFromApi = function (clickedBtn) {
      var paragraphText = clickedBtn.parent().parent().find("p").text();

      getAllTasksFromApi('delete', paragraphText);
    };

    var removeFromDom = function (clickedBtn) {
      clickedBtn.parent().parent().remove();
    };

    removeFromApi(clickedBtn);
    removeFromDom(clickedBtn);
  };

  var editParagraph = function (paragraph, textDecoration, color) {
    paragraph.css({'text-decoration': textDecoration, 'color': color});
  }

  $(document).on("change", "input", function (event) {
    var paragraph = $(this).parent().parent().next();
    var paragraphText = paragraph.text();

    if (this.checked) {
      editParagraph(paragraph, 'line-through', '#d9d9d9')   
      getAllTasksFromApi('edit', paragraphText, true);
    } else {
      editParagraph(paragraph, 'none', 'black');
      getAllTasksFromApi('edit', paragraphText, false);

    }
  });

  $(document).on("click", ".btn-remove", function (event) {
    removeTask($(this));
  });

  $(".btn-add").click(function () {
    addTask();
  });

  getAllTasksFromApi('add');
});
