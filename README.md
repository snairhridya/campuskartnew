# CampusKart — University Campus Marketplace

A peer-to-peer marketplace built exclusively for college students and faculty. Buy and sell textbooks, electronics, dorm essentials, bikes, and more — safely, on campus.

**Live URL:** https://campuskartnew.vercel.app

---

## Features

### Marketplace
- Browse products by category: Textbooks, Electronics, Dorm Essentials, Bikes & Transport, Clothing
- Search listings from the hero banner (redirects to `/search`)
- Faculty Verified badge on trusted listings
- Dark mode toggle
- Recently Added horizontal scroll section

### Product Cards
- Add to Cart button transforms into `− qty +` quantity controller once added
- Wishlist (save/unsave) from the card directly
- Edit button for your own listings

### Product Detail Page (`/product/[id]`)
- Full product info fetched from Supabase (cross-device sync)
- Buy Now and Add to Cart inline below price
- Edit listing (for own listings only)

### Cart
- Persisted in `localStorage` (`campuskart_cart`)
- Quantity controls, remove item, subtotal
- Proceed to Checkout

### Checkout & Orders
- Place order → saved to Supabase `orders` table
- Order ID stored in `localStorage` (`campuskart_my_orders`)
- Order confirmation page (`/order-confirmation`)
- Order History (`/orders`) — lists all your orders with individual item images and ₹ prices
- Order Tracking (`/order/[id]`) — status timeline: Order Placed → Seller Notified → Campus Pickup Done → Completed

### Authentication (Supabase Auth)
- Login / Sign Up at `/login`
- Per-user data isolation: cart, wishlist, orders, listings cleared when a different user logs in
- Redirect to login if profile accessed while logged out

### Profile (`/profile`)
- Avatar, name, email, campus pulled from Supabase user metadata
- Member since (real account creation year)
- Menu: Order History, My Listings, Saved Items, Edit Profile, Notifications, Payment Methods, Verification
- Support: Help Center, Safety Tips, About CampusKart (each a separate page)
- Logout with double-tap confirmation

### My Listings (`/sell`)
- Shows real listings published from this device (localStorage)
- Filter by All / Active / Sold / Draft
- New Listing modal

### Saved Items (`/saved`)
- Wishlist persisted in `localStorage` (`campuskart_wishlist`)

### Account Pages
- `/account` — Edit Profile, Change Password, Danger Zone
- `/account/notifications` — notification preferences
- `/account/payment` — UPI ID, card details
- `/account/verification` — email status, student ID, campus, faculty badge

### Support Pages
- `/support/help` — FAQ + Contact form
- `/support/safety` — Safety tips + emergency info
- `/support/about` — About CampusKart + legal links

### Legal (`/legal`)
- Privacy Policy
- Terms of Service

### Admin Dashboard (`/admin`)
- Login with `admin1234@gmail.com` / `000000`
- Stats: Total Orders, Revenue, Pending Pickup, Completed
- Orders table: all orders with ID, date, items, total, status
- Users tab: users derived from order activity
- Protected route — non-admins redirected to login
- Admin email blocked from regular signup

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS (Material Design 3 tokens) |
| Backend / DB | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Deployment | Vercel |
| Image Crop | react-easy-crop |

---

## Database Tables (Supabase)

| Table | Description |
|-------|-------------|
| `products` | All marketplace listings |
| `orders` | Placed orders with items, total, status |
| `cart_items` | (Reserved) |

RLS is disabled on `products`, `orders`, and `cart_items` for open access.

---

## Local Storage Keys

| Key | Purpose |
|-----|---------|
| `campuskart_cart` | Cart items |
| `campuskart_wishlist` | Saved/wishlisted items |
| `campuskart_my_orders` | Order IDs placed by this user |
| `campuskart_listings` | Listings published from this device |
| `campuskart_product_edits` | Local edits to product photos/prices |
| `campuskart_current_user` | Logged-in user ID (for session isolation) |
| `campuskart_admin` | Admin session flag |

---

## Project Structure

```
app/
  page.tsx                  # Home — product grid, categories, search
  login/page.tsx            # Login & Sign Up
  product/[id]/page.tsx     # Product detail & order flow
  cart/page.tsx             # Shopping cart
  checkout/page.tsx         # Checkout
  order-confirmation/       # Order confirmed screen
  orders/page.tsx           # Order history
  order/[id]/page.tsx       # Order tracking
  profile/page.tsx          # User profile
  sell/page.tsx             # My listings
  saved/page.tsx            # Wishlist
  search/page.tsx           # Search results
  account/
    page.tsx                # Edit profile
    notifications/page.tsx
    payment/page.tsx
    verification/page.tsx
  support/
    help/page.tsx
    safety/page.tsx
    about/page.tsx
  legal/page.tsx
  admin/page.tsx            # Admin dashboard
lib/
  supabase.ts               # Supabase client
  auth-context.tsx          # Auth provider & user session isolation
```

---

## Getting Started (Local Development)

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Create a `.env.local` file with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## Deployment

Deployed on **Vercel** with automatic deploys from the `main` branch on GitHub.

Every `git push origin main` triggers a new Vercel deployment automatically.

---

## Admin Access

| Field | Value |
|-------|-------|
| URL | https://campuskartnew.vercel.app/admin |
| Email | admin1234@gmail.com |
| Password | 000000 |

---

&copy; 2025 CampusKart. Academic Integrity & Safety First.
