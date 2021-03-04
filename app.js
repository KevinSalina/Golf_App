// Selecting DOM Elements
const playerForm = document.querySelector('#player-form')
const nameInput = document.querySelectorAll('input')
const startGame_btn = document.querySelector('#start-game')
const game = document.querySelector('.game-display-none')
const form_section = document.querySelector('.form-section')

const currentHole_span = document.querySelector('.currentHole')
const currentWolf_span = document.querySelector('.currentWolf')

const wolf_WonLost_input = document.querySelector('#won-lost')

const scores_section = document.querySelector('.scores')

const tie_btn = document.querySelector('#tie')
const partner_btn = document.querySelector('#partner')
const noPartner_btn = document.querySelector('#no-partner')
const loneWolf_btn = document.querySelector('#lone-wolf')

const previousHole_btn = document.querySelector('#prev-hole')
const endGame_btn = document.querySelector('#end-game')
const nextHole_btn = document.querySelector('#next-hole')
const holeButtons = [previousHole_btn, nextHole_btn]

const divvyTable_section = document.querySelector('.divvy-table')


// -------Form / Player Set Up--------
playerForm.addEventListener('submit', function(evt){
    console.log("start Game")
    nameInput.forEach(function(name, index){
        if(name.value != ''){
            const playerScoreDiv = document.createElement('div')
            const playerScoreP = document.createElement('p')
            const playerScoreSpan = document.createElement('span')
            const wolfLogo = document.createElement('span')
            playerScoreDiv.classList.add('player-score')
            // wolfLogo.classList.add('wolf-logo')
            wolfLogo.setAttribute('id', `wolflogo${index}`)
            playerScoreSpan.setAttribute("id", `p${index}-score`)
            scores_section.append(playerScoreDiv)
            playerScoreDiv.append(playerScoreP)
            playerScoreP.append(`${name.value}`)
            playerScoreP.append(wolfLogo)
            playerScoreDiv.append(playerScoreSpan)
            const newPlayer = {
                name: name.value,
                score: 0, 
                display: document.querySelector(`#p${index}-score`),
                wolfDisplay: document.querySelector(`#wolflogo${index}`)
            }
            players.push(newPlayer)
        }
    })
    console.log(players)
    currentWolf_span.innerHTML = players[0].name
    players[0].wolfDisplay.classList.add('wolf-logo')
    game.classList.remove('game-display-none')
    form_section.classList.add('game-display-none')
    evt.preventDefault();
})

// -------- Setting Game Variables ----------
// Players Array
const players = [
    // {
    //     name: "Kevin",
    //     score: 0,
    //     display: document.querySelector('#p1-score')
    // },
    // {
    //     name: "Alex",
    //     score: 0,
    //     display: document.querySelector('#p2-score')
    // },
    // {
    //     name: "Ryan",
    //     score: 0,
    //     display: document.querySelector('#p3-score')
    // },
    // {
    //     name: "Mark",
    //     score: 0,
    //     display: document.querySelector('#p4-score')
    // }
]

// Individual Game Variables
let currentHole = 1;
let wolfIndex = 0;
let currentWolf = '';
let wolf_WonLost = ''
let isGameOver = false;
let pointValue = 1;


// ------- Event Listeners ---------
// Hole Buttons
holeButtons.forEach(function(button, index){
    button.addEventListener('click', ()=>{
        switch(index){
            case 0:
                changeHole('previous')
                break;
            case 1:
                changeHole('next')
                break;
        }
    })
});

// Tie Button
tie_btn.addEventListener('click', function(){
    changeHole('next');
})

// Partner Button
partner_btn.addEventListener('click', function(){
    if(wolf_WonLost === "Won"){
        findPartnerAndUpdate('won');
        players[wolfIndex].score++
    } else if(wolf_WonLost === "Lost"){
        findPartnerAndUpdate('lost');
    }
    UpdateScoreDisplay();
    changeHole('next');
})

// No Partner Button
noPartner_btn.addEventListener('click', function(){
    if(wolf_WonLost === "Won"){
        players[wolfIndex].score += 2
    } else if (wolf_WonLost === "Lost"){
        findHuntersAndUpdate(2)
    }
    UpdateScoreDisplay();
    changeHole('next');
})

