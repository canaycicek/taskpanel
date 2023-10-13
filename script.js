let gorevListesi = [];

if(localStorage.getItem("gorevListesi") !== null){
  gorevListesi = JSON.parse(localStorage.getItem("gorevListesi"))
}

let editId;
let isEditTask = false;

const taskInput = document.getElementById("txtTaskName");
const btnClear = document.getElementById("btnClear");
const filters = document.querySelectorAll(".filters span");

displayTasks(document.querySelector("span.active").id);

function displayTasks(filter) {
  let ul = document.getElementById("task-list");
  ul.innerHTML = "";
  if (gorevListesi.length == 0) {
    ul.innerHTML = "<p class='p-3 m-0'>Görev listeniz boş.</p>";
  } else {
    for (let gorev of gorevListesi) {
      let completed = gorev.durum == "completed" ? "checked" : "";

      if (filter == gorev.durum || filter == "all") {
        let li = `
      <li class="task list-group-item">
          <div class="form-check">
              <input type="checkbox" onclick="updateStatus(this)" id="${gorev.id}" class="form-check-input" ${completed}/>
              <label class="p-2 form-check-label ${completed}" for="${gorev.id}">${gorev.gorevAdi}</label>
          </div>
          <div class="dropdown">
          <button class="btn btn-link dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i class="fa-solid fa-ellipsis-vertical"></i>
          </button>
          <ul class="dropdown-menu">
              <li><a onclick="deleteTask(${gorev.id})" class="dropdown-item" href="#"><i class="fa-solid fa-trash"></i> Sil</a></li>
              <li><a onclick='editTask(${gorev.id}, "${gorev.gorevAdi}")' class="dropdown-item" href="#"><i class="fa-solid fa-pen"></i> Düzenle</a></li>
          </ul>
      </div>
      </li>
      `;
        ul.insertAdjacentHTML("beforeend", li); //ul'nin içinde en sona li yazdırır
      }
    }
  }
}

document.getElementById("btnAddNewTask").addEventListener("click", newTask);

document
  .getElementById("btnAddNewTask")
  .addEventListener("keypress", function () {
    if (event.key == "Enter") {
      document.getElementById("btnAddNewTask").click();
    }
  });

for (let span of filters) {
  span.addEventListener("click", function () {
    document.querySelector("span.active").classList.remove("active");
    span.classList.add("active");
    displayTasks(span.id);
  });
}

function newTask(event) {
  if (taskInput.value == "") {
    alert("Görev girmelisiniz");
  } else {
    if (!isEditTask) {
      //ekleme
      gorevListesi.push({
        "id": gorevListesi.length + 1,
        "gorevAdi": taskInput.value, "durum": "pending"
      });
    } else {
      //güncelleme
      for (let gorev of gorevListesi) {
        if (gorev.id == editId) {
          gorev.gorevAdi = taskInput.value;
        }
      }
      isEditTask = false;
    }
    taskInput.value = "";
    displayTasks(document.querySelector("span.active").id);
    localStorage.setItem("gorevListesi", JSON.stringify(gorevListesi))
  }

  event.preventDefault();
}

function deleteTask(id) {
  let deleteId;
  for (let index in gorevListesi) {
    if (gorevListesi[index].id == id) {
      deleteId = index;
    }
  }
  gorevListesi.splice(deleteId, 1);
  displayTasks(document.querySelector("span.active").id);
  localStorage.setItem("gorevListesi", JSON.stringify(gorevListesi))
}

function editTask(taskId, taskName) {
  editId = taskId;
  isEditTask = true;
  taskInput.value = taskName;
  taskInput.focus();
  taskInput.classList.add("active");
}

let taskAll = document.getElementById("task-list").querySelectorAll(".task");

btnClear.addEventListener("click", function () {
  gorevListesi.splice(0, gorevListesi.length);
  localStorage.setItem("gorevListesi", JSON.stringify(gorevListesi))
  displayTasks("");
});

function updateStatus(selectedTask) {
  let label = selectedTask.nextElementSibling;
  let durum;

  if (selectedTask.checked) {
    label.classList.add("checked");
    durum = "completed";
  } else {
    label.classList.remove("checked");
    durum = "pending";
  }

  for (const gorev of gorevListesi) {
    if (gorev.id == selectedTask.id) {
      gorev.durum = durum;
    }
  }
  localStorage.setItem("gorevListesi", JSON.stringify(gorevListesi))
  displayTasks(document.querySelector("span.active").id);
}

for (let task of taskAll) {
  let boxInput = task.querySelector(".form-check-input");
  let selectAll = document.getElementById("selectAll");
  boxInput.checked = false;
  selectAll.addEventListener("click", function () {
    if (boxInput.checked == false) {
      boxInput.checked = true;
      selectAll.innerText = "Seçilenleri Kaldır";
    } else {
      selectAll.innerText = "Hepsini Seç";
      boxInput.checked = false;
    }
  });
}
