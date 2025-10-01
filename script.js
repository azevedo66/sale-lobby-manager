class Player {
    constructor(name, businesses, isNonHelper, waitingSmallRotation) {
        this.name = name;
        this.businesses = businesses;
        this.isNonHelper = isNonHelper;
        this.waitingSmallRotation = waitingSmallRotation;
    }
}

let players = [];
let rotations = [];
let waitingList = [];

const playerForm = document.getElementById("player-input-form");
const enteredPlayersList = document.getElementById("entered-players-list");
const createRotationsBtn = document.getElementById("create-rotations-btn");
const endAllBtn = document.getElementById("end-all-btn");
const toggleInfoBtn = document.getElementById("toggle-info-btn");
const infoContent = document.getElementById("info-content");

let hideEnteredPlayers = false;

function renderPlayers() {
    enteredPlayersList.innerHTML = "";

    if (hideEnteredPlayers || players.length === 0) {
        enteredPlayersList.innerHTML = `<li class="empty-message">No players yet</li>`;
        return;
    }

    players.forEach((player, index) => {
        const li = document.createElement("li");
        li.textContent = `${player.name} (${player.businesses} businesses)`;

        if (player.isNonHelper) addTag(li, "Non-Helper");
        if (player.waitingSmallRotation) addTag(li, "Waiting for Small Rotation");

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.className = "btn-danger";
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

    if (rotations.length === 0) {
        rotationList.innerHTML = `<li class="empty-message">No players yet</li>`
    } else {
        rotations.forEach((rotationObj, i) => {
            const li = document.createElement("li");
            li.className = "rotation-item";

            const totalBusinesses = rotationObj.players.reduce((sum, p) => sum + p.businesses, 0);

            const title = document.createElement("strong");
            title.textContent = `Rotation ${i + 1} (${totalBusinesses} businesses):`;
            li.appendChild(title);
    
            rotationObj.players.forEach((player, idx) => {
                const playerDiv = document.createElement("div");
                playerDiv.className = "rotation-player";

                const nameSpan = document.createElement("span");
                nameSpan.textContent = `${player.name} (${player.businesses} businesses)`;
                playerDiv.appendChild(nameSpan);

                if (player.isNonHelper) addTag(nameSpan, "Non-Helper");
                if (player.waitingSmallRotation) addTag(nameSpan, "Waiting for Small Rotation");

                const moveBtn = document.createElement("button");
                moveBtn.textContent = "Move to Waiting";
                moveBtn.className = "btn-secondary";
                moveBtn.addEventListener("click", () => {
                    waitingList.push(player);
                    rotationObj.players.splice(idx, 1);
                    renderRotations(rotations, waitingList, nonHelpers);
                });

                playerDiv.appendChild(moveBtn);
                li.appendChild(playerDiv);
            });

            const endBtn = document.createElement("button");
            endBtn.textContent = "End Rotation";
            endBtn.className = "btn-danger";
            endBtn.addEventListener("click", () => endRotation(i));
            li.appendChild(endBtn);

            rotationList.appendChild(li);
        });
    }

    if (waitingList.length === 0) {
        waitingUl.innerHTML = `<li class="empty-message">No players yet</li>`;
    } else {
        waitingList.forEach((player, i) => {
            const li = document.createElement("li");
            li.textContent = `${player.name} (${player.businesses} businesses)`;
    
            const moveBtn = document.createElement("button");
            moveBtn.textContent = "Move to Rotation";
            moveBtn.className = "btn-primary";
            moveBtn.addEventListener("click", () => {
                let target = rotations.find(r => r.players.length < 4);
                if(!target) {
                    target = { players: [], total: 0 };
                    rotations.push(target);
                }
                target.players.push(player);
                waitingList.splice(i, 1);
                renderRotations(rotations, waitingList, nonHelpers);
            });
    
            li.appendChild(moveBtn);
            waitingUl.appendChild(li);
        });
    }
    
    if (nonHelpers.length === 0) {
        nonHelpersUl.innerHTML = `<li class="empty-message">No players yet</li>`;
    } else {
        nonHelpers.forEach(p => {
            const li = document.createElement("li");
            li.textContent = `${p.name} (${p.businesses} businesses)`;
            nonHelpersUl.appendChild(li);
        });
    }
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

    waitingList = [];

    const maxRotationCount = Math.ceil((sellers.length + helpers.length) / 4) || 1;
    rotations = Array.from({ length: maxRotationCount }, () => ({ players: [], total: 0 }));

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

    rotations = validRotations;
    waitingList = [...waitingSmall, ...waitingList];

    renderRotations(rotations, waitingList, nonHelpers);

    hideEnteredPlayers = true;
    renderPlayers();
}

function endRotation(index) {
    const rotationObj = rotations[index];
    if (!rotationObj) return;

    rotationObj.players.forEach(player => {
        player.businesses = 0;
        waitingList.push(player);
    });

    rotations.splice(index, 1);

    renderRotations(rotations, waitingList, players.filter(p => p.isNonHelper));
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

                            rotations[i].total = rotations[i].players.reduce((sum, p) => sum + p.businesses, 0);
                            rotations[j].total = rotations[j].players.reduce((sum, p) => sum + p.businesses, 0);
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

endAllBtn.addEventListener("click", () => {
    rotations.forEach(rotation =>  {
        rotation.players.forEach(player => {
            player.businesses = 0;
            waitingList.push(player);
        });
    });
    rotations = [];
    renderRotations(rotations, waitingList, players.filter(p => p.isNonHelper));
});

toggleInfoBtn.addEventListener("click", () => {
    const isHidden = infoContent.style.display === "none" || infoContent.style.display === "";
    infoContent.style.display = isHidden ? "block" : "none";
    toggleInfoBtn.textContent = isHidden ? "Hide Info" : "Show Info";
});

renderRotations([], [], []);