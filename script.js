// 抓取需要操作的 HTML 元素
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const errorMessage = document.getElementById("error-message");
const dueDateInput = document.getElementById("todo-due-date");
const categoryInput = document.getElementById("todo-category");
let touchDraggedIndex = null;
let touchTargetIndex = null;
// 監聽表單送出事件
form.addEventListener("submit", function (event) {
  event.preventDefault(); // 阻止表單預設送出行為（避免整頁重新整理）

  const value = input.value.trim(); // 取得輸入框文字，並去除頭尾空白
 const dueDate = dueDateInput.value; // 讀取使用者選的日期（字串格式，例如 "2026-09-30"）
 const category = categoryInput.value; // 讀取使用者選的分類

  if (value === "") {
    // 輸入是空的，顯示錯誤訊息
    errorMessage.classList.remove("hidden");
    return; // 中斷，不繼續往下執行
  }

  // 輸入有效，先把錯誤訊息藏起來
  errorMessage.classList.add("hidden");

  addTodo(value, dueDate, category); // 把分類也一起傳進去
  dueDateInput.value = ""; // 清空日期輸入框
  input.value = "";  // 清空輸入框，方便繼續打下一筆
  categoryInput.value = ""; // 重設回「無分類」
});

// 新增一筆待辦事項到畫面上
let todos = []; // 用來存放待辦事項的陣列
let currentFilter = "all"; // 記住目前選中的篩選條件，預設是「全部」
let draggedIndex = null; // 記住目前正在被拖動的項目，是陣列裡的第幾個
const filterButtons = document.querySelectorAll(".filter-btn");
// 幫每個篩選按鈕加上點擊事件
filterButtons.forEach(function (btn) {
  btn.addEventListener("click", function () {
    // 先把「所有」按鈕的 active 拿掉
    filterButtons.forEach(function (b) {
      b.classList.remove("active");
    });

    // 再幫「這個被點到的」按鈕加上 active
    btn.classList.add("active");

    // 更新目前的篩選條件（從 data-filter 屬性讀取）
    currentFilter = btn.dataset.filter;

    renderTodos(); // 重新畫面
  });
});
function addTodo(text, dueDate, category) {
  todos.push({ text: text, done: false, dueDate: dueDate, category: category });
  saveTodos();
  renderTodos();
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
 const filteredTodos = todos.filter(function (todo) {
    if (currentFilter === "all") return true;         // 全部：都符合
    if (currentFilter === "active") return !todo.done; // 未完成：done 是 false 的才符合
    if (currentFilter === "done") return todo.done;     // 已完成：done 是 true 的才符合
  });

  filteredTodos.forEach(function (todo, index) {
    const li = document.createElement("li");
     li.dataset.index = index;
    li.setAttribute("draggable", "true");
    li.addEventListener("dragstart", function () {
  draggedIndex = index; // 記住：現在正在拖的，是 filteredTodos 裡的第幾筆
 
});

li.addEventListener("dragover", function (event) {
  event.preventDefault(); // 允許放置（預設是禁止的，這行負責打開允許）
});

li.addEventListener("drop", function () {
  const draggedTodo = filteredTodos[draggedIndex]; // 拿出「被拖動的那一筆」資料（物件本身）
  const dropTodo = filteredTodos[index];             // 拿出「放開位置」對應的那一筆資料

  const draggedRealIndex = todos.indexOf(draggedTodo); // 找出這筆資料在 todos 裡真正的位置
  const dropRealIndex = todos.indexOf(dropTodo);         // 找出目標位置在 todos 裡真正的位置

  todos.splice(draggedRealIndex, 1);           // 從 todos 裡移除
  todos.splice(dropRealIndex, 0, draggedTodo);  // 插入到 todos 裡正確的位置

  saveTodos();
  renderTodos();
});
li.addEventListener("touchstart", function () {
  touchDraggedIndex = index;
  console.log("touchstart 觸發，拖的是第", index, "格");
});
li.addEventListener("touchmove", function (event) {
  event.preventDefault(); // 阻止頁面跟著手指捲動
  const touch = event.touches[0]; // 拿到第一根手指的資訊
  const overElement = document.elementFromPoint(touch.clientX, touch.clientY); // 問瀏覽器：這個座標點上是哪個元素？
  const overLi = overElement ? overElement.closest("li") : null; // 從那個元素往上找到所屬的 li
  if (overLi) {
    touchTargetIndex = Number(overLi.dataset.index); // 記住現在停在第幾格
    console.log("現在在第", touchTargetIndex, "格上方");
  }
}, { passive: false });
li.addEventListener("touchend", function () {
  if (touchDraggedIndex === null || touchTargetIndex === null) return; // 沒有有效拖曳就直接跳出

  const draggedTodo = filteredTodos[touchDraggedIndex]; // 被拖的那筆
  const dropTodo = filteredTodos[touchTargetIndex];      // 放開位置那筆

  const draggedRealIndex = todos.indexOf(draggedTodo);   // 回 todos 找真正位置
  const dropRealIndex = todos.indexOf(dropTodo);

  todos.splice(draggedRealIndex, 1);          // 先移除
  todos.splice(dropRealIndex, 0, draggedTodo); // 再插入到目標位置

  saveTodos();
  renderTodos();

  touchDraggedIndex = null; // 收尾：清掉，避免影響下一次拖曳
  touchTargetIndex = null;
});
    const span = document.createElement("span");
    span.textContent = todo.text;
    if (todo.dueDate) {
      span.textContent += "（截止：" + todo.dueDate + "）";
    }
    const todayString = new Date().toISOString().split("T")[0]; // 取得今天的日期字串，格式跟 dueDate 一致

  if (todo.dueDate < todayString && !todo.done) {
    span.classList.add("overdue"); // 過期又還沒完成，加上特別的 class
  }
  if (todo.category) {
  span.textContent = "【" + getCategoryLabel(todo.category) + "】" + span.textContent;
}
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
function getCategoryLabel(category) {
  if (category === "work") return "工作";
  if (category === "life") return "生活";
  if (category === "finance") return "財務";
  return "";
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