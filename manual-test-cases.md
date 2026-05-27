# CampusKart — Manual Test Cases
**Tester:** Snair Hridya  
**Date:** 27-May-2026  
**App:** CampusKart (localhost:3000)

---

| # | Feature | Steps | Expected Result | Actual Result | Pass/Fail |
|---|---------|-------|----------------|---------------|-----------|
| 1 | Home Page Load | Open localhost:3000 | Hero banner, categories, and product grid display correctly | Page loads with all sections visible | Pass |
| 2 | Hero Search Bar | Type "MacBook" in search bar and click Search | Products matching "MacBook" are shown | MacBook Pro listing appears | Pass |
| 3 | Category Filter | Click "Electronics" category button | Only electronics products are displayed | Only electronics items shown | Pass |
| 4 | Category Filter Reset | Click "All" category after filtering | All products appear again | All 8 products displayed | Pass |
| 5 | Dark Mode Toggle | Click the dark mode icon in the top navbar | Page switches to dark theme | Background turns dark | Pass |
| 6 | Product Card Navigation | Click on any product card | Navigates to the product detail page | Product detail page opens | Pass |
| 7 | Product Detail Page | Click on MacBook Pro product | Shows image, title, price, description, seller info | All details displayed correctly | Pass |
| 8 | Faculty Verified Badge | Open a faculty verified product | "Faculty Verified" badge is visible on product | Badge shown in green | Pass |
| 9 | Add to Cart from Home | Click "Add" button on any product card | Product is added to cart, toast notification shown | Toast appears, cart count updates | Pass |
| 10 | Cart Page Load | Click cart icon in navbar | Cart page loads with added items | Items visible in cart | Pass |
| 11 | Cart Quantity Update | On cart page, click + button on an item | Item quantity increases by 1, total updates | Quantity and total updated | Pass |
| 12 | Cart Item Remove | Click remove/delete button on cart item | Item is removed from cart | Item disappears from cart | Pass |
| 13 | Checkout Navigation | Click "Proceed to Checkout" in cart | Navigates to checkout page | Checkout page loads | Pass |
| 14 | Checkout Form Validation | Click "Place Order" without filling form | Error messages shown for empty fields | Validation errors appear | Pass |
| 15 | Order Confirmation | Complete checkout form and submit | Order confirmation page shown with order ID | Confirmation page with order ID shown | Pass |
| 16 | Orders History Page | Navigate to /orders | List of past orders shown with status badges | Orders displayed with Completed/Pending/Cancelled status | Pass |
| 17 | Order Status Filter | Click "Completed" tab on orders page | Only completed orders are shown | Filtered to completed orders | Pass |
| 18 | Order Detail Page | Click "View Details" on an order | Full order details page opens | Order detail page with items shown | Pass |
| 19 | Login Page Load | Navigate to /login | Login form with email and password fields shown | Login form displays correctly | Pass |
| 20 | Login Validation | Submit login form with empty fields | Error message shown | Validation error appears | Pass |
| 21 | Profile Page Load | Navigate to /profile | User name, stats, and menu sections displayed | Profile page loads with all sections | Pass |
| 22 | Saved Items Page | Navigate to /saved | Saved items grid displayed | 3 saved items shown with images | Pass |
| 23 | Remove Saved Item | Click heart icon on a saved item | Item is removed from saved list | Item disappears from saved list | Pass |
| 24 | Support Page | Navigate to /support | Help Center, Safety Tips, About tabs shown | All 3 tabs visible and working | Pass |
| 25 | FAQ Accordion | Click a FAQ question on support page | Answer expands below the question | FAQ answer revealed | Pass |
| 26 | Account Settings | Navigate to /account | Edit Profile, Password, Notifications sections shown | All sections displayed correctly | Pass |
| 27 | Notification Toggle | Toggle a notification switch on account page | Switch state changes between on/off | Toggle animates and state changes | Pass |
| 28 | Search Page | Navigate to /search | Search bar and product grid displayed | Search page loads correctly | Pass |
| 29 | Sell Page | Navigate to /sell | Listing form with all required fields shown | Form displays with title, price, category fields | Pass |
| 30 | Mobile Bottom Nav | View site on mobile screen size | Bottom navigation bar visible with 4 icons | Market, Sell, Cart, Profile icons shown | Pass |
