//정은주 2014-19498 독어교육과
const setInit = () => {
    const row = document.getElementById('width').value;
    const col = document.getElementById('height').value;
    const mine = document.getElementById('mine').value;
    if(mine> row*col) { alert('mine number should be less than row*col num!!');
        return;}
    document.getElementById('input-form').innerHTML = '';
    document.getElementById('game-form').style.visibility = 'visible';
    document.getElementById('remainingMine').textContent = mine;
    document.getElementById('game-box').setAttribute('col', col);
    document.getElementById('game-box').setAttribute('row', row);
    document.getElementById('game-box').setAttribute('mine', mine);
    document.getElementById('start').addEventListener('click', () => {
        printTimer(); 
        tableMake(); 
        setMine();}, 
        {once: true});
    document.getElementById('reset').addEventListener('click', () => {resetGame();});
}
var cells =[];
cells[0] = [];
var hour = 0;
var time = 0;
var second = 0;
var minute = 0;
var reset = 0;
var cellCount = 0;
var gameEnd = false;

function tableMake(){
    var tbBody = document.getElementById('game-body');
    var col = document.getElementById('game-box').getAttribute('col');
    var row = document.getElementById('game-box').getAttribute('row');
    for(var i = 0; i<col; i++) {
        const cellsX = [];
        cellsX[0] = [];
        var tr = document.createElement('tr');
        for(var j = 0; j<row; j++) {
            var td = document.createElement('td');
            td.style.height = '40px';
            td.style.width = '40px';
            td.style.tableLayout ='fixed';
            td.style.border = '1px, solid #666666';
            td.appendChild(document.createTextNode(" "));
            td.setAttribute('x', i);
            td.setAttribute('y', j);
            td.setAttribute('isMine', false);
            td.setAttribute('isOpen', false);
            td.addEventListener('click', isClicked(td, i, j),
                {once: true});
            cellsX[j] = td;
            tr.appendChild(td);
        }
        tbBody.appendChild(tr);
        cells[i] = cellsX;
    }
    document.getElementById('game-box').style.visibility = 'visible';
}

function setMine(){
    var mineCnt = 0;
    const col = document.getElementById('game-box').getAttribute('col');
    const row = document.getElementById('game-box').getAttribute('row');
    const mine = document.getElementById('game-box').getAttribute('mine');
    cellCount = col*row-mine;
    while(mineCnt<mine) {
        const randomX = Math.floor(Math.random()*col);
        const randomY = Math.floor(Math.random()*row);
        const X = cells[randomX][randomY];
        const isMine = X.getAttribute('isMine');
        if(isMine === 'false') {
            cells[randomX][randomY].setAttribute('isMine', true);
            mineCnt++;
        }
    }
}

const isClicked = (cell, x, y) => function(e) {
    cellOpen(cell, x, y);
}

const cellOpen = (cell, x, y) => {
    const col = document.getElementById('game-box').getAttribute('col');
    const row = document.getElementById('game-box').getAttribute('row');
    if(gameEnd) return;
    if(cell.getAttribute('isOpen') === 'true') return;
    if(cells[x][y].getAttribute('isMine') === 'true') {
        gameOver();
        gameEnd = true;
        return;
    }
    else {
        const neighborCells = [[x-1,y-1], [x-1, y], [x-1, y+1], [x, y-1],
                          [x, y+1], [x+1, y-1], [x+1, y], [x+1, y+1]];
        var mineCount = 0;
        neighborCells.forEach(function(e) {
           if(e[0]>= 0 && e[0]< col && e[1]>=0 && e[1]< row) {
                var target = cells[e[0]][e[1]];
                if(target.getAttribute('isMine') === 'true') {
                    mineCount++;
                }
           }
        }, 0);
        cellCount = cellCount-1;
        if(mineCount >0)  
        {
            cell.textContent = mineCount;
            cell.setAttribute('isOpen', true);
            cell.style.backgroundColor = 'gray';
            if(cellCount <= 0) return gameOver();
            return;
        } else {
            cell.style.backgroundColor = 'skyblue';
            cell.setAttribute('isOpen', true);
            for(let i = 0; i<8; i++) {
               k = neighborCells[i][0];
               z = neighborCells[i][1];
               if(k>=0 && k< col && z>= 0 && z<row) {
                 cellOpen(cells[k][z], k, z);
                }
            }
        }  
    }
}

const gameOver =()=> {
    const col = document.getElementById('game-box').getAttribute('col');
    const row = document.getElementById('game-box').getAttribute('row');
    for(let i = 0; i<col; i++) {
        for(let j = 0; j<row; j++) {
            if(cells[i][j].getAttribute('isMine') === 'true') {
                cells[i][j].textContent = "💣";
                cells[i][j].style.backgroundColor = "ff0000";
            }
        }
    }
    clearInterval(time);
    document.getElementById('game-body').removeEventListener('click', cellOpen);
    document.getElementById('game-result').style.visibility = 'visible';
}

class Cell {
    constructor(domElement, x, y) {
        this.domElement = domElement;
        this.x = x;
        this.y = y;
        this.isBomb = false;
        this.isOpen = domElement.getAttribute('isOpen');
    }
}

const timer=() => {
    second++;
    if(second >= 60) {
        second = 0;
        minute++;
        if(minute >= 60) {
            hour++;
            minute = 0;
            if(hour >= 12) {
                hour = 0;
                second = 0;
                minute = 0;
                start_time = 0;
            } 
        }
    }
    document.getElementById('time').textContent= ((hour<=9)? ("0"+ hour): (hour))+ ":"+
    ((minute<=9)? ("0"+ minute) : (minute)) + ":"+((second<=9)? ("0" + second) : (second));
}

const printTimer =() => {
    timer();
    time = setInterval(timer, 1000);
} 

const resetTimer =() => {
    document.getElementById('time').textContent = "00:00:00";
    clearInterval(time);
    document.getElementById('start').addEventListener('click', ()=> {
        printTimer();
        tableMake();
        setMine();}, 
        {once: true});
    reset = 1;
    hour = 0; 
    second = 0;
    minute = 0;
    gameEnd = false;
}

const resetGame =() => {
    document.getElementById('game-body').innerHTML = '';
    document.getElementById('game-box').style.visibility = 'hidden';
    document.getElementById('game-result').style.visibility = 'hidden';
    resetTimer();
}