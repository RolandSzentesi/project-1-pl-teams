// STEP BY STEP
// RENDER ALL CLUBS ON THE PAGE IN A LIST
// CLICK EVENT (DISPLAYS PLAYERS AND INFO)
// GO BACK CLICK EVENT
// CREATE MY TEAM WITH FORM

	const createBtn = document.querySelector('#new-team');
	const container = document.querySelector('.container')
	const backbtn = document.querySelector('#back');
	const options = {
		method: 'GET',
		headers: {
			'X-RapidAPI-Key': '07b91a6f90msh4b65a94796419bfp1c1f1djsn58b0e90750b2',
			'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
	}
};

// FETCH ALL CLUBS
async function fetchAllClubs(){
	try {
		const res = await fetch('https://api-football-v1.p.rapidapi.com/v3/teams?league=39&season=2021&country=England', options);
		const data = await res.json();
		return data.response;
	} catch (err) {
		return console.error(err);
	}
}


// RENDER ALL CLUBS
 async function renderAllClubs(){
	const allClubs =   await fetchAllClubs()
	const clubs = Object.entries(allClubs)
	clubs.forEach(club =>{
		const teams = club[1]
		const team = teams.team
		const clubContainer = createClubCard(team)
		container.appendChild(clubContainer)
	})
}

// CREATS CLUB CARDS
function createClubCard(team){

	const clubContainer = document.createElement('div')
	const h4 = document.createElement('h4')
	const logos = document.createElement('img')
	const p = document.createElement('p')
	const playerBtn = document.createElement('button')

	clubContainer.classList = 'card'
	h4.textContent = `${team.name}`
	logos.src = `${team.logo}`
	logos.setAttribute('id', 'team-logo')
	p.textContent = `Founded: ${team.founded}`
	playerBtn.textContent = 'See Players'
	playerBtn.classList = 'button'
	playerBtn.dataset.teamId = team.id
	playerBtn.addEventListener('click', fetchAllPlayers)
	clubContainer.append(h4, logos, p, playerBtn)

 return clubContainer
}

// CLEARS PAGE 
function clearClubs(){
	const boxes = Array.from(container.children)
	boxes.forEach(box => {
		box.remove()
	})
}

// LOADS CONTAINER WITH CLUBS
function loadContainer(data){
	data.forEach(team =>{
		const card = createClubCard(team)
		container.append(card)
	})
}

// CLICK EVENT (CLEARS PAGE AND RERENDER ALL CLUBS)
backbtn.addEventListener('click', () =>{
	clearClubs();
	 renderAllClubs();
	 const h1 = document.querySelector('h1');
	 const html = document.querySelector('html');
	 h1.textContent = 'Welcome To Barclays Premier League';
	 html.style.backgroundImage = "url(./pl-logo.jpg)";
})


// CLICK EVENT (CREATING YOUR OWN CLUB WITH PLAYERS)
createBtn.addEventListener('click', () => {
	clearClubs();
	const h1 = document.querySelector('#title');
	h1.textContent = 'Welcome To Create My Team';

	const form = document.createElement('form');
	form.classList = 'form';

	const clubName = document.createElement('input');
	clubName.setAttribute('type', 'text');
	clubName.setAttribute('name', 'clubname');
	clubName.setAttribute('placeholder', 'Club Name');
	clubName.setAttribute('id', 'club-input')

	const playerName = document.createElement('input');
	playerName.setAttribute('type', 'text');
	playerName.setAttribute('name', 'newplayer');
	playerName.setAttribute('placeholder', 'New Player');
	playerName.setAttribute('id', 'name-input')

	const playerAge = document.createElement('input');
	playerAge.setAttribute('type', 'text');
	playerAge.setAttribute('name', 'age');
	playerAge.setAttribute('placeholder', 'Player Age');
	playerAge.setAttribute('id', 'age-input')

	const playerPosition = document.createElement('input');
	playerPosition.setAttribute('type', 'text');
	playerPosition.setAttribute('name', 'position');
	playerPosition.setAttribute('placeholder', 'Player Position');
	playerPosition.setAttribute('id', 'position-input')

	const playerNumber = document.createElement('input');
	playerNumber.setAttribute('type', 'text');
	playerNumber.setAttribute('name', 'number');
	playerNumber.setAttribute('placeholder', 'Player Number');
	playerNumber.setAttribute('id', 'number-input')

	const submitBtn = document.createElement('button');
	submitBtn.setAttribute('type', 'submit');
	submitBtn.setAttribute('id', 'submit-button');
	submitBtn.textContent = 'SUBMIT';

	form.addEventListener('submit', createNewPlayers);

	form.append(clubName, playerName, playerAge, playerNumber, playerPosition, submitBtn);
	container.append(form);
	renderCustomPlayers(newTeam)
})

