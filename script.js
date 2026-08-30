// 抓取需要操作的 HTML 元素
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const errorMessage = document.getElementById("error-message");

// 監聽表單送出事件
form.addEventListener("submit", function (event) {
  event.preventDefault(); // 阻止表單預設送出行為（避免整頁重新整理）

  const value = input.value.trim(); // 取得輸入框文字，並去除頭尾空白

  if (value === "") {
    // 輸入是空的，顯示錯誤訊息
    errorMessage.classList.remove("hidden");
    return; // 中斷，不繼續往下執行
  }

  // 輸入有效，先把錯誤訊息藏起來
  errorMessage.classList.add("hidden");

  addTodo(value);   // 呼叫新增待辦事項的函式
  input.value = "";  // 清空輸入框，方便繼續打下一筆
});

// 新增一筆待辦事項到畫面上
let todos = []; // 用來存放待辦事項的陣列

function addTodo(text) {
  todos.push({ text: text, done: false }); // 新增時預設 done 是 false（未完成）
  saveTodos();      // 存進 localStorage
  renderTodos();     // 根據 todos 陣列，重新畫出整個清單
}

/* fetch 版本（第三階段 Step A 學真後端時會用回來）
 function addTodo(text) {
  const newTodo = { text: text, done: false };

  fetch("http://localhost:3000/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(newTodo)
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (createdTodo) {
      todos.push(createdTodo);
      renderTodos();
    });
}
*/

// 根據 todos 陣列，重新畫出整個清單畫面
function renderTodos() {
  list.innerHTML = "";

  todos.forEach(function (todo, index) {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = todo.text;

    if (todo.done) {
      span.classList.add("done");
    }

    const doneBtn = document.createElement("button");
    doneBtn.textContent = "完成";
    doneBtn.addEventListener("click", function () {
      todo.done = !todo.done; // 切換 done 的值
      span.classList.toggle("done");
      saveTodos(); // 狀態改變了，要重新存進 localStorage
    });

    /* PATCH 版本（第三階段 Step A 學真後端時會用回來）
    doneBtn.addEventListener("click", function () {
      const newDoneValue = !todo.done;
      fetch("http://localhost:3000/todos/" + todo.id, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ done: newDoneValue })
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (updatedTodo) {
          todo.done = updatedTodo.done;
          span.classList.toggle("done");
        });
    });
    */

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "刪除";
    deleteBtn.addEventListener("click", function () {
      todos.splice(index, 1);
      saveTodos();
      renderTodos();
    });

    /* fetch 版本（第三階段 Step A 學真後端時會用回來）
    deleteBtn.addEventListener("click", function () {
      fetch("http://localhost:3000/todos/" + todo.id, {
        method: "DELETE"
      })
        .then(function () {
          todos.splice(index, 1);
          renderTodos();
        });
    });
    */

    li.appendChild(span);
    li.appendChild(doneBtn);
    li.appendChild(deleteBtn);

    list.appendChild(li);
  });
}

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// 從 localStorage 讀出資料，還原成陣列
function loadTodos() {
  const saved = localStorage.getItem("todos");
  if (saved) {
    todos = JSON.parse(saved);
  }
}

/* fetch 版本（第三階段 Step A 學真後端時會用回來）
 function loadTodos() {
  fetch("http://localhost:3000/todos")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      todos = data;
      renderTodos();
    });
}
*/

// 頁面一開始載入時，先讀取之前存的資料並畫出來
loadTodos();
renderTodos();