// Lone Wolf Button
loneWolf_btn.addEventListener('click', function(){
    if(wolf_WonLost === "Won"){
        players[wolfIndex].score += 3
    } else if (wolf_WonLost === "Lost"){
        findHuntersAndUpdate(3)
    }
    UpdateScoreDisplay();
    changeHole('next');
})

// End Game Button
endGame_btn.addEventListener('click', settleBets)



// --------- Game Functions ---------
// Change Hole Function
function changeHole(param){
    if(param === 'previous' & currentHole !== 1 ){
        currentHole--
        currentHole_span.innerText = currentHole
        changeWolf('previous');
    } 
    else if(param === 'next' & currentHole !== 18){
        currentHole++
        currentHole_span.innerText = currentHole
        changeWolf('next');
    }
    wolf_WonLost_input.value = ''
}

// Change Wolf Function
function changeWolf(param){
    if(param === 'previous'){
        if(wolfIndex === 0){
            wolfIndex = (players.length -1)
        } else{
        wolfIndex--
        }
    }
    else if(param === 'next'){ 
        if (wolfIndex === (players.length - 1)){
        wolfIndex = 0
        } else {
        wolfIndex++
        }
    }
    currentWolf = players[wolfIndex].name
    currentWolf_span.innerText = currentWolf
    players.forEach(player => {
        if(player.name === currentWolf){
            player.wolfDisplay.classList.add('wolf-logo')
        } else{
            player.wolfDisplay.classList.remove('wolf-logo')
        }
    })
    
}

// Hunter / Partner Score Updates
function findPartnerAndUpdate(param){
    let partner = prompt("Enter Wolf's Partner", "Player Name")
    foundPartner = players.findIndex((obj => obj.name === partner))
    if(param === 'won'){
        players[foundPartner].score++
    } else if(param === 'lost') {
        nonWolfPartnersUpdate();
    }
}

// Find non-Wolf Partner and update score
function nonWolfPartnersUpdate(){
    const winningPlayers = players.filter(function(player){
        return player != players[foundPartner] && player != players[wolfIndex]
    })
    winningPlayers.forEach(function(player){
        player.score++
    })
}

// find all Hunters function
function findHuntersAndUpdate(points){
    const hunters = players.filter(function(player){
        return player != players[wolfIndex]
    })
    hunters.forEach(function(hunter){
        hunter.score += points
    })
}


// ------- Display and Variable Functions -------
// Update Score displays function 
function UpdateScoreDisplay(){
    players.forEach(function(player){
        player.display.innerHTML = `${player.score}pts`
    })
}

// Set Wolf Win/Lost value
wolf_WonLost_input.addEventListener('change', function(){
    wolf_WonLost = wolf_WonLost_input.value
})



// Settle Bets
function settleBets(){
    for (let i = 0; i < players.length; i++){
        let playerWinnings = 0;
        const playerTable = document.createElement('div')
        playerTable.classList.add('player-table')
        const playerH3 = document.createElement('h3')
        const opponentsTable = document.createElement('div')
        opponentsTable.classList.add('opponents-table')
        divvyTable_section.append(playerTable)
        playerH3.append(`${players[i].name}`)
        playerTable.append(playerH3)
        playerTable.append(opponentsTable)
        for (let k = 0; k < players.length; k++){
            if(players[i] != players[k]){
                let divvy = (players[i].score - players[k].score) * pointValue
                const opponentDivvy = document.createElement('p')
                if(divvy > 0){
                    opponentDivvy.append(`${players[k].name}: $${divvy}`)
                    opponentDivvy.classList.add('green')
                } else if(divvy < 0){
                    opponentDivvy.append(`${players[k].name}: -$${Math.abs(divvy)}`)
                    opponentDivvy.classList.add('red')
                } else if(divvy === 0){
                    opponentDivvy.append(`${players[k].name}: $${divvy}`)
                    opponentDivvy.classList.add('grey')
                }
                opponentsTable.append(opponentDivvy)
                playerWinnings += divvy
            }
        }
        const totalEarnings = document.createElement('h4')
        playerTable.append(totalEarnings)
        if(playerWinnings >= 0){
            totalEarnings.append(`Total: $${playerWinnings}`)
        } else if(playerWinnings < 0){
            totalEarnings.append(`Total: -$${Math.abs(playerWinnings)}`)
        }
    }
}
