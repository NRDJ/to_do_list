$(window).on("load", function () {

  var addTaskToDom = function (task) {
      var newCol = $(`
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
        <button type="button" class="btn btn-danger btn-sm">X</button>
      </div>`);
      
      $(newCol).appendTo(`.row`);
  }

  // var addTasksToDom = function (allTasksArr) {
  //     allTasksArr.forEach((element, i) => {
  //       var newCol = $(`
  //       <div class="col-1"></div>
  //       <div class="col-9">
  //         <div class="form-check d-inline-block">
  //           <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
  //           <label class="form-check-label" for="flexCheckDefault">
  //           </label>
  //         </div>
  //         <p class='d-inline-block'>${allTasksArr[i].content}</p>
  //       </div>
  //       <div class="col-2">
  //         <button type="button" class="btn btn-danger btn-sm">X</button>
  //       </div>`);
        
  //       $(newCol).appendTo(`.row`);
  //     });
  // }

  var importTasks = function () {
    $.ajax({
      type: "GET",

      url: "https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=1",

      dataType: "json",

      success: function (response, textStatus) {
        var allTasksArr = response.tasks;
        console.log(allTasksArr);

        allTasksArr.forEach((element, i) => {
          var task = allTasksArr[i].content
          addTaskToDom(task);
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
    var newTask = document.querySelector("input").value

    if (newTask) {
      console.log(newTask)
      sendTaskToApi(newTask);
      addTaskToDom(newTask);
    } else {
      console.log('empty')
    }

  };

  $(".btn-add").click(function () {
    console.log("btn clicked");
    addTask();
  });

  importTasks();
});
