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
let todos=[]; // 用來存放待辦事項的陣列
/*
function addTodo(text) {
  console.log("addTodo 被呼叫了，收到的文字是：", text);
 todos.push({ text: text, done: false }); // 新增時預設 done 是 false（未完成） // 將新待辦事項加入陣列 
  saveTodos();  // 存進 localStorage
  renderTodos();        // 根據 todos 陣列，重新畫出整個清單
  
}
  */
 function addTodo(text) {
  const newTodo = { text: text, done: false }; // 準備要新增的資料

  fetch("http://localhost:3000/todos", {
    method: "POST",                          // 告訴伺服器：這次是「新增」
    headers: {
      "Content-Type": "application/json"      // 告訴伺服器：我送的資料是 JSON 格式
    },
    body: JSON.stringify(newTodo)              // 真正要送的資料，要先轉成字串
  })
    .then(function (response) {
      return response.json(); // 伺服器新增成功後，通常會回傳「這筆資料完整的樣子」（包含自動產生的 id）
    })
    .then(function (createdTodo) {
      todos.push(createdTodo); // 把伺服器回傳的完整資料（含 id）加進本地陣列
      console.log("伺服器回傳的資料：", createdTodo); // 先加這行看看
      renderTodos();            // 重新畫面
    });
}
// 根據 todos 陣列，重新畫出整個清單畫面
function  renderTodos() {
  list.innerHTML = "";

  todos.forEach(function (todo, index) {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = todo.text; // 從物件取出文字

    if (todo.done) {
      span.classList.add("done"); // 如果本來就是完成狀態，畫面上要一開始就顯示刪除線
    }

    const doneBtn = document.createElement("button");
    doneBtn.textContent = "完成";
    /*
    doneBtn.addEventListener("click", function () {
      todo.done = !todo.done; // 切換 done 的值（true 變 false，false 變 true）
      span.classList.toggle("done");
      saveTodos(); // 狀態改變了，要重新存進 localStorage
    });
    */
   doneBtn.addEventListener("click", function () {
  const newDoneValue = !todo.done; // 先算出切換後應該要變成什麼值

  fetch("http://localhost:3000/todos/" + todo.id, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ done: newDoneValue }) // 只送出要修改的欄位
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (updatedTodo) {
      todo.done = updatedTodo.done; // 用伺服器回傳的結果更新本地資料
      span.classList.toggle("done");
    });
});
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "刪除";
/*
    deleteBtn.addEventListener("click", function () {
      todos.splice(index, 1);
      saveTodos();
      renderTodos();
    });
*/
deleteBtn.addEventListener("click", function () {
  fetch("http://localhost:3000/todos/" + todo.id, {
    method: "DELETE"
  })
    .then(function () {
      todos.splice(index, 1); // 從本地陣列也移除這一筆
      renderTodos();           // 重新畫面
    });
});

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
/*
function loadTodos() {
  const saved = localStorage.getItem("todos");
  if (saved) {
    todos = JSON.parse(saved);
  }
}
  */
 function loadTodos() {
  fetch("http://localhost:3000/todos")
    .then(function (response) {
      return response.json(); // 把伺服器回應的內容轉成 JS 看得懂的物件/陣列
    })
    .then(function (data) {
      todos = data;       // 把抓到的資料存進 todos
      renderTodos();       // 資料到手後，才畫出畫面
    });
}
// 頁面一開始載入時，先讀取之前存的資料並畫出來
loadTodos();
//renderTodos();