class Player {
    constructor(name, businesses, isNonHelper, waitingSmallRotation) {
        this.name = name;
        this.businesses = businesses;
        this.isNonHelper = isNonHelper;
        this.waitingSmallRotation = waitingSmallRotation;
    }
}

let players = [];

const playerForm = document.getElementById("player-input-form");
const enteredPlayersList = document.getElementById("entered-players-list");
const toggleInfoBtn = document.getElementById("toggle-info-btn");
const infoContent = document.getElementById("info-content");

function renderPlayers() {
    enteredPlayersList.innerHTML = "";

    players.forEach((player, index) => {
        const li = document.createElement("li");
        li.textContent = `${player.name} (${player.businesses}) `;

        if (player.isNonHelper) addTag(li, "Non-Helper");
        if (player.waitingSmallRotation) addTag(li, "Waiting for Small Rotation");

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.className = "remove-btn";
        removeBtn.addEventListener("click", () => removePlayer(index));
        li.appendChild(removeBtn);

        enteredPlayersList.appendChild(li);

    });
}

function addTag(li, text) {
    const badge = document.createElement("span");
    badge.className = "player-tag";
    badge.textContent = text;
    li.appendChild(badge);
}

playerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const playerName = document.getElementById("player-name-input").value.trim();
    const businesses = parseInt(document.getElementById("businesses-input").value);
    const isNonHelper = document.getElementById("non-helper-input").checked;
    const waitingSmallRotation = document.getElementById("small-rotation-input").checked;

    if (!playerName) return;

    players.push(new Player(playerName, businesses, isNonHelper, waitingSmallRotation));
    renderPlayers();
    playerForm.reset();
});

function removePlayer(index) {
    players.splice(index, 1);
    renderPlayers();
}


toggleInfoBtn.addEventListener("click", () => {
    const isHidden = infoContent.style.display === "none" || infoContent.style.display === "";
    infoContent.style.display = isHidden ? "block" : "none";
    toggleInfoBtn.textContent = isHidden ? "Hide Info" : "Show Info";
});