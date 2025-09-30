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
const createRotationsBtn = document.getElementById("create-rotations-btn");
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

function renderRotations(rotations, waitingList, nonHelpers) {
    const rotationList = document.getElementById("rotation-list");
    const waitingUl = document.getElementById("waiting-list");
    const nonHelpersUl = document.getElementById("non-helpers-list");

    rotationList.innerHTML = "";
    waitingUl.innerHTML = "";
    nonHelpersUl.innerHTML = "";

    rotations.forEach((rotation, i) => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>Rotation ${i + 1}:</strong> ` + rotation.map(p => `${p.name} (${p.businesses})`).join(", ");
        rotationList.appendChild(li);
    });

    waitingList.forEach(p => {
        const li = document.createElement("li");
        li.textContent = `${p.name} (${p.businesses})`;
        waitingUl.appendChild(li);
    })

    nonHelpers.forEach(p => {
        const li = document.createElement("li");
        li.textContent = `${p.name} (${p.businesses})`;
        nonHelpersUl.appendChild(li);
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

function createRotations() {
    if (!players || !Array.isArray(players)) return;

    const sellers = players.filter(p => p.businesses > 0 && !p.isNonHelper && !p.waitingSmallRotation)
                           .sort((a, b) => b.businesses - a.businesses);
    const helpers = players.filter(p => p.businesses === 0 && !p.isNonHelper && !p.waitingSmallRotation);
    const nonHelpers = players.filter(p => p.isNonHelper);
    const waitingSmall = players.filter(p => p.waitingSmallRotation);

    let waitingList = [];

    const maxRotationCount = Math.ceil((sellers.length + helpers.length) / 4) || 1;
    let rotations = Array.from({ length: maxRotationCount }, () => ({ players: [], total: 0 }));

    sellers.forEach(seller => {
        const target = rotations.reduce((min, r) => 
            r.players.length < 4 && r.total < min.total ? r : min, 
            rotations[0]
        );
        if (target.players.length < 4) {
            target.players.push(seller);
            target.total += seller.businesses;
        } else {
            waitingList.push(seller);
        }
    });

    helpers.forEach(helper => {
        const candidates = rotations.filter(r => r.players.length < 4 && r.players.some(p => p.businesses > 0));
        if (candidates.length === 0) waitingList.push(helper);
        else {
            const target = candidates.reduce((min, r) => r.total < min.total ? r : min, candidates[0]);
            target.players.push(helper);
        }
    });

    balanceRotations(rotations);

    const validRotations = rotations.filter(r => r.players.length >= 3 && r.players.some(p => p.businesses > 0));
    validRotations.forEach(r => r.players.length < 4 && waitingList.push(...r.players.splice(r.players.length)));

    while (waitingSmall.length >= 3) {
        validRotations.push({ players: waitingSmall.splice(0, 3), total: 0 });
    }
    waitingList.push(...waitingSmall);

    renderRotations(validRotations.map(r => r.players), waitingList, nonHelpers);
}

function balanceRotations(rotations) {
    let changed;
    do {
        changed = false;
        for (let i = 0; i < rotations.length; i++) {
            for (let j = i + 1; j < rotations.length; j++) {
                const sellersA = rotations[i].players.filter(p => p.businesses > 0);
                const sellersB = rotations[j].players.filter(p => p.businesses > 0);

                for (let a of sellersA) {
                    for (let b of sellersB) {
                        const newTotalA = rotations[i].total - a.businesses + b.businesses;
                        const newTotalB = rotations[j].total - b.businesses + a.businesses;
                        const diffBefore = Math.abs(rotations[i].total - rotations[j].total);
                        const diffAfter = Math.abs(newTotalA - newTotalB);

                        if (diffAfter < diffBefore) {
                            const idxA = rotations[i].players.indexOf(a);
                            const idxB = rotations[j].players.indexOf(b);
                            [rotations[i].players[idxA], rotations[j].players[idxB]] = [rotations[j].players[idxB], rotations[i].players[idxA]];

                            rotations[i].total = newTotalA;
                            rotations[j].total = newTotalB;
                            changed = true;
                        }
                    }
                }
            }
        }
    } while (changed);
}


createRotationsBtn.addEventListener("click", () => {
    createRotations();
});

toggleInfoBtn.addEventListener("click", () => {
    const isHidden = infoContent.style.display === "none" || infoContent.style.display === "";
    infoContent.style.display = isHidden ? "block" : "none";
    toggleInfoBtn.textContent = isHidden ? "Hide Info" : "Show Info";
});
