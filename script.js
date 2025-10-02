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

    rotations = [];
    waitingList = [];

    while (sellers.length >= 4) {
        const group = sellers.splice(0, 4);
        const rot = { players: group, total: 0 };
        rot.total = group.reduce((sum, p) => sum + (p?.businesses || 0), 0);
        rotations.push(rot);
    }

    while (sellers.length >= 3) {
        const group = sellers.splice(0, 3);
        const rot = { players: group, total: 0 };
        rot.total = group.reduce((sum, p) => sum + (p?.businesses || 0), 0);
        rotations.push(rot);
    }

    if (sellers.length > 0 && sellers.length < 3) {
        waitingList.push(...sellers);
        sellers.length = 0;
    }

    helpers.forEach(helper => {
        const target = rotations.find(r => r.players.length < 4);
        if (target) {
            target.players.push(helper);
            target.total = target.players.reduce((sum, p) => sum + (p?.businesses || 0), 0);
        } else {
            waitingList.push(helper); 
        }
    });

    balanceRotations(rotations);

    while (waitingSmall.length >= 3) {
        const smallRot = { players: waitingSmall.splice(0, 3), total: 0 };
        smallRot.total = smallRot.players.reduce((sum, p) => sum + (p?.businesses || 0), 0);
        rotations.push(smallRot);
    }

    if (waitingSmall.length > 0) {
        waitingList.push(...waitingSmall)
    }

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
                if (!rotations[i] || !rotations[j]) continue;

                const sellersA = rotations[i].players.filter(p => p && p.businesses > 0);
                const sellersB = rotations[j].players.filter(p => p && p.businesses > 0);

                if (sellersA.length === 0 || sellersB.length === 0) continue;

                for (let a of sellersA) {
                    for (let b of sellersB) {
                        if (!a || !b) continue;

                        const newTotalA = (rotations[i].players || []).reduce((sum, p) => sum + (p?.businesses || 0), 0) - a.businesses + b.businesses;
                        const newTotalB = (rotations[j].players || []).reduce((sum, p) => sum + (p?.businesses || 0), 0) - b.businesses + a.businesses;
                        const diffBefore = Math.abs(rotations[i].total - rotations[j].total);
                        const diffAfter = Math.abs(newTotalA - newTotalB);

                        if (diffAfter < diffBefore) {
                            const idxA = rotations[i].players.indexOf(a);
                            const idxB = rotations[j].players.indexOf(b);
                            [rotations[i].players[idxA], rotations[j].players[idxB]] = [rotations[j].players[idxB], rotations[i].players[idxA]];

                            rotations[i].total = (rotations[i].players || []).reduce((sum, p) => sum + (p?.businesses || 0), 0);
                            rotations[j].total = (rotations[j].players || []).reduce((sum, p) => sum + (p?.businesses || 0), 0);
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

renderPlayers();
renderRotations([], [], []);