let newTeam = []

// SUBMIT EVENT (CREATING NEW PLAYERS FOR MY TEAM)
function createNewPlayers(e){
	e.preventDefault()


const clubInput = document.querySelector('#club-input')
const nameInput = document.querySelector('#name-input')
const ageInput = document.querySelector('#age-input')
const positionInput = document.querySelector('#position-input')
const numberInput = document.querySelector('#number-input')
const form = document.querySelector('form')
const player ={	
	'clubname': clubInput.value,
	'name': nameInput.value,
	'age': ageInput.value,
	'position': positionInput.value,
	'number': numberInput.value
}
 	newTeam.push(player)
 	renderCustomPlayers(newTeam)
	form.reset()
}

function customPlayer(player, id){
		const playerContainer = document.createElement('div')
	const clubName = document.createElement('h3')
	const playerName = document.createElement('h4')
	const age = document.createElement('p')
	const position = document.createElement('p')
	const number = document.createElement('p')
	const removeBtn = document.createElement('button')

	playerContainer.classList = 'new-card'
	clubName.textContent = player.clubname
	playerName.textContent = player.name
	age.textContent = player.age
	position.textContent = player.position
	number.textContent = player.number
	removeBtn.textContent = ' X '
	removeBtn.classList = 'remove'
	removeBtn.dataset.playerId = id
	removeBtn.addEventListener('click', (e) =>{
		newTeam.splice(e.target.getAttribute('data-player-id'),1)
		filterContainer()
		renderCustomPlayers(newTeam)
	})

	playerContainer.append(clubName, playerName, age, position, number, removeBtn)
	return playerContainer
}

function renderCustomPlayers(team){
	filterContainer()
	team.forEach((player, index) =>{
		container.appendChild(customPlayer(player, index))
	})
}

function filterContainer(){
	const cards = Array.from(container.children).filter(element=> element.nodeName !== 'FORM')
	cards.forEach(card =>card.remove())	
}

// CLICK EVENT FETCH ALL PLAYERS 
async function fetchAllPlayers(event){
	const team = event.target;
	const teamId = team.getAttribute('data-team-id');
	clearClubs()
	try{
		const res = await fetch(`https://api-football-v1.p.rapidapi.com/v3/players/squads?team=${teamId}`, options);
		const data = await res.json();
		loadTeam(data.response)
	} catch (err) {
	return console.error(err);
	}
}

// DISPLAYS CLUBS PLAYERS
function loadTeam(teamData){
	const h1 = document.querySelector('#title')
	const teamsAndPlayers = teamData[0]
	h1.textContent = `Welcome To ${teamsAndPlayers.team.name}'s Roster`;
	teamsAndPlayers.players.forEach(player =>{
		const card = createPlayerCard(player)
		card.style.backgroundColor = 'black'
		container.append(card)
	}) 
}

// CREATS PLAYER CARDS
function createPlayerCard(player){
	const playerContainer = document.createElement('div')
	const playerName = document.createElement('h4')
	const age = document.createElement('p')
	const position = document.createElement('p')
	const number = document.createElement('p')
	const pic = document.createElement('img')

	playerContainer.classList = 'card'
	playerName.textContent = `${player.name}`;
	age.textContent = `${player.age}`;
	position.textContent = `${player.position}`;
	number.textContent = `${player.number}`;
	pic.src = `${player.photo}`
	playerContainer.append(playerName, age, position, number, pic)
	return playerContainer
}

renderAllClubs()