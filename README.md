# 🕹️ RPG Portfolio World (In Progress)

An interactive **2D RPG-style portfolio website** built with **React + Pixi.js**, where users explore a town-like world and discover projects through in-game interactions.

Instead of scrolling through a traditional portfolio, visitors walk through a pixel-art world, interact with landmarks, and open project modals directly inside the game environment.

> 🚧 **This project is currently in active development.**
> Core gameplay and interaction systems are in place, and new features, polish, and content are being added continuously.

---

## 🌍 Live Demo
👉 https://siyeonkrase.github.io/rpg-portfolio/#/

---

## 🖥 Platform Notes

This project is currently designed for **desktop / PC environments only**.

- Keyboard input (WASD / Arrow keys) is required.
- The experience is not optimized for mobile or touch devices.

---

## 🎮 Key Features

- **Top-down 2D RPG world** rendered with Pixi.js
- **Keyboard-based movement & camera tracking**
- **Collision system** using foot-based AABB detection
- **Interactive landmarks** (Press `E` to interact)
- **Project modals** launched from in-world objects
- **Inventory-style HUD** that fills as projects are viewed
- **Depth sorting** for proper sprite layering
- **Pixel-perfect rendering** with integer scaling
- **Sound effects & visual feedback** for interactions

---

## 🧱 Current Interactive Locations

- 🎬 Cinema – Project showcase
- 🏦 Bank – Finance / crypto project
- 💻 Computer – Web app project
- 🪧 Community Board – Bento-style project hub
- 💒 Church – Wedding invitation website

Each interaction unlocks an icon in the inventory HUD, reinforcing progression and exploration.

---

## 🛠️ Tech Stack

- **React.js**
- **TypeScript**
- **Pixi.js**
- **Jotai** (state management)
- **styled-components**

---

## 🗺️ Architecture Highlights

- Custom **rendering layer system** (ground / actors / building details / player / overlay)
- Global **collision world** shared between rendering and input systems
- Decoupled **interaction system** with probe-based AABB detection
- Keyboard logic abstracted via `useGameKeyboard`
- Modal state handled centrally to avoid inconsistent UI transitions

---

## 🎨 Assets & Credits

This project uses third-party assets provided by the following creators and platforms. All assets are used for non-commercial, portfolio purposes.

### Fonts & Tile Sets
- **Kenney.nl**
  https://kenney.nl/  
  Fonts and pixel-art tile sets used throughout the game world.

### Character Sprites
- **Mini Villagers Pack by Lyaseek**
  https://lyaseek.itch.io/minifvillagers  
  Player character sprites.

### Sound Effects
- **Pixabay (User: joentnt)**
  https://pixabay.com/users/joentnt-47713256/  
  Footstep and interaction sound effects.

All rights remain with their respective creators.

Thanks for exploring! More updates coming soon 👀✨
