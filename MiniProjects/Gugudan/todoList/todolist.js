window.onload = function () {
    const savedToDoList = JSON.parse(localStorage.getItem('todolist'));

    if (savedToDoList) {
        for (let todo of savedToDoList) {
            createToDo(todo);
        }
    }

    const startBtn = document.querySelector("#addBtn");
    startBtn.addEventListener("click", () => createToDo());

    const inputBox = document.querySelector("#inputBox");
    inputBox.addEventListener("keydown", function (event) {
        if (event.key === 'Enter') createToDo();
    });

    // 전체 삭제 기능 추가
    const clearBtn = document.querySelector("#clearAllBtn");
    clearBtn.addEventListener("click", function () {
        document.querySelector("#todolist").innerHTML = '';
        localStorage.removeItem("todolist");
    });
};

function createToDo(todo) {
    const inputBox = document.querySelector("#inputBox");

    if (!todo && inputBox.value.trim() === "") return;

    const liNode = document.createElement('li');

    const checkBtn = document.createElement('button');
    checkBtn.classList.add("checkBtn");
    //(체크 버튼 로직 생략)
    const todoText = document.createElement('span');
    if (todo) {
        todoText.innerText = todo.contents;
        if (todo.check) todoText.classList.add('check');
    } else {
        todoText.innerText = inputBox.value.trim();
    }

    // 체크 버튼 클릭 시 스타일 토글
    checkBtn.addEventListener("click", function () {
        todoText.classList.toggle('check');
        checkBtn.innerText = checkBtn.innerText === "" ? "V" : "";
        saveToDoList();
    });

    // 삭제 버튼 -- 삭제 버튼 생성 및 로직
    const delBtn = document.createElement('button');
    delBtn.innerText = 'X';
    delBtn.classList.add("delBtn");
    // 삭제 버튼 클럭 시:
    //1. 해당 <li> 요소를 dom 에서 제거
    //2. 변경된 리스트를 로컬스토리지에 저장
    delBtn.addEventListener("click", function () {
        liNode.remove();  //화면에서 삭제
        saveToDoList();   // 저장된 목록 업데이트
    });

    // 편집 기능 추가
    // 더블클릭하면 prompt로 수정
    todoText.addEventListener("dblclick", function () {
        // 1. prompt 창으로 사용자 입력 받기
        const newText = prompt("할 일을 수정하세요.", todoText.innerText);
        // 2. 사용자가 "취소" 를 누르지 않았고, 입력갑이 유효할 떄만 반영
        if (newText !== null && newText.trim() !== "") {
            todoText.innerText = newText.trim(); 
            saveToDoList();  // 수정돈 목록 저장
        }
    });

    liNode.appendChild(checkBtn);
    liNode.appendChild(todoText);
    liNode.appendChild(delBtn);

    document.querySelector("#todolist").appendChild(liNode);
    document.querySelector("#todolist").style.display = 'block';

    saveToDoList();
}

function saveToDoList() {
    const todoList = document.querySelectorAll('li');
    const saveItems = [];

    for (let node of todoList) {
        const todoObj = {
            contents: node.querySelector('span').innerText,
            check: node.querySelector('span').classList.contains('check')
        };
        saveItems.push(todoObj);
    }

    const list = JSON.stringify(saveItems);
    localStorage.setItem('todolist', list);
}
