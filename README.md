# GTA Sale Rotation Manager

## Introduction
The **GTA Sale Rotation Manager** helps players organize fair and efficient sale rotations for their GTA businesses by ensuring balanced groups, proper helper allocation, and smooth management of waiting lists

This document outlines the rules, features, and guidelines for using the manager effectively.

---

## Table of Contents
1. [Definitions](#definitions)
2. [What Are Sale Rotations?](#what-are-sale-rotations)
3. [How Sale Rotations Work](#how-sale-rotations-work)
4. [Rotation Guidelines](#rotation-guidelines)
   - [Rotation Structure](#rotation-structure)
   - [Waiting List](#waiting-list)
   - [Forming Rotations](#forming-rotations)
   - [Adding New Players](#adding-new-players)
   - [Special Case: Two Groups of Three](#special-case-two-groups-of-three)
5. [Features](#features)
6. [Quick Start](#quick-start)

---

## Definitions
- **Seller:** A player with 1–6 businesses to sell.  
- **Helper:** A player with 0 businesses who assists other players in a rotation.  
- **Rotation:** A group of 3–4 players formed to sell businesses in turns.  
- **Waiting List:** A list of players who cannot currently join a valid rotation.  
- **Non-Helper**: A tagged player who cannot participate in selling or helping.
- **Small Rotation:** An optional and special rotation for players with 0–1 businesses.

---

## What Are Sale Rotations?
A **sale rotation** in GTA is when players group together to help sell each other’s businesses.

---

## How Sale Rotations Work
- Rotations consist of **3–4 players**.  
- There can be as many rotations as the player count allows.  
- Each rotation must include at least **1 seller** (**no helper-only rotations**).  
- Helpers fill empty spots to reach 3-4 players.  
- Players take turns selling **all of their businesses** before moving to the next seller. 
- New players may be **inserted into existing rotations** or placed on the **waiting list**.  
- Rotations are only shuffled when initializing rotations.
  - **Players are only shuffled with the two groups of 3 special case** to balance total businesses.

---

## Rotation Guidelines

### Rotation Structure
- **Size**: Each rotation must have **3-4 players**.
- **Seller Requirement**: At least 1 seller per rotation. Helpers can't form a rotation on their own. 
- **Helpers**: Fill empty spots (to reach 3-4 players).
- **Balance**: Initial rotations are balanced so that total businesses across groups are as even as possible. 

### Waiting List
- **Sellers** go to waiting list if:
  - Fewer than 3 sellers are available to start a new group, OR
  - They’re the extra seller when groups don’t divide evenly.
- **Helpers** go to waiting list if:
  - There’s no incomplete rotation needing them, OR
  - Adding them would exceed 4 players in the group.
- **Small Rotation Waiters**: Players with 0-1 businesses who opt out of auto-grouping. 

### Forming Rotations
- Prioritize forming **4-player groups** when possible.
- If only 3 sellers remain, they form a **3-player group**.
- If only 1–2 sellers remain, they go to the waiting list until more join.
- **Helpers** are distributed:
  - First to fill incomplete rotations (to reach 3 or 4).
  - Then held in waiting list if not needed.
- No reshuffling after initialization.

### Adding New Players
- **New Sellers**:
  - Preferably insert into a 3-player rotation with the fewest total businesses.
  - If all rotations already have 4 players, replace a helper (that helper moves to waiting list).
  - If no valid spot exists, form a new rotation when enough players join.
  - Otherwise, remain on waiting list.
- **New Helpers**: 
  - Fill a 3-player rotation.
  - Start a new rotation if sellers are waiting. 
  - Otherwise, remain on waiting list.

### Special Case: 2 Groups of 3
The **only time existing groups are reshuffled**.

**Trigger:**
  - Exactly **5 sellers + 1 helper** or **6 sellers** at initialization

**Action:**
  - All players are shuffled into two groups of 3, balanced by businesses.

---

## Features

### Manual Override
- Move a player between rotation and waiting list.  
- Remove a player entirely.  
- Insert waiting players directly into a rotation.

### End Rotation
- Ends all sales for a group (resets all players' businesses to 0).  
- Players are moved back to the waiting list.

### Non-Helper
- Tag players as **non-helpers** if they cannot participate.  
- Tagged players are added to the **Non-Helpers** list and are excluded from rotations.  
- Tags can be removed when the player is able to participate.

### Small Rotation Waiting
- Players with 0–1 businesses can opt into a small rotation waiting list.
- They stay in the waiting list until manually grouped.
- **Purpose:** Allows players with very few businesses to indicate they are waiting for a small rotation without being automatically grouped.  

---

## Quick Start
1. Add players to the system with their number of businesses.  
2. Initialize rotations into balanced groups of 3-4 players.  
3. Use manual override if groups need adjustment.  
4. End rotations when a sale cycle completes, moving players back to the waiting list.  
5. Optionally, tag players with 0–1 businesses as **waiting for a small rotation**.