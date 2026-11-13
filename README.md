# ⚡ NovaStore — High-Performance Developer Hardware Store

NovaStore is an authentic, engineering-grade hardware and peripherals storefront built with the **Hallmark Console Design System** and connected to the **Aura Distributed Feature Flag Platform**.

---

## 💎 Design & Engineering Standards

- **Aesthetic:** Hallmark Console engineering design (warm graphite dark mode `#0f1115`, paper light `#f9fafb`, amber human action accents `#f59e0b`).
- **Authentic UX:** 100% genuine e-commerce experience with zero testing banners, demo badges, or debug inspector clutter.
- **1-Click Predefined Persona Login:** Instant, zero-password user switcher supporting internal staff (`@aura.dev`), enterprise directors (`@company.com`), beta cohort members, standard shoppers, and anonymous guests.
- **Sub-15ms Dynamic Reactivity:** Powered by Aura's Server-Sent Events (SSE) streaming and MurmurHash3 in-memory evaluation.

---

## 🚀 Live Feature Flags & Controls

| Feature Flag Key | Type | Description | Storefront Property |
| :--- | :--- | :--- | :--- |
| `dark-mode` | Boolean | Hallmark Theme Control | Dynamically toggles between warm graphite dark mode and paper light mode. |
| `announcement-banner` | Boolean | Global Promotional Banner | Controls the top Spring Architecture Event promotional banner. |
| `ai-copilot-beta` | Boolean | AI Shopping Assistant | Toggles the floating Nova AI shopping assistant widget and recommendation drawer. |
| `fast-checkout-v2` | Boolean | 1-Click Accelerated Purchase | Enables instant 1-click checkout on product cards and in the slide-out cart bag. |

---

## 👤 Predefined User Personas (1-Click Login)

Access the User Persona Switcher from the top-right navbar pill to test user segmentation and targeting rules:

1. **Alice Sterling** (`usr_alice` · `alice@aura.dev`) — Senior Platform Architect (matches internal `@aura.dev` company rules).
2. **Bob Chen** (`usr_bob` · `bob@company.com`) — Engineering Director (matches enterprise client `@company.com` rules).
3. **Charlie Vance** (`usr_charlie` · `charlie@gmail.com`) — Early Adopter (enrolled in the private customer beta program).
4. **Diana Prince** (`usr_diana` · `diana@startup.io`) — General Customer (evaluates against standard percentage rollouts).
5. **Guest Visitor** (`usr_guest` · Unauthenticated) — Standard anonymous visitor.

---

## 🌿 Dedicated Feature Branches

Each feature flag is maintained on its own separate branch in this repository:
- `main`: Core production storefront baseline.
- `feature/dark-mode`: Hallmark warm graphite theme system and reactive theme application.
- `feature/ai-copilot-beta`: Nova AI shopping assistant widget and recommendation engine.
- `feature/fast-checkout-v2`: 1-Click accelerated checkout on product cards and shopping bag.

---

## 🏃‍♂️ How to Run Locally

```bash
npm start
# Server runs on http://localhost:3000
```
