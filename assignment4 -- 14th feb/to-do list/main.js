function add(){
    let input = document.getElementById("task");
    let task = input.value.trim();

    if(task === "") return;

    let li = document.createElement("li");

    let span = document.createElement("span");
    span.innerText = task;

    span.onclick = function(){
        span.style.textDecoration = "line-through";
    };

    let deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.className = "delete";

    deleteBtn.onclick = function(){
        li.remove();
    };

    li.appendChild(span);
    li.appendChild(deleteBtn);

    document.getElementById("list").appendChild(li);

    input.value = "";
}