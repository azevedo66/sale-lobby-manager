# GTA Sale Rotation Manager

## Introduction
The **GTA Sale Rotation Manager** is a tool designed to help players organize fair and efficient sale rotations for their GTA businesses. It ensures balanced rotations, proper helper allocation, and smooth management of waiting lists.  

This document outlines the rules, features, and guidelines for using the manager effectively.

---

## Table of Contents
1. [Definitions](#definitions)
2. [What Are Sale Rotations?](#what-are-sale-rotations)
3. [How Sale Rotations Work](#how-sale-rotations-work)
4. [Rotation Guidelines](#rotation-guidelines)
   - [Group Size](#group-size)
   - [Waiting List](#waiting-list)
   - [Forming Rotations](#forming-rotations)
   - [Adding New Players](#adding-new-players)
   - [Special Case: Two Groups of Three](#special-case-two-groups-of-three)
5. [Features](#features)
   - [Manual Override](#manual-override)
   - [End Rotation](#end-rotation)
   - [Non-Helper](#non-helper)
   - [Small Rotation Waiting](#small-rotation-waiting)
6. [Quick Start](#quick-start)

---

## Definitions
- **Seller:** A player with 1–6 businesses to sell.  
- **Helper:** A player with 0 businesses who assists other players in a rotation.  
- **Rotation:** A group of 3–4 players formed to sell businesses in turns.  
- **Waiting List:** A list of players who cannot currently join a valid rotation.  
- **Small Rotation:** An optional and special rotation for players with 0–1 businesses.

---

## What Are Sale Rotations?
A **sale rotation** in GTA is when players group together to help sell each other’s businesses.

---

## How Sale Rotations Work
- Rotations consist of **3–4 players**.  
- There can be as many rotations as the player count allows.  
- Each rotation must include at least **1 seller** with 1–6 businesses (**no helper-only rotations**).  
- Helpers fill out rotations to assist sellers.  
- New players can be **inserted into existing rotations** or placed on a **waiting list**.  
- Players take turns selling **all of their businesses** before moving to the next seller.  
- **Players are only shuffled when rotations are first formed** to balance total businesses. Afterwards, rotations remain intact unless new players join or manual overrides occur.

---

## Rotation Guidelines

### Group Size
- 3–4 players per rotation.  
- At least 1 seller is required (**no helper-only rotations**).

### Waiting List
- **Sellers:** added if there aren’t enough players to form a valid rotation.  
- **Helpers:** added if not needed to fill a rotation.

### Forming Rotations
- Sellers are prioritized over helpers.  
- Helpers are added to:  
  - Complete a 4-player rotation.  
  - Start a new rotation when sellers are waiting.  
- Each rotation should have a **similar total number of businesses**.  
- **Mixing players only happens at initialization** to balance businesses.

### Adding New Players
- Keep original groups intact whenever possible.  
- **New sellers** are prioritized in this order:  
  1. Insert into a 3-player rotation with the fewest businesses (break ties by rotation order).  
  2. Replace a helper in a 4-player rotation with the fewest businesses (break ties for helpers by time spent helping).  
  3. Form a new rotation if enough players are available.  
  4. Otherwise, add to the waiting list.  
- **New helpers** are only added if needed:  
  - Fill a 3-player rotation.  
  - Start a new rotation if sellers are waiting.  
  - Otherwise, go to the waiting list.

### Special Case: Two Groups of Three
- Groups are only shuffled in this scenario.  
- Triggered when:  
  - There are **5 initial sellers with 1 helper**, or  
  - A **5th seller joins after a group of 4 sellers is formed**.  
- When triggered:  
  - All players reshuffle into **two rotations of three players**.  
  - Total businesses are balanced across the two groups.  
- **Example:** If 5 sellers and 1 helper exist, players are reshuffled into two rotations of 3, ensuring each rotation has roughly the same number of businesses.

---

## Features

### Manual Override
- Move a player between rotation and waiting list.  
- Remove a player entirely.  
- Insert waiting players directly into a rotation.  
- **Use Case:** Adjust rotations manually to fix imbalances or efficiently add new players.

### End Rotation
- Ends all sales for a group (resets all players' businesses to 0).  
- Players are moved back to the waiting list.

### Non-Helper
- Tag players as **non-helpers** if they are unable to sell or assist in selling.  
- Tagged players are added to the **Non-Helpers** list.  
- Tags can be removed when the player is able to participate.

### Small Rotation Waiting
- **Purpose:** Allows players with very few businesses to indicate they are waiting for a small rotation without being automatically grouped.  
- **How It Works:**  
  - Players with 0–1 businesses can be tagged as **waiting for a small rotation**.  
  - Tagged players remain in the waiting list until they are manually added to a normal rotation.  
- **Rules:**  
  - Players stay in the waiting list until manually moved.  
  - No automatic business balancing is performed for small rotation tags.  
- **Manual Override:**  
  - Move tagged players into a normal rotation.  
  - Remove the small rotation tag once added to a rotation.

---

## Quick Start
1. Add players to the system with their number of businesses.  
2. Initialize rotations—players are automatically balanced by business count.  
3. Use manual override if rotations are unbalanced or new players join.  
4. End rotations when a sale cycle completes, moving players back to the waiting list.  
5. Optionally, tag players with 0–1 businesses as **waiting for a small rotation**.