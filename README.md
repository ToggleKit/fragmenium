# Fragmenium – Fragment Executor Engine (FEE)
[![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://proposejs.pages.dev/p/licence.html) ![NPM Version](https://img.shields.io/npm/v/fragmenium)

Fragmenium is a **Fragment Executor Engine** that enables rapid development of maintainable **Single Page Applications (SPA)** using pure **HTML**, **CSS**, and **JavaScript**.  
It is ultra‑lightweight (~10kb), SEO‑friendly, and requires no server‑side execution or build process.

---

## 🌐 Live Site
👉 [https://fragmenium.pages.dev](https://fragmenium.pages.dev)

---
You can install Fragmenium via npm:
```bash
npm i fragmenium
```
Download Fragmenium engine 
[Download](https://raw.githubusercontent.com/ToggleKit/fragmenium/main/mini.engine.js)
## ✨ Features
- No server‑side execution  
- Valid URL & SEO friendly  
- No new syntax required  
- SPA‑like navigation experience  
- High maintainability  
- Compatible with existing frameworks/libraries  
- No build step required  
- Easy to use  
- Ultra lightweight (~10kb)  
- Efficient & high performance  
- Reusable fragments  
- Pure JavaScript cleanup  

---

## 📖 Fragment Types
Fragmenium organizes code into **fragments**, each with a specific role:

- **Constant** → executed once when the page loads  
- **Common** → executed when visiting pages within a directory  
- **Unique** → HTML‑specific, executed on every navigation  
- **Specific** → CSS/JS‑specific, for particular pages  
- **Every** → JS‑specific, executes on every navigation  
- **Swap** → HTML‑specific, reusable with parameters  

Fragments are fully **cleanable** — JavaScript and other resources can be removed when no longer needed.

---

## 🏗️ Architecture
Fragmenium balances **dynamic fragments** (Constant, Common, Swap) with **static fragments** (Unique, Specific).  
This hybrid approach delivers **SPA responsiveness** while preserving **SEO visibility**.

---

## ⚖️ Comparison
| Feature                | Fragmenium | React / Vue |
|------------------------|------------|-------------|
| Server‑side Execution  | None       | Often SSR   |
| SEO & URLs             | SEO‑friendly | Needs SSR/config |
| Syntax                 | Pure HTML/CSS/JS | JSX (React), Templates (Vue) |
| SPA Experience         | Built‑in   | Routing libraries |
| Maintainability        | Simple cleanup | Hooks/Directives |
| Module Cleanup         | Full iframe cleanup | Manual cleanup |
| Build Process          | None       | Bundlers required |
| Size                   | ~10kb      | 80–100kb+ |
| Performance            | Direct fragment execution | Virtual DOM diffing |
| Reusability            | Dynamic fragments | Components |
| Cleanup                | Pure JS cleanup | Lifecycle unmount |

---

## 📌 Use Cases
Fragmenium is ideal for:
- **Small projects** → quick setup, no build step  
- **Large projects** → scalable with reusable fragments  
- **SEO‑friendly sites** → static fragments ensure visibility  
- **Cost saving** → no server execution, runs in browser  
- **Plugin compatibility** → works with existing JS libraries  
- **Rapid prototyping** → lightweight and syntax‑free  

### Limitations
- Web‑only (no native app support)  
- Smaller community compared to React/Vue  

---

## 🚀 Getting Started
- [Get Started Guide](https://fragmenium.pages.dev/fragments/html/pages/get_started.html)  
- [About](https://fragmenium.pages.dev/fragments/html/pages/about.html)  

---

## 📜 License
MIT License
