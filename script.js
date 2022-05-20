let addBtn = document.querySelector('.add-btn');
let modal = document.querySelector('.modal-cont');
let main = document.querySelector('.main-cont');
let txtValue = document.querySelector('.textarea-cont')
let flag = true;
let priorityDiv = document.querySelectorAll('.priority-color');
let modalColor = "black";
let removeFlag = true;
let removeBtn = document.querySelector('.remove-btn');
let toolBoxColors = document.querySelectorAll(".color");
let colorArr = ['lightpink', 'blue', 'green', 'black'];
let bGround = document.querySelector('.main-cont');
var uid = new ShortUniqueId();
let iFlag = true;

let ticketArr = [];

if (localStorage.getItem("tickets")) {
    let str = localStorage.getItem("tickets");
    let arr = JSON.parse(str);
    ticketArr = arr;
    for (let i = 0; i < arr.length; i++) {
        let ticketObj = arr[i];
        console.table(ticketObj)
        createTask(ticketObj.color, ticketObj.task, ticketObj.id);
    }
}

//Handling Filter
for (let i = 0; i < toolBoxColors.length; i++) {
    toolBoxColors[i].addEventListener("click", function () {
        let currentColor = toolBoxColors[i].classList[1];
        let filteredArr = [];
        for (let i = 0; i < ticketArr.length; i++) {
            if (ticketArr[i].color == currentColor) {
                filteredArr.push(ticketArr[i]);
            }
        }
        // console.log(filteredArr);
        let allTickets = document.querySelectorAll(".ticket-cont");
        for (let j = 0; j < allTickets.length; j++) {
            allTickets[j].remove();
        }
        for (let i = 0; i < filteredArr.length; i++) {
            let ticket = filteredArr[i];
            let color = ticket.color;
            let task = ticket.task;
            let id = ticket.id;
            createTask(color, task, id)
        }
    })

    toolBoxColors[i].addEventListener("dblclick", function () {
        let allTickets = document.querySelectorAll(".ticket-cont");
        for (let j = 0; j < allTickets.length; j++) {
            allTickets[j].remove();
        }
        for (let i = 0; i < ticketArr.length; i++) {
            let ticket = ticketArr[i];
            let color = ticket.color;
            let task = ticket.task;
            let id = ticket.id;
            createTask(color, task, id)
        }
    })
}

//filetr ended

removeBtn.addEventListener('click', () => {
    if (removeFlag) {
        removeBtn.style.color = "red";
    } else {
        removeBtn.style.color = "black";
    }
    removeFlag = !removeFlag;
})

addBtn.addEventListener('click', function () {
    if (iFlag && flag) {
        //show
        addBtn.style.color = "green";
        modal.style.display = "flex"
        bGround.style.display = "none"
    } else {
        //hide
        addBtn.style.color = "black";
        modal.style.display = "none";
        bGround.style.display = "flex"
    }
    flag = !flag;
})

for (let i = 0; i < priorityDiv.length; i++) {
    priorityDiv[i].addEventListener('click', function () {
        for (let j = 0; j < priorityDiv.length; j++) {
            priorityDiv[j].classList.remove('active');
        }
        priorityDiv[i].classList.add('active');
        modalColor = priorityDiv[i].classList[0];
    })
}

modal.addEventListener('keydown', function (e) {
    let key = e.key;
    if (key == 'Enter') {
        let val = txtValue.value;
        createTask(modalColor, val);
        modal.style.display = "none";
        addBtn.style.color = "black";
        bGround.style.display = "flex"
        flag = true;
        txtValue.value = '';


    }
})


function createTask(modalColor, value, ticketId) {
    let id;
    if (ticketId == undefined) {
        id="#"+uid();
    } else {
        id = ticketId;
    }
    let task = document.createElement('div');
    task.setAttribute('class', 'ticket-cont');
    task.innerHTML = ` <div class="ticket-color ${modalColor}"></div>
                     <div class="ticket-id">${id}</div>
                     <div class="task-area">${value}</div>
                     <div class="lock-unlock"><i class="fa fa-lock"></i></div>`;
    main.appendChild(task);

    //handling lock and unlock
    let lockUnlockBtn = task.querySelector(".lock-unlock i");
    let ticketTaskArea = task.querySelector(".task-area");
    lockUnlockBtn.addEventListener("click", function () {
        if (lockUnlockBtn.classList.contains("fa-lock")) {
            lockUnlockBtn.classList.remove("fa-lock");
            lockUnlockBtn.classList.add("fa-unlock");
            ticketTaskArea.setAttribute("contenteditable", "true");
        } else {
            lockUnlockBtn.classList.remove("fa-unlock");
            lockUnlockBtn.classList.add("fa-lock");
            ticketTaskArea.setAttribute("contenteditable", "false");
        }

       //updating the main array after the updating content
       let ticketIdx = getTicketIdx(id);
       ticketArr[ticketIdx].task = ticketTaskArea.textContent;
       updateLocalStorage();
    })


    //handling remove
    task.addEventListener('click', () => {
        if (removeFlag == false) {
            task.remove();
        }
    })

    //handling priority color
    let ticketColorBand = task.querySelector('.ticket-color');
    ticketColorBand.addEventListener("click", function () {
        let curColor = ticketColorBand.classList[1];
        let curIdx = -1;
        for (let i = 0; i < colorArr.length; i++) {
            if (curColor == colorArr[i]) {
                curIdx = i;
                break;
            }
        }
        let nxtIdx = (curIdx + 1) % colorArr.length;
        let nxtColor = colorArr[nxtIdx];
        ticketColorBand.classList.remove(curColor);
        ticketColorBand.classList.add(nxtColor);
        let ticketIdx = getTicketIdx(id);
        ticketArr[ticketIdx].color = nxtColor;
        updateLocalStorage();
    })


    if (ticketId == undefined) {
        ticketArr.push({ "color": modalColor, "task": value, "id": id })
        updateLocalStorage();
    }



}

function getTicketIdx(id){
    for(let i=0;i<ticketArr.length;i++){
        if(ticketArr[i].id==id){
            return i;
        }
    }
}

function updateLocalStorage(){
    let stringifyArr = JSON.stringify(ticketArr);
    localStorage.setItem("tickets",stringifyArr);
}

let info = document.querySelector('.info-btn');
let iCont = document.querySelector('.info-cont');
info.addEventListener('click',()=>{
    if(flag && iFlag){
  iCont.style.display = "flex";
  info.style.color = "blue";
    }else{
        iCont.style.display = "none";
        info.style.color = "black";
    }
    iFlag = !iFlag;
})