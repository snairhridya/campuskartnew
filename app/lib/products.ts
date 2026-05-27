export interface Review {
  initials: string;
  name: string;
  role: string;
  rating: number;
  text: string;
}

export interface Product {
  id: number;
  title: string;
  category: string;
  price: number;
  originalPrice: number;
  condition: string;
  description: string;
  image: string;
  isFacultyVerified: boolean;
  timeAdded: string;
  seller: string;
  rating: number;
  reviewCount: number;
  specs: Record<string, string>;
  reviews: Review[];
}

export const PRODUCTS: Product[] = [
  {
    id: 1,
    title: "MacBook Pro (2022) - M2 Chip",
    category: "Electronics",
    price: 899.00,
    originalPrice: 1299.00,
    condition: "Mint",
    description: "Perfect for CS students or creators. Barely used, includes original charger and sleeve. Battery health 98%. Safe meetup available near library.",
    image: "/images/macbook.jpg",
    isFacultyVerified: true,
    timeAdded: "2h ago",
    seller: "Prof. Sarah Miller (CS)",
    rating: 4.9,
    reviewCount: 12,
    specs: { Brand: "Apple", Model: "MacBook Pro M2", RAM: "8GB", Storage: "256GB SSD", Condition: "Mint" },
    reviews: [
      { initials: "JD", name: "Jordan D.", role: "Senior", rating: 5, text: "Laptop was exactly as described. Battery life is amazing. Met at the library, smooth transaction!" },
      { initials: "AS", name: "Alex S.", role: "Junior", rating: 5, text: "Saved hundreds over buying new. Prof Miller was super responsive and professional." },
    ],
  },
  {
    id: 2,
    title: "Calculus: Early Transcendentals",
    category: "Textbooks",
    price: 45.00,
    originalPrice: 120.00,
    condition: "Good",
    description: "Calculus textbook for engineering math sequences. No writing on pages, slightly worn corners but overall good shape.",
    image: "/images/textbook.jpg",
    isFacultyVerified: false,
    timeAdded: "4h ago",
    seller: "James Chen (Undergrad)",
    rating: 4.5,
    reviewCount: 8,
    specs: { ISBN: "978-1285741550", Author: "James Stewart", Pages: "1368", Condition: "Good" },
    reviews: [
      { initials: "MK", name: "Maya K.", role: "Sophomore", rating: 5, text: "Book was in great shape. No missing pages, corners slightly worn but totally usable." },
      { initials: "RS", name: "Ryan S.", role: "Freshman", rating: 4, text: "Fast meetup near the Engineering Quad. Saved so much vs the bookstore." },
    ],
  },
  {
    id: 3,
    title: "Trek Marlin 5 Mountain Bike",
    category: "Bikes & Transport",
    price: 320.00,
    originalPrice: 550.00,
    condition: "Excellent",
    description: "Rugged mountain bike, excellent for commuting on and off campus. Hand brakes and gears work perfectly.",
    image: "/images/bike.jpg",
    isFacultyVerified: true,
    timeAdded: "6h ago",
    seller: "Dr. Alan Turing (Math)",
    rating: 4.8,
    reviewCount: 6,
    specs: { Brand: "Trek", Model: "Marlin 5", Frame: "Aluminum", Speeds: "21-speed", Condition: "Excellent" },
    reviews: [
      { initials: "PT", name: "Priya T.", role: "Graduate", rating: 5, text: "Bike is in amazing shape. Gears shift perfectly, brakes are tight. Great deal!" },
      { initials: "BL", name: "Ben L.", role: "Junior", rating: 5, text: "Exactly what I needed for campus commuting. Dr. Turing was very helpful." },
    ],
  },
  {
    id: 4,
    title: "iPad Air + Apple Pencil",
    category: "Electronics",
    price: 380.00,
    originalPrice: 699.00,
    condition: "Excellent",
    description: "Minimalist iPad Air with Apple Pencil included. Great for digital note taking, sketches, and lightweight studying. Battery life is fantastic.",
    image: "/images/ipad.jpg",
    isFacultyVerified: false,
    timeAdded: "8h ago",
    seller: "Emily Watson (Design)",
    rating: 4.7,
    reviewCount: 10,
    specs: { Brand: "Apple", Model: "iPad Air 5th Gen", Storage: "64GB", Includes: "Apple Pencil 2", Condition: "Excellent" },
    reviews: [
      { initials: "CJ", name: "Chris J.", role: "Sophomore", rating: 5, text: "iPad and Pencil both work flawlessly. Great for taking notes in class!" },
      { initials: "ND", name: "Nina D.", role: "Junior", rating: 4, text: "Minor scuff on the case but iPad itself is perfect. Good price." },
    ],
  },
  {
    id: 5,
    title: "Ergonomic Desk Chair",
    category: "Dorm Essentials",
    price: 120.00,
    originalPrice: 250.00,
    condition: "Excellent",
    description: "Comfortable and highly functional desk chair. Ideal for long study sessions in your dorm room or campus apartment.",
    image: "/images/chair.jpg",
    isFacultyVerified: false,
    timeAdded: "12h ago",
    seller: "Marcus Brody (Undergrad)",
    rating: 4.6,
    reviewCount: 5,
    specs: { Type: "Ergonomic Chair", Adjustable: "Height & Armrests", Material: "Mesh Back", Weight: "12kg", Condition: "Excellent" },
    reviews: [
      { initials: "SL", name: "Sara L.", role: "Freshman", rating: 5, text: "So comfortable for long study nights. Way better than the dorm chairs!" },
      { initials: "TM", name: "Tom M.", role: "Senior", rating: 4, text: "Easy to assemble, very sturdy. Marcus helped me carry it to my room." },
    ],
  },
  {
    id: 6,
    title: "Sony WH-1000XM4 Headphones",
    category: "Electronics",
    price: 210.00,
    originalPrice: 350.00,
    condition: "Excellent",
    description: "Superb noise-canceling headphones. Perfect for studying in noisy libraries or relaxing during study breaks. Includes original carrying case.",
    image: "/images/headphones.jpg",
    isFacultyVerified: true,
    timeAdded: "1d ago",
    seller: "Prof. Charles Xavier",
    rating: 5.0,
    reviewCount: 18,
    specs: { Brand: "Sony", Model: "WH-1000XM4", Battery: "30 hrs", Connectivity: "Bluetooth 5.0", Condition: "Excellent" },
    reviews: [
      { initials: "AK", name: "Aisha K.", role: "Graduate", rating: 5, text: "Best headphones I have ever owned. ANC is incredible for library studying." },
      { initials: "DH", name: "David H.", role: "Senior", rating: 5, text: "Came with original box and case. Like brand new. Highly recommend!" },
    ],
  },
  {
    id: 7,
    title: "Designer Desk Lamp",
    category: "Dorm Essentials",
    price: 35.00,
    originalPrice: 75.00,
    condition: "Good",
    description: "A minimalist wooden desk lamp. Provides soft, warm lighting. Excellent addition to dorm desks for late night studying.",
    image: "/images/lamp.jpg",
    isFacultyVerified: false,
    timeAdded: "1d ago",
    seller: "Jane Doe (Sophomore)",
    rating: 4.3,
    reviewCount: 4,
    specs: { Style: "Minimalist Wood", Bulb: "LED Compatible", Height: "40cm", Cable: "1.5m USB", Condition: "Good" },
    reviews: [
      { initials: "KP", name: "Kim P.", role: "Freshman", rating: 4, text: "Looks great on my desk. Warm light is easy on the eyes for late nights." },
      { initials: "OM", name: "Omar M.", role: "Sophomore", rating: 5, text: "Very aesthetic. Exactly what Jane described. Quick pickup near South dorms." },
    ],
  },
  {
    id: 8,
    title: "White Canvas Sneakers",
    category: "Clothing",
    price: 25.00,
    originalPrice: 60.00,
    condition: "Mint",
    description: "Brand new, never worn outside. Sleek and clean canvas sneakers, perfect casual campus footwear. Size 9.5.",
    image: "/images/sneakers.jpg",
    isFacultyVerified: false,
    timeAdded: "2d ago",
    seller: "Toby Maguire (Senior)",
    rating: 4.4,
    reviewCount: 3,
    specs: { Brand: "Canvas Co.", Size: "9.5 US", Color: "White", Material: "Canvas", Condition: "Mint / Unworn" },
    reviews: [
      { initials: "LN", name: "Lily N.", role: "Freshman", rating: 5, text: "Literally brand new. Tags still on. Amazing deal for the price!" },
      { initials: "JW", name: "Jake W.", role: "Junior", rating: 4, text: "Great condition, fit true to size. Fast meetup at the Student Union." },
    ],
  },
];
