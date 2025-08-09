# El Pollo Loco – 2D Browser Game

A lightweight 2D side-scrolling jump’n’run game for the browser – built with **Vanilla JavaScript**, **HTML5 Canvas**, and object-oriented design. Collect coins & bottles, dodge enemies, throw bottles at the final boss, and save the day 🐔💥

![Status Badge](https://img.shields.io/badge/status-active-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue)

## Table of Contents
- [Features](#features)
- [Controls](#controls)
- [Quick Start](#quick-start)
- [Using a Node Mini Server](#using-a-node-mini-server)
- [Folder Structure](#folder-structure)
- [Tech Stack](#tech-stack)
- [Build/Deployment](#builddeployment)
- [Screenshots](#screenshots)
- [Roadmap](#roadmap)
- [Author & License](#author--license)

---

## Features
- 🎮 **Smooth Platforming**: Running, jumping, falling, collision detection
- 🧠 **OOP Structure**: Separate classes for characters, enemies, items, and the world
- 🪙 **Collectibles**: Coins & bottles with inventory/progress tracking
- 🧪 **Throw Mechanic**: Throw bottles at enemies and the boss
- 🔊 **Sound Effects & Music** (mute toggle)
- 📱 **Responsive Canvas** (scales up to fullscreen)
- ⚡ **No frameworks** – pure JavaScript + Canvas

## Controls
| Action | Key |
|---|---|
| Move left/right | **← / →** or **A / D** |
| Jump | **Spacebar** |
| Throw bottle | **F** or **E** |
| Toggle sound (if available) | **M** |

> Tip: On mobile devices, on-screen buttons are usually displayed.

## Quick Start
No build process needed – it’s a pure frontend app.

```bash
# 1) Clone the repository
git clone https://github.com/AbbasEl11/El-Pollo-Loco.git
cd El-Pollo-Loco

# 2) Start (simply open index.html in your browser)
#   - double-click index.html
#   - or use the VS Code "Live Server" extension
```

## Using a Node Mini Server
If your browser blocks local file access (audio/CORS), start a small server:

```bash
# Option A: http-server (recommended)
npm i -g http-server
http-server . -p 8080
# -> open http://localhost:8080

# Option B: Python (if installed)
# Python 3
python -m http.server 8080
# Python 2
python -m SimpleHTTPServer 8080
```

## Folder Structure
> Structure may vary slightly – adjust names if needed.

```
El-Pollo-Loco/
├─ index.html
├─ css/
│  └─ style.css
├─ js/
│  ├─ game.js           # Entry point / world setup
│  ├─ classes/          # OOP classes (Character, Chicken, Endboss, ...)
│  ├─ helpers/          # Utils (collision, keyboard, loader, ...)
│  └─ assets.js         # Asset preload/paths
├─ assets/
│  ├─ img/              # Sprites, backgrounds
│  └─ audio/            # Sound effects, music
└─ README.md
```

## Tech Stack
- **JavaScript (ES6+)**
- **HTML5 Canvas**
- **CSS3**
- Optional: small **Node/static server** for local development

## Build/Deployment
- **GitHub Pages** (recommended):  
  1. Go to your repository settings → **Pages**  
  2. Select branch `main` + `/ (root)`  
  3. Wait for the provided URL to be active (cache ~1–2 min)
- Alternatively: any static hosting service (Netlify, Vercel, Surge, …)

## Screenshots
> Add some images/GIFs – this makes the README more appealing.

```html
<!-- Example -->
<p align="center">
  <img src="assets/img/screenshot-1.png" width="700" alt="Gameplay Screenshot">
</p>
```

## Roadmap
- [ ] Pause menu / settings
- [ ] Improve touch controls
- [ ] Save highscore/progress (LocalStorage)
- [ ] Accessibility (color/audio cues)

## License
```bash
MIT License

Copyright (c) 2025 Abbas El Mahmoud

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Author
Developed by [AbbasEl11](https://https://github.com/AbbasEl11)



