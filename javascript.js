'use strict'

const theme = document.getElementById('theme');
const toDo = document.getElementById('toDo');
const toDoList = document.getElementById('todos');
const allList = document.querySelector('.all-list');
const activeList = document.querySelector('.active-list');
const completedList = document.querySelector('.completed-list');
const clearCompleted = document.querySelector('.clear-completed')
const itemsLeft = document.querySelector('.items-left')
const clearCompletedLarge = document.querySelector('.clear-completed-lg')
const itemsLeftLarge = document.querySelector('.items-left-lg')



//THEME_SWITCHER

theme.addEventListener('click', changeTheme);

const isDarkTheme = localStorage.getItem("darkTheme");
if (isDarkTheme === "false") {
    document.body.classList.add('theme-light');
    theme.firstChild.src = "images/icon-moon.svg";
}
function changeTheme() {
    document.body.classList.toggle('theme-light');
    if (document.body.classList.contains('theme-light')) {
        theme.firstChild.src = "images/icon-moon.svg";
        localStorage.setItem("darkTheme", "false");
    }

    else {
        theme.firstChild.src = "images/icon-sun.svg";
        localStorage.setItem("darkTheme", "true");

    }
}

//TODO ITEMS

function addToDo(textValue, isChecked) {
    toDoList.insertAdjacentHTML(
        "beforeend",
        `<li class="list-group cursor-grab " draggable="true" ondragstart = "dragStart(event)"> 
         <label href="checkbox" class="container-box"> 
         <input type="checkbox" name="todoItem"  >  
           <span class="checked" ></span>
        </label>
      <span class="list-text basis-5/6 ">${textValue}</span>
      <img class="delete" src="images/icon-cross.svg" alt=""></li>`
    )


    const listItem = toDoList.lastChild;
    const listText = listItem.querySelector('.list-text');
    const checkbox = listItem.querySelector('input[type=checkbox]');

    //checked
    checkbox.addEventListener('click', () => {

        if (checkbox.checked) {
            listText.style.textDecoration = 'line-through';
            listText.style.opacity = '0.5';
        }
        else {
            listText.style.textDecoration = 'none';
            listText.style.opacity = '1';

        }
        countUncheckedItems();
        saveTodoList();

    })
    if (isChecked) {
        checkbox.click()
    }

    //removeItem
    const removeItem = listItem.lastChild;
    removeItem.addEventListener('click', () => {
        listItem.remove();
        countUncheckedItems();
        saveTodoList();


    })

    //clearCompleted
    clearCompleted.addEventListener("click", () => {
        if (checkbox.checked) {
            listItem.remove();
        }
        saveTodoList();

    })

    // clearCompletedLarge.addEventListener("click", () => {
    //     if (checkbox.checked) {
    //         listItem.remove();
    //     }
    //     saveTodoList();

    // })
    countUncheckedItems();
    saveTodoList();

}
//enter inputText

toDo.addEventListener('keydown', function (e) {
    if (e.code === "Enter") {
        const inputText = toDo.value;
        addToDo(inputText);
        toDo.value = "";

    }

})


//itemsLeft

function countUncheckedItems() {
    const uncheckedCheckboxes = toDoList.querySelectorAll('input[type="checkbox"]:not(:checked)')

    // if (window.innerWidth <= 500) {
    itemsLeft.innerHTML = `${uncheckedCheckboxes.length} items left`;
    // }
    // else {
    //     itemsLeftLarge.innerHTML = `${uncheckedCheckboxes.length} items left`;

    // }
}

//sortingList

allList.addEventListener('click', () => {
    // call list-items from unordered list
    const listItems = toDoList.children;
    // pick each item using foreach loop
    for (let index = 0; index < listItems.length; index++) {
        const listItem = listItems.item(index);

        // assign display block to each list item
        listItem.style.display = 'block';
        // console.log(listItem)
    };
})

activeList.addEventListener('click', () => {
    const listItems = toDoList.children;
    for (let index = 0; index < listItems.length; index++) {
        const listItem = listItems.item(index);
        const checkbox = listItem.querySelector('input[type=checkbox]');
        if (checkbox.checked) {
            listItem.style.display = 'none';
        }
        else {
            listItem.style.display = 'block';
        }
    }
})

completedList.addEventListener('click', () => {
    const listItems = toDoList.children;
    for (let index = 0; index < listItems.length; index++) {
        const listItem = listItems.item(index);
        const checkbox = listItem.querySelector('input[type=checkbox]');
        if (checkbox.checked) {
            listItem.style.display = 'block';
        }
        else {
            listItem.style.display = 'none';
        }
    }
})

//DragItems

let draggedItem = null;

function dragStart(event) {
    draggedItem = event.target;
}

function dragOver(event) {
    event.preventDefault();
}

function dragEnter(event) {
    event.preventDefault();
}

function dragLeave(event) {
    event.preventDefault();
}

function dragDrop(event) {
    event.preventDefault();
    const draggedOverItem = event.target.closest('li');

    if (draggedItem !== draggedOverItem) {
        const draggedIndex = Array.from(toDoList.children).indexOf(draggedItem);
        const droppedIndex = Array.from(toDoList.children).indexOf(draggedOverItem);
        toDoList.insertBefore(draggedItem, draggedIndex > droppedIndex ? draggedOverItem : draggedOverItem.nextSibling);
    }
    draggedItem = null;
    saveTodoList();
}

toDoList.addEventListener('dragover', dragOver);
toDoList.addEventListener('dragenter', dragEnter);
toDoList.addEventListener('dragleave', dragLeave);
toDoList.addEventListener('drop', dragDrop);


// restoreComponents

function loadTodoList() {
    const todosData = JSON.parse(localStorage.getItem('todosData'));
    todosData.forEach((item) => {
        addToDo(item.name, item.isChecked);
    })
}

function saveTodoList() {
    const todosData = Array.from(toDoList.children).map(listItem => {
        const checkbox = listItem.querySelector('input[type=checkbox]');

        return {
            name: listItem.textContent.trim(),
            isChecked: checkbox.checked
        }
    });

    localStorage.setItem('todosData', JSON.stringify(todosData));

}
document.addEventListener('DOMContentLoaded', function () {
    loadTodoList();

})
