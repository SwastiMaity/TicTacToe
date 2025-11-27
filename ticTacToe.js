let boxes = document.querySelectorAll(".box");
let reset = document.querySelector("#reset");
let newGame = document.querySelector("#new");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let scoreOEl = document.querySelector('#scoreO');
let scoreXEl = document.querySelector('#scoreX');
let clearScoreBtn = document.querySelector('#clearScore');

let turnO = true;
let gameOver = false;

const winPatterns = [[0,1,2],[0,3,6],[0,4,8],[1,4,7],[2,5,8],[2,4,6],[3,4,5],[6,7,8]];

// Scores persisted in localStorage
let scoreO = Number(localStorage.getItem('tic_score_o') || 0);
let scoreX = Number(localStorage.getItem('tic_score_x') || 0);
updateScoreboard();

const resetGame = () => {
    turnO = true;
    gameOver = false;
    enableBoxes();
    msgContainer.classList.add("hide");
}

boxes.forEach((box) => {
    box.addEventListener("click",() => {
        if(gameOver) return;
        if(turnO){
            box.innerText = "O";
            turnO = false;
        }else{
            box.innerText = "X";
            turnO = true;
        }
        box.disabled = true;
        box.classList.remove('preview');
        checkWinner();
    })

    box.addEventListener('mouseenter', () => {
        if(box.disabled || gameOver) return;
        box.classList.add('preview');
        box.innerText = turnO ? 'O' : 'X';
    })

    box.addEventListener('mouseleave', () => {
        if(box.disabled) return;
        box.classList.remove('preview');
        box.innerText = '';
    })
})

const disableBoxes = () => {
    for(let box of boxes) {
        box.disabled = true;
    }
}

const enableBoxes = () => {
    for(let box of boxes) {
        box.disabled = false;
        box.innerText = "";
        box.classList.remove('win','preview');
    }
}

const showWinner = (winner, pattern) => {
    gameOver = true;
    msg.innerText = winner === 'Draw' ? `It's a Draw!` : `Congratulations, Winner is ${winner} !`;
    msgContainer.classList.remove("hide");
    if(pattern && pattern.length === 3){
        pattern.forEach(i => boxes[i].classList.add('win'))
    }
    disableBoxes();

    if(winner === 'O'){
        scoreO += 1;
        localStorage.setItem('tic_score_o', scoreO);
    } else if(winner === 'X'){
        scoreX += 1;
        localStorage.setItem('tic_score_x', scoreX);
    }
    updateScoreboard();
};

function updateScoreboard(){
    if(scoreOEl) scoreOEl.innerText = scoreO;
    if(scoreXEl) scoreXEl.innerText = scoreX;
}

function clearScores(){
    scoreO = 0; scoreX = 0;
    localStorage.removeItem('tic_score_o');
    localStorage.removeItem('tic_score_x');
    updateScoreboard();
}

const checkWinner = () => {
    for(let pattern of winPatterns){
        let pos1Val = boxes[pattern[0]].innerText;
        let pos2Val = boxes[pattern[1]].innerText;
        let pos3Val = boxes[pattern[2]].innerText; 

        if(pos1Val !="" && pos2Val !="" && pos3Val !=""){
            if(pos1Val === pos2Val && pos2Val === pos3Val){
                console.log("Winner!",pos1Val);
                showWinner(pos1Val, pattern);
            }
        }
    }

    // check for draw
    let allFilled = Array.from(boxes).every(b => b.innerText !== "");
    if(!gameOver && allFilled){
        showWinner('Draw');
    }
}

newGame.addEventListener("click",resetGame);
reset.addEventListener("click",resetGame);
if(clearScoreBtn) clearScoreBtn.addEventListener('click', ()=>{ clearScores(); resetGame(); });