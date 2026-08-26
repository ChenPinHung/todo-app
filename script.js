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
function addTodo(text) {
  console.log("addTodo 被呼叫了，收到的文字是：", text);


  const li = document.createElement("li");        // 建立一個 <li> 元素

  const span = document.createElement("span");     // 建立文字區塊
  span.textContent = text;

  const doneBtn = document.createElement("button"); // 完成按鈕
  doneBtn.textContent = "完成";

  const deleteBtn = document.createElement("button"); // 刪除按鈕
  deleteBtn.textContent = "刪除";

  // 點擊「完成」：切換劃線樣式
  doneBtn.addEventListener("click", function () {
    span.classList.toggle("done");
  });

  // 點擊「刪除」：把這個 li 從畫面上移除
  deleteBtn.addEventListener("click", function () {
    li.remove();
  });

  li.appendChild(span);        // 把文字放進 li
  li.appendChild(doneBtn);     // 把完成按鈕放進 li
  li.appendChild(deleteBtn);   // 把刪除按鈕放進 li

  list.appendChild(li);        // 把整個 li 放進 <ul id="todo-list">
}