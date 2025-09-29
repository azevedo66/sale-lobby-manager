class Player {
    constructor(name, businesses, isNonHelper, waitingSmallRotation) {
        this.name = name;
        this.businesses = businesses;
        this.isNonHelper = isNonHelper;
        this.waitingSmallRotation = waitingSmallRotation;
    }

    getDisplayText() {
        const nonHelperText = this.isNonHelper ? "Yes" : "No";
        const smallRotationText = this.waitingSmallRotation ? "Yes" : "No";
        return `${this.name} | Businesses: ${this.businesses} | Non-Helper: ${nonHelperText} | Small Rotation: ${smallRotationText}`;
    }
}

const playerForm = document.getElementById('player-input-form');
const enteredPlayersList = document.getElementById('entered-players-list');

playerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const playerName = document.getElementById('player-name-input').value.trim();
    const businesses = parseInt(document.getElementById('businesses-input').value);
    const isNonHelper = document.getElementById('non-helper-input').checked;
    const waitingSmallRotation = document.getElementById('small-rotation-input').checked;

    const player = new Player(playerName, businesses, isNonHelper, waitingSmallRotation);

    const li = document.createElement('li');
    li.textContent = player.getDisplayText();
    enteredPlayersList.appendChild(li);

    playerForm.reset();
});