class Player {
    constructor(name, businesses, isNonHelper, waitingSmallRotation) {
        this.name = name;
        this.businesses = businesses;
        this.isNonHelper = isNonHelper;
        this.waitingSmallRotation = waitingSmallRotation;
    }
}

const playerForm = document.getElementById("player-input-form");
const enteredPlayersList = document.getElementById("entered-players-list");

playerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const playerName = document.getElementById("player-name-input").value.trim();
    const businesses = parseInt(document.getElementById("businesses-input").value);
    const isNonHelper = document.getElementById("non-helper-input").checked;
    const waitingSmallRotation = document.getElementById("small-rotation-input").checked;

    if (!playerName) return;

    const player = new Player(playerName, businesses, isNonHelper, waitingSmallRotation);

    const li = document.createElement("li");
    li.textContent = `${player.name} (${player.businesses} businesses)`;

    if (player.isNonHelper) {
        const badge = document.createElement("span");
        badge.classList.add("player-tag");
        badge.textContent = "Non-Helper";
        li.appendChild(badge);
    }

    if (player.waitingSmallRotation) {
        const badge = document.createElement("span");
        badge.classList.add("player-tag");
        badge.textContent = "Waiting Small Rotation";
        li.appendChild(badge);
    }

    enteredPlayersList.appendChild(li);

    playerForm.reset();
});

const toggleInfoBtn = document.getElementById("toggle-info-btn");
const infoContent = document.getElementById("info-content");

toggleInfoBtn.addEventListener("click", () => {
    if (infoContent.style.display === "none" || infoContent.style.display === "") {
        infoContent.style.display = "block";
        toggleInfoBtn.textContent = "Hide Info";
    } else {
        infoContent.style.display = "none";
        toggleInfoBtn.textContent = "Show Info"
    }
});