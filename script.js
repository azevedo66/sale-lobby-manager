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
let rotationsInitialized = false;

function addTag(li, text) {
    const badge = document.createElement("span");
    badge.className = "player-tag";
    badge.textContent = text;
    li.appendChild(badge);
}

function createPlayerElement(player, buttonText, buttonClass, buttonAction) {
    const container = document.createElement("div");
    container.className = "player-item-container";
    
    const nameSpan = document.createElement("span");
    nameSpan.textContent = `${player.name} (${player.businesses} businesses)`;
    if (player.isNonHelper) addTag(nameSpan, "Non-Helper");
    if (player.waitingSmallRotation) addTag(nameSpan, "Waiting for Small Rotation");
    container.appendChild(nameSpan);

    const btn = document.createElement("button");
    btn.textContent = buttonText;
    btn.className = buttonClass;
    btn.addEventListener("click", buttonAction);
    container.appendChild(btn);

    return container;
}

function renderPlayers() {
    enteredPlayersList.innerHTML = "";

    if (hideEnteredPlayers || players.length === 0) {
        enteredPlayersList.innerHTML = `<li class="empty-message">No players yet</li>`;
        return;
    }

    players.forEach((player, index) => {
        const playerEl = createPlayerElement(
            player,
            "Remove",
            "btn-danger",
            () => {
                players.splice(index, 1);
                renderPlayers();
            }
        );

        const li = document.createElement("li");
        li.appendChild(playerEl);
        enteredPlayersList.appendChild(li);
    });
}

function renderRotations(rotationsArr, waitingArr, nonHelpersArr) {
    const rotationList = document.getElementById("rotation-list");
    const waitingUl = document.getElementById("waiting-list");
    const nonHelpersUl = document.getElementById("non-helpers-list");

    rotationList.innerHTML = "";
    waitingUl.innerHTML = "";
    nonHelpersUl.innerHTML = "";

    if (rotationsArr.length === 0) {
        rotationList.innerHTML = `<li class="empty-message">No players yet</li>`
    } else {
        rotationsArr.forEach((rotationObj, i) => {
            const li = document.createElement("li");
            li.className = "rotation-item";

            const totalBusinesses = (rotationObj.players || []).reduce((sum, p) => sum + (p?.businesses || 0), 0);
            const title = document.createElement("strong");
            title.textContent = `Rotation ${i + 1} (${totalBusinesses} businesses):`;
            li.appendChild(title);
    
            rotationObj.players.forEach((player, idx) => {
                if (!player) return;
                const playerEl = createPlayerElement(
                    player,
                    "Move to Waiting List",
                    "btn-primary",
                    () => {
                        waitingArr.push(player);
                        rotationObj.players.splice(idx, 1);
                        renderRotations(rotationsArr, waitingArr, nonHelpersArr);
                    }
                );
                li.appendChild(playerEl);
            });

            const endBtn = document.createElement("button");
            endBtn.textContent = "End Rotation";
            endBtn.className = "btn-danger";
            endBtn.addEventListener("click", () => endRotation(i));
            li.appendChild(endBtn);

            rotationList.appendChild(li);
        });
    }

    if (waitingArr.length === 0) {
        waitingUl.innerHTML = `<li class="empty-message">No players yet</li>`;
    } else {
        waitingArr.forEach((player, i) => {
            if (!player) return;
            const li = document.createElement("li");
            const playerEl = createPlayerElement(
                player, 
                "Move to Rotation",
                "btn-primary",
                () => {
                    let target = rotationsArr.find(r => r.players.length < 4);
                    if (!target) {
                        target = { players: [], total: 0 };
                        rotationsArr.push(target);
                    }
                    target.players.push(player);
                    waitingArr.splice(i, 1);
                    renderRotations(rotationsArr, waitingArr, nonHelpersArr);
                }
            );
            
            li.appendChild(playerEl);
            waitingUl.appendChild(li);
        });
    }
    
    if (nonHelpersArr.length === 0) {
        nonHelpersUl.innerHTML = `<li class="empty-message">No players yet</li>`;
    } else {
        nonHelpersArr.forEach(p => {
            const li = document.createElement("li");
            li.textContent = `${p.name} (${p.businesses} businesses)`;
            nonHelpersUl.appendChild(li);
        });
    }
}

playerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const playerName = document.getElementById("player-name-input").value.trim();
    const businesses = parseInt(document.getElementById("businesses-input").value);
    const isNonHelper = document.getElementById("non-helper-input").checked;
    const waitingSmallRotation = document.getElementById("small-rotation-input").checked;

    if (!playerName) return;

    const newPlayer = new Player(playerName, businesses, isNonHelper, waitingSmallRotation);
    
    players.push(newPlayer);

    if (rotationsInitialized) {
        addNewPlayerAfterRotations(newPlayer);
    } else {
        renderPlayers();
    }
    
    playerForm.reset();
});

function removePlayer(index) {
    players.splice(index, 1);
    renderPlayers();
}

