$(window).on("load", function () {
  var allTasks = {};

  var getTaskId = function (element, paragraphText) {
    if (paragraphText === element.content) {
      var taskID = element.id;
      return taskID;
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

  var setTaskCompleted = function(taskID) {

    $.ajax({
      type: 'PUT',
      url: `https://altcademy-to-do-list-api.herokuapp.com//tasks/${taskID}/mark_complete?api_key=224`,
      
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({
        task: {
          completed: true
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

  var getAllTasksFromApi = function (action, paragraphText) {
    $.ajax({
      type: "GET",

      url: "https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=224",

      dataType: "json",

      success: function (response, textStatus) {
        console.log("success");
        console.log(response);

        var allTasksArr = response.tasks;

        allTasksArr.forEach((element, i) => {
          var taskID = getTaskId(element, paragraphText);
          switch (action) {
            case 'add':
              var taskContent = allTasksArr[i].content;
              addTaskContentToDom(taskContent);
              break;
            case 'delete':
              if (taskID) {
                deleteTaskFromApi(taskID)
              }
              break;
            case 'edit':
              if (taskID) {
                setTaskCompleted(taskID);
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
    var paragraph = $(this).parent().parent().find('p')
    var paragraphText = $(this).parent().parent().find('p').text();

    if (this.checked) {
      editParagraph(paragraph, 'line-through', '#d9d9d9')   
      getAllTasksFromApi('edit', paragraphText);
    } else {
      editParagraph(paragraph, 'none', 'black')
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
