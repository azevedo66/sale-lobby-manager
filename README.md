# Sale Rotation Manager

## What Are Sale Rotations?
A **sale rotation** in GTA is when players group together to help sell each other’s businesses.  

---

## How Sale Rotations Work
- Rotations are made up of **3–4 players**.  
- There can be as many sale rotations as the player count allows.  
- Each rotation has at least **1 seller** with 1–6 businesses.  
- Helpers (players with no businesses) fill out rotations to assist.  
- New players can be **inserted into existing rotations** or placed on a **waiting list**.  
- Players in a rotation take turns selling **all of their businesses** before moving on to the next seller.  

---

## Rotation Guidelines

### Group Size
- 3–4 players per rotation.  
- At least 1 seller required (**no helper-only rotations**).  

### Waiting List
- Sellers: added if there aren’t enough players to form a valid rotation.  
- Helpers: added if not needed to fill a rotation.  

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
  2. Replace a helper in a 4-player rotation with the fewest businesses (break ties by helper wait time).  
  3. Form a new rotation if enough players are available.  
  4. Otherwise, add to the waiting list.  
- **New helpers** are only added if needed:  
  - Fill a 3-player rotation.  
  - Start a new rotation if sellers are waiting.  
  - Otherwise, go to the waiting list.  

### Special Case: 2 Groups of 3
- The only time groups shuffle.  
- Triggered when:  
  - 5 sellers join initially, or  
  - A 5th seller joins after groups are made.  
- The last seller waits until another player joins, then all players reshuffle into **two groups of 3**, balancing total businesses.  

---

## Features

### Manual Override
- Move a player between rotation and waiting list.  
- Remove a player entirely.  
- Insert waiting players directly into a rotation.  

### End Rotation
- Ends all sales for that group (all players’ businesses reset to 0).  
- Players are moved back to the waiting list.  

### Small Rotation Mode (0–1 Businesses)
- **Optional mode** for players with ≤1 business.  
- Triggers when **3–4 eligible players** are available.  
- Requirements:  
  - At least 1 player must have 1 business.  
  - Players choose at the start whether to wait for a small rotation or join normal ones.  
- Rules:  
  - 3–4 players per small rotation.  
  - Multiple small rotations allowed.  
  - No business balancing between small rotations.  
- Manual override:  
  - Move tagged players into a normal rotation.  
  - Remove the small rotation tag.  

---