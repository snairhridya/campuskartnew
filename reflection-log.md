# CampusKart — Reflection Log
**Student:** Snair Hridya  
**Date:** 27-May-2026  
**Project:** CampusKart — AI-First eCommerce App

---

## 1. What prompt did you use?

For unit tests, I used GitHub Copilot with the prompt:
> "Write unit tests for my CampusKart Next.js app pages"

For integration tests, I used Claude with the prompt:
> "Write integration tests for my cart API endpoint using Jest and supertest"

For building the app pages (Phase 04), I used Claude with prompts like:
> "Build a shopping cart with add/remove items, quantity update, and subtotal calculation"
> "Build an order confirmation page and order history list"
> "Build a product listing page with category filter, search, and sort"

---

## 2. What did the AI output?

**GitHub Copilot (Unit Tests):**
- Automatically set up Vitest testing framework
- Created test files for cart page, product detail page, and login page
- Generated 11 unit tests covering rendering, user interactions, and navigation
- Updated package.json with test scripts and dependencies

**Claude (Integration Tests):**
- Created a cart API route (GET, POST, DELETE methods)
- Wrote 7 integration tests covering happy paths and error cases
- Tests validated adding items, removing items, price calculation, and error handling

**Claude (App Development):**
- Built all 6 required screens: Home, Product Listing, Product Detail, Cart & Checkout, Order Tracking, and User Profile/Login
- Used Material Design 3 styling with Tailwind CSS
- Implemented features like dark mode, faculty verified badges, toast notifications, and mobile bottom navigation

---

## 3. Did you change it? Why?

- **Unit Tests:** Copilot initially had 1 failing test because the button label did not match exactly. Copilot automatically detected and fixed this by adjusting the test expectation — no manual change was needed.

- **Integration Tests:** The app was frontend-only with no API routes, so Claude first created the cart API route and then wrote the integration tests for it. This required an extra step that the guide did not explicitly mention.

- **App Pages:** Some pages required small adjustments to match the CampusKart campus marketplace theme — for example, changing generic product names to campus-specific items like textbooks, bikes, and dorm essentials.

---

## 4. What did you learn from this interaction?

- **AI speeds up development significantly** — building all 6 screens manually would have taken weeks, but with Claude it was done much faster.
- **GitHub Copilot is great for test generation** — it understood the existing code and wrote relevant tests without needing detailed instructions.
- **Prompts need to be specific** — vague prompts like "build an app" give generic results. Specific prompts like "build a shopping cart with add/remove items and subtotal calculation" give much better output.
- **AI tools work best together** — using Claude for building and Copilot for testing was more effective than using just one tool.
- **Always review AI output** — the AI sometimes makes assumptions about button labels or component structure that need to be verified against the actual code.

---

## 5. Where did the AI fail or confuse you?

- **Copilot needed sign-in first** — Copilot showed errors until GitHub authentication was completed, which was confusing at first.
- **Integration tests challenge** — The guide said to write integration tests for an API endpoint, but the app was frontend-only. Claude had to create the API route first before writing the tests, which was an extra step not covered in the guide.
- **Test count** — Copilot initially only generated 5 tests, which was below the required 10. A second prompt was needed to generate more tests to meet the minimum requirement.
- **Deprecation warnings** — When running tests, several deprecation warnings appeared (esbuild, rollupOptions). These were confusing at first but turned out to be harmless warnings that did not affect the test results.