function createRotations() {
    if (!players || !Array.isArray(players)) return;

    let sellers = players.filter(p => p.businesses > 0 && !p.isNonHelper && !p.waitingSmallRotation)
                         .sort((a, b) => b.businesses - a.businesses);
    let helpers = players.filter(p => p.businesses === 0 && !p.isNonHelper && !p.waitingSmallRotation);
    const nonHelpers = players.filter(p => p.isNonHelper);
    const waitingSmall = players.filter(p => p.waitingSmallRotation);

    rotations = [];
    waitingList = [];

    const totalPlayers = sellers.length + helpers.length;

    if (totalPlayers <= 2) {
        waitingList.push(...sellers, ...helpers);
        renderRotations(rotations, waitingList, nonHelpers);
        hideEnteredPlayers = true;
        renderPlayers();
        return;
    }

    if (sellers.length === 5 && helpers.length === 0) {
        const group = sellers.splice(0, 4);
        rotations.push({
            players: group,
            total: group.reduce((sum, p) => sum + p.businesses, 0)
        });
    } else if (sellers.length === 5 || sellers.length === 6) {
        const numRot = 2;
        for (let i = 0; i < numRot; i++) {
            const groupSize = Math.ceil(sellers.length / (numRot - i));
            const group = sellers.splice(0, groupSize);
            rotations.push({
                players: group,
                total: group.reduce((sum, p) => sum + p.businesses, 0)
            });
        }
    }

    while (sellers.length + helpers.length >= 4) {
        const group = [];
        while (sellers.length > 0 && group.length < 4) group.push(sellers.shift());
        while (group.length < 4 && helpers.length > 0) group.push(helpers.shift());
        rotations.push({
            players: group,
            total: group.reduce((sum, p) => sum + (p.businesses || 0), 0)
        });
    }

    if (sellers.length + helpers.length === 3) {
        const group = [...sellers, ...helpers];
        rotations.push({
            players: group,
            total: group.reduce((sum, p) => sum + (p.businesses || 0), 0)
        });
        sellers = [];
        helpers = [];
    }

    rotations.forEach(rot => {
        while (rot.players.length < 4 && helpers.length > 0) {
            const helper = helpers.shift();
            rot.players.push(helper);
            rot.total += helper.businesses || 0;
        }
    });

    if (sellers.length > 0) waitingList.push(...sellers);
    if (helpers.length > 0) waitingList.push(...helpers);

    while (waitingSmall.length >= 3) {
        const group = waitingSmall.splice(0, 3);
        rotations.push({
            players: group,
            total: group.reduce((sum, p) => sum + (p.businesses || 0), 0)
        });
    }
    if (waitingSmall.length > 0) waitingList.push(...waitingSmall);

    balanceRotations(rotations);

    renderRotations(rotations, waitingList, nonHelpers);
    hideEnteredPlayers = true;
    renderPlayers();
}

function balanceRotations(rotations) {
    let changed;
    do {
        changed = false;

        const sellersPerRotation = rotations.map(rot => rot.players.filter(p => p.businesses > 0));

        for (let i = 0; i < rotations.length; i++) {
            for (let j = i + 1; j < rotations.length; j++) {
                const sellersA = sellersPerRotation[i];
                const sellersB = sellersPerRotation[j];

                if (!sellersA.length || !sellersB.length) continue;

                for (let a of sellersA) {
                    for (let b of sellersB) {
                        const totalA = rotations[i].players.reduce((sum, p) => sum + (p.businesses || 0), 0);
                        const totalB = rotations[j].players.reduce((sum, p) => sum + (p.businesses || 0), 0);
                        const newTotalA = totalA - a.businesses + b.businesses;
                        const newTotalB = totalB - b.businesses + a.businesses;

                        if (Math.abs(newTotalA - newTotalB) < Math.abs(totalA - totalB)) {
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

function addNewPlayerAfterRotations(player) {
    waitingList.push(player);

    let incompleteRotation = rotations.find(rot => rot.players.length < 4);
    if (incompleteRotation) {
        incompleteRotation.players.push(player);
        incompleteRotation.total += player.businesses || 0;
        waitingList = waitingList.filter(p => p !== player);
    } else if (player.businesses > 0) {
        const rotationWithHelper = rotations.find(rot => rot.players.some(p => p.businesses === 0));
        if (rotationWithHelper) {
            const helperIndex = rotationWithHelper.players.findIndex(p => p.businesses === 0);
            const replacedHelper = rotationWithHelper.players[helperIndex];
            rotationWithHelper.players[helperIndex] = player;
            rotationWithHelper.total += player.businesses - replacedHelper.businesses;
            waitingList = waitingList.filter(p => p !== player);
            waitingList.push(replacedHelper);
        } 
    }

    while (waitingList.some(p => p.businesses > 0)) {
        const sellers = waitingList.filter(p => p.businesses > 0);
        const helpers = waitingList.filter(p => p.businesses === 0);

        if (sellers.length === 0) break;

        const newRotationPlayers = [];
        newRotationPlayers.push(sellers.shift());

        while (newRotationPlayers.length < 4 && sellers.length > 0) {
            const p = sellers.shift();
            newRotationPlayers.push(p);
        }

        while (newRotationPlayers.length < 4 && helpers.length > 0) {
            const p = helpers.shift();
            newRotationPlayers.push(p);
        }
        
        waitingList = waitingList.filter(p => !newRotationPlayers.includes(p));
        
        rotations.push({
            players: newRotationPlayers,
            total: newRotationPlayers.reduce((sum, p) => sum + (p.businesses || 0), 0)
        });
    }

    renderRotations(rotations, waitingList, players.filter(p => p.isNonHelper));
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

createRotationsBtn.addEventListener("click", () => {
    createRotations();
    rotationsInitialized = true;
    createRotationsBtn.disabled = true;
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

renderPlayers();
renderRotations([], [], []);