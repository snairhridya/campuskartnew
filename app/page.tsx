"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import Cropper, { Area } from "react-easy-crop";

// Define TypeScript interfaces for our application state
interface Product {
  id: number;
  title: string;
  category: string;
  price: number;
  condition: string;
  description: string;
  image: string;
  isFacultyVerified: boolean;
  timeAdded: string;
  seller: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

// Initial mock products database aligning with downloaded assets
const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    title: "MacBook Pro (2022) - M2 Chip",
    category: "Electronics",
    price: 899.00,
    condition: "Mint",
    description: "Perfect for CS students or creators. Barely used, includes original charger and sleeve. Battery health 98%. Safe meetup available near library.",
    image: "/images/macbook.jpg",
    isFacultyVerified: true,
    timeAdded: "2h ago",
    seller: "Prof. Sarah Miller (CS)"
  },
  {
    id: 2,
    title: "Calculus: Early Transcendentals",
    category: "Textbooks",
    price: 45.00,
    condition: "Good",
    description: "Calculus textbook for engineering math sequences. No writing on pages, slightly worn corners but overall good shape.",
    image: "/images/textbook.jpg",
    isFacultyVerified: false,
    timeAdded: "4h ago",
    seller: "James Chen (Undergrad)"
  },
  {
    id: 3,
    title: "Trek Marlin 5 Mountain Bike",
    category: "Bikes & Transport",
    price: 320.00,
    condition: "Excellent",
    description: "Rugged mountain bike, excellent for commuting on and off campus. Hand brakes and gears work perfectly.",
    image: "/images/bike.jpg",
    isFacultyVerified: true,
    timeAdded: "6h ago",
    seller: "Dr. Alan Turing (Math)"
  },
  {
    id: 4,
    title: "iPad Air + Apple Pencil",
    category: "Electronics",
    price: 380.00,
    condition: "Excellent",
    description: "Minimalist iPad Air with Apple Pencil included. Great for digital note taking, sketches, and lightweight studying. Battery life is fantastic.",
    image: "/images/ipad.jpg",
    isFacultyVerified: false,
    timeAdded: "8h ago",
    seller: "Emily Watson (Design)"
  },
  {
    id: 5,
    title: "Ergonomic Desk Chair",
    category: "Dorm Essentials",
    price: 120.00,
    condition: "Excellent",
    description: "Comfortable and highly functional desk chair. Ideal for long study sessions in your dorm room or campus apartment.",
    image: "/images/chair.jpg",
    isFacultyVerified: false,
    timeAdded: "12h ago",
    seller: "Marcus Brody (Undergrad)"
  },
  {
    id: 6,
    title: "Sony WH-1000XM4 Headphones",
    category: "Electronics",
    price: 210.00,
    condition: "Excellent",
    description: "Superb noise-canceling headphones. Perfect for studying in noisy libraries or relaxing during study breaks. Includes original carrying case.",
    image: "/images/headphones.jpg",
    isFacultyVerified: true,
    timeAdded: "1d ago",
    seller: "Prof. Charles Xavier"
  },
  {
    id: 7,
    title: "Designer Desk Lamp",
    category: "Dorm Essentials",
    price: 35.00,
    condition: "Good",
    description: "A minimalist wooden desk lamp. Provides soft, warm lighting. Excellent addition to dorm desks for late night studying.",
    image: "/images/lamp.jpg",
    isFacultyVerified: false,
    timeAdded: "1d ago",
    seller: "Jane Doe (Sophomore)"
  },
  {
    id: 8,
    title: "White Canvas Sneakers",
    category: "Clothing",
    price: 25.00,
    condition: "Mint",
    description: "Brand new, never worn outside. Sleek and clean canvas sneakers, perfect casual campus footwear. Size 9.5.",
    image: "/images/sneakers.jpg",
    isFacultyVerified: false,
    timeAdded: "2d ago",
    seller: "Toby Maguire (Senior)"
  }
];

const CATEGORIES = ["All", "Textbooks", "Electronics", "Dorm Essentials", "Bikes & Transport", "Clothing"];

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  // Application states
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeSearch, setActiveSearch] = useState<string>("");
  
  // Modals & Drawers states
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isListingModalOpen, setIsListingModalOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Cart state — load from localStorage so cart page stays in sync
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("campuskart_cart");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("campuskart_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [facultyFilter, setFacultyFilter] = useState<boolean>(false);

  // Wishlist IDs from localStorage
  const [wishlistIds, setWishlistIds] = useState<Set<number>>(() => {
    if (typeof window === "undefined") return new Set();
    try {
      const saved = localStorage.getItem("campuskart_wishlist");
      const list = saved ? JSON.parse(saved) : [];
      return new Set(list.map((i: { id: number }) => i.id));
    } catch { return new Set(); }
  });

  const handleToggleWishlist = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const saved = localStorage.getItem("campuskart_wishlist");
      const list = saved ? JSON.parse(saved) : [];
      if (wishlistIds.has(product.id)) {
        const updated = list.filter((i: { id: number }) => i.id !== product.id);
        localStorage.setItem("campuskart_wishlist", JSON.stringify(updated));
        setWishlistIds((prev) => { const s = new Set(prev); s.delete(product.id); return s; });
      } else {
        list.unshift({ id: product.id, title: product.title, price: product.price, originalPrice: +(product.price * 1.3).toFixed(2), condition: product.condition, category: product.category, image: product.image, isFacultyVerified: product.isFacultyVerified, seller: product.seller, savedDate: "Just now" });
        localStorage.setItem("campuskart_wishlist", JSON.stringify(list));
        setWishlistIds((prev) => new Set([...prev, product.id]));
        showToast(`Saved "${product.title}" to wishlist!`);
      }
    } catch {}
  };


  // IDs of products published from this device — only these show the Edit button
  const [myListingIds, setMyListingIds] = useState<Set<number>>(() => {
    if (typeof window === "undefined") return new Set();
    try {
      const saved = localStorage.getItem("campuskart_listings");
      const listings = saved ? JSON.parse(saved) : [];
      return new Set(listings.map((l: Product) => l.id as number));
    } catch { return new Set(); }
  });

  const handleEditListing = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingProduct(product);
    setNewListing({
      title: product.title,
      category: product.category,
      price: String(product.price),
      condition: product.condition,
      description: product.description,
      isFacultyVerified: product.isFacultyVerified,
    });
    setImagePreview(product.image.startsWith("data:") ? product.image : "");
    setIsListingModalOpen(true);
  };


  // New listing form state
  const [newListing, setNewListing] = useState({
    title: "",
    category: "Textbooks",
    price: "",
    condition: "Excellent",
    description: "",
    isFacultyVerified: false
  });
  const [imagePreview, setImagePreview] = useState<string>("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [cropSrc, setCropSrc] = useState<string>("");
  const [showCropModal, setShowCropModal] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const getCroppedImg = (src: string, px: Area): Promise<string> =>
    new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = px.width;
        canvas.height = px.height;
        canvas.getContext("2d")!.drawImage(img, px.x, px.y, px.width, px.height, 0, 0, px.width, px.height);
        resolve(canvas.toDataURL("image/jpeg", 0.9));
      };
      img.src = src;
    });

  const compressImage = (file: File): Promise<string> =>
    new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const MAX = file.size > 2 * 1024 * 1024 ? 800 : 1000;
        const quality = file.size > 2 * 1024 * 1024 ? 0.75 : 0.85;
        const scale = Math.min(1, MAX / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = url;
    });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const compressed = await compressImage(file);
    setCropSrc(compressed);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setShowCropModal(true);
  };

  // Toasts notifications state
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" } | null>(null);
  
  // Ref for horizontal scroll container
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load products from Supabase, fall back to local data if unavailable
  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .then(({ data }) => {
        let base: Product[] = [];
        if (data && data.length > 0) {
          base = data.map((p) => ({
            id: p.id,
            title: p.title,
            category: p.category,
            price: p.price,
            condition: p.condition,
            description: p.description,
            image: p.image,
            isFacultyVerified: p.is_faculty_verified,
            timeAdded: p.time_added,
            seller: p.seller,
          }));
        } else {
          base = INITIAL_PRODUCTS;
        }
        // Merge locally published listings & detect their Supabase IDs
        try {
          const saved = localStorage.getItem("campuskart_listings");
          const local: Product[] = saved ? JSON.parse(saved) : [];
          const baseIds = new Set(base.map((p) => String(p.id)));
          const extras = local.filter((l) => !baseIds.has(String(l.id)));
          // Deduplicate: keep only first product per title+category+seller
          const merged = [...extras, ...base];
          const seen = new Set<string>();
          const deduped = merged.filter((p) => {
            const key = `${p.title.toLowerCase()}|${p.category}|${p.seller}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
          // Apply any local edits (photo/price/etc changes saved via Edit button)
          const edits: Record<string, Product> = JSON.parse(localStorage.getItem("campuskart_product_edits") || "{}");
          const withEdits = deduped.map((p) => edits[p.id] ? { ...p, ...edits[p.id] } : p);
          setProducts(withEdits);

          // Track which Supabase IDs correspond to this user's local listings
          if (local.length > 0) {
            const matchedIds = new Set<number>();
            base.forEach((bp) => {
              const match = local.find(
                (lp) => lp.title.toLowerCase() === bp.title.toLowerCase() &&
                  lp.category === bp.category && lp.seller === bp.seller
              );
              if (match) matchedIds.add(bp.id);
            });
            const localIds = new Set(local.map((l) => l.id as number));
            setMyListingIds(new Set([...localIds, ...matchedIds]));
          }
        } catch {
          setProducts(base);
        }
      });
  }, []);

  // Sync dark class on document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Show auto-expiring toast helper
  const showToast = (message: string, type: "success" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Cart operations
  const handleAddToCart = (product: Product, event?: React.MouseEvent) => {
    if (event) event.stopPropagation();
    
    setCartItems(prevItems => {
      const existing = prevItems.find(item => item.product.id === product.id);
      if (existing) {
        showToast(`Increased ${product.title} quantity in your cart.`);
        return prevItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      showToast(`Added ${product.title} to your cart.`);
      return [...prevItems, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: number, delta: number) => {
    setCartItems(prevItems => {
      return prevItems
        .map(item => {
          if (item.product.id === productId) {
            const nextQuantity = item.quantity + delta;
            return { ...item, quantity: nextQuantity };
          }
          return item;
        })
        .filter(item => item.quantity > 0);
    });
  };

  const handleRemoveFromCart = (productId: number) => {
    setCartItems(prevItems => {
      const removedItem = prevItems.find(item => item.product.id === productId);
      if (removedItem) {
        showToast(`Removed ${removedItem.product.title} from cart.`, "info");
      }
      return prevItems.filter(item => item.product.id !== productId);
    });
  };

  const getCartTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  // Form handle for new listing
  const handleListSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListing.title || !newListing.price || !newListing.description) {
      showToast("Please fill in all required fields.", "info");
      return;
    }

    const priceNum = parseFloat(newListing.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      showToast("Please enter a valid price.", "info");
      return;
    }

    let imageSrc = editingProduct ? editingProduct.image : "/images/textbook.jpg";
    if (!editingProduct) {
      if (newListing.category === "Electronics") imageSrc = "/images/ipad.jpg";
      else if (newListing.category === "Dorm Essentials") imageSrc = "/images/lamp.jpg";
      else if (newListing.category === "Bikes & Transport") imageSrc = "/images/bike.jpg";
      else if (newListing.category === "Clothing") imageSrc = "/images/sneakers.jpg";
    }
    if (imagePreview) imageSrc = imagePreview;

    const resetForm = () => {
      setNewListing({ title: "", category: "Textbooks", price: "", condition: "Excellent", description: "", isFacultyVerified: false });
      setImagePreview("");
      setEditingProduct(null);
      setIsListingModalOpen(false);
    };

    if (editingProduct) {
      const updated: Product = {
        ...editingProduct,
        title: newListing.title,
        category: newListing.category,
        price: priceNum,
        condition: newListing.condition,
        description: newListing.description,
        isFacultyVerified: newListing.isFacultyVerified,
        image: imageSrc,
      };
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? updated : p));
      try {
        const saved = localStorage.getItem("campuskart_listings");
        const listings: Product[] = saved ? JSON.parse(saved) : [];
        const updatedListings = listings.map(l => l.id === editingProduct.id ? { ...l, ...updated } : l);
        localStorage.setItem("campuskart_listings", JSON.stringify(updatedListings));
      } catch {}
      try {
        const edits = JSON.parse(localStorage.getItem("campuskart_product_edits") || "{}");
        edits[editingProduct.id] = updated;
        localStorage.setItem("campuskart_product_edits", JSON.stringify(edits));
      } catch {}
      showToast(`Updated "${updated.title}"!`);
      resetForm();
      await supabase.from("products").update({
        title: updated.title,
        category: updated.category,
        price: updated.price,
        condition: updated.condition,
        description: updated.description,
        image: updated.image,
        is_faculty_verified: updated.isFacultyVerified,
      }).eq("id", editingProduct.id);
      return;
    }

    const sellerName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Campus Member";

    const newlyCreated: Product = {
      id: Date.now(),
      title: newListing.title,
      category: newListing.category,
      price: priceNum,
      condition: newListing.condition,
      description: newListing.description,
      image: imageSrc,
      isFacultyVerified: newListing.isFacultyVerified,
      timeAdded: "Just now",
      seller: sellerName,
    };

    // Add to local state immediately so user sees it right away
    setProducts(prev => [newlyCreated, ...prev]);

    // Save to localStorage so search page and refreshes can see it too
    try {
      const saved = localStorage.getItem("campuskart_listings");
      const listings: Product[] = saved ? JSON.parse(saved) : [];
      listings.unshift(newlyCreated);
      localStorage.setItem("campuskart_listings", JSON.stringify(listings));
    } catch {}

    setSelectedCategory("All");
    showToast(`Successfully listed "${newListing.title}"!`);
    resetForm();

    // Save to Supabase — this makes the listing visible to ALL users on ALL devices
    const { data: inserted, error: insertError } = await supabase.from("products").insert({
      title: newlyCreated.title,
      category: newlyCreated.category,
      price: newlyCreated.price,
      condition: newlyCreated.condition,
      description: newlyCreated.description,
      image: newlyCreated.image,
      is_faculty_verified: newlyCreated.isFacultyVerified,
      time_added: newlyCreated.timeAdded,
      seller: newlyCreated.seller,
    }).select("id").single();

    if (insertError) {
      showToast("Listed locally — sync to server failed. Check connection.", "info");
      return;
    }

    if (inserted?.id) {
      const supabaseId = inserted.id;
      const localId = newlyCreated.id;
      // Replace Date.now() ID with Supabase auto-increment ID everywhere
      setProducts(prev => prev.map(p => p.id === localId ? { ...p, id: supabaseId } : p));
      setMyListingIds(prev => { const n = new Set(prev); n.delete(localId); n.add(supabaseId); return n; });
      try {
        const saved = localStorage.getItem("campuskart_listings");
        const listings = saved ? JSON.parse(saved) : [];
        const idx = listings.findIndex((l: Product) => l.id === localId);
        if (idx >= 0) { listings[idx].id = supabaseId; localStorage.setItem("campuskart_listings", JSON.stringify(listings)); }
      } catch {}
    }
  };

  // Filter products by category and active search term
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = activeSearch === "" ||
      product.title.toLowerCase().includes(activeSearch.toLowerCase()) ||
      product.description.toLowerCase().includes(activeSearch.toLowerCase()) ||
      product.category.toLowerCase().includes(activeSearch.toLowerCase());
    const matchesFaculty = !facultyFilter || product.isFacultyVerified;
    return matchesCategory && matchesSearch && matchesFaculty;
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      setActiveSearch("");
    }
  };

  const handleClearFilters = () => {
    setSelectedCategory("All");
    setSearchQuery("");
    setActiveSearch("");
    setFacultyFilter(false);
  };

  const triggerScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface dark:bg-zinc-950 dark:text-zinc-50 transition-colors duration-300">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-4 md:right-16 z-[100] max-w-sm rounded-xl p-4 shadow-2xl backdrop-blur-md bg-white/95 dark:bg-zinc-900/95 border-l-4 border-secondary-container dark:border-secondary text-on-surface dark:text-zinc-50 flex items-center gap-3 animate-bounce">
          <span className="material-symbols-outlined text-secondary dark:text-secondary-fixed">
            {toast.type === "success" ? "check_circle" : "info"}
          </span>
          <p className="text-body-sm font-semibold">{toast.message}</p>
        </div>
      )}

      {/* TopNavBar */}
      <header className="sticky top-0 z-50 flex justify-between items-center px-4 md:px-16 h-20 w-full bg-surface/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-surface-variant dark:border-outline-variant shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-12">
          <span className="text-2xl font-extrabold text-primary dark:text-secondary-fixed cursor-pointer tracking-tight" onClick={handleClearFilters}>
            CampusKart
          </span>
          <nav className="hidden md:flex items-center gap-10">
            <button
              onClick={() => { setSelectedCategory("All"); setActiveSearch(""); }}
              className={`text-lg font-bold hover:text-secondary dark:hover:text-secondary-fixed transition-colors duration-200 ${selectedCategory === "All" && activeSearch === "" ? "text-primary dark:text-secondary-fixed border-b-2 border-secondary" : "text-on-surface-variant dark:text-surface-variant"}`}
            >
              Shop
            </button>
            <a
              href="/search"
              className="text-lg font-bold text-on-surface-variant dark:text-surface-variant hover:text-secondary dark:hover:text-secondary-fixed transition-colors duration-200"
            >
              Browse Listings
            </a>
            <button
              onClick={() => setIsListingModalOpen(true)}
              className="text-lg font-bold text-on-surface-variant dark:text-surface-variant hover:text-secondary dark:hover:text-secondary-fixed transition-colors duration-200"
            >
              Sell
            </button>
            <button
              onClick={() => { setSelectedCategory("All"); setActiveSearch(""); setFacultyFilter(f => !f); }}
              className={`text-lg font-bold transition-colors duration-200 flex items-center gap-1.5 ${facultyFilter ? "text-secondary dark:text-secondary-fixed border-b-2 border-secondary" : "text-on-surface-variant dark:text-surface-variant hover:text-secondary dark:hover:text-secondary-fixed"}`}
            >
              <span className="material-symbols-outlined text-[22px]">verified</span> Faculty Verified
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-5">
          {/* Dark Mode Button */}
          <button
            className="material-symbols-outlined text-[28px] text-primary dark:text-secondary-fixed p-2 rounded-full hover:bg-surface-container dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            onClick={() => setIsDarkMode(prev => !prev)}
            title="Toggle Dark Mode"
          >
            {isDarkMode ? "light_mode" : "dark_mode"}
          </button>

          {/* Wishlist Icon */}
          <Link href="/saved" className="p-2 rounded-full hover:bg-surface-container dark:hover:bg-zinc-800 transition-colors active:scale-95 cursor-pointer" aria-label="Saved items">
            <span className="material-symbols-outlined text-[28px] text-primary dark:text-secondary-fixed">favorite</span>
          </Link>

          {/* Cart Icon */}
          <Link href="/cart" className="relative p-2 rounded-full hover:bg-surface-container dark:hover:bg-zinc-800 transition-colors active:scale-95 cursor-pointer">
            <span className="material-symbols-outlined text-[28px] text-primary dark:text-secondary-fixed">shopping_cart</span>
            {getCartCount() > 0 && (
              <span className="absolute top-0 right-0 bg-error text-on-error text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse">
                {getCartCount()}
              </span>
            )}
          </Link>
          <Link href="/profile" aria-label="My profile">
            <button className="p-2 rounded-full hover:bg-surface-container dark:hover:bg-zinc-800 transition-colors">
              <span className="material-symbols-outlined text-[28px] text-primary dark:text-secondary-fixed">account_circle</span>
            </button>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-[1280px] mx-auto px-4 md:px-16 py-8">
        
        {/* Hero Banner Section */}
        <section className="relative h-[420px] md:h-[500px] w-full rounded-2xl overflow-hidden mb-8 shadow-lg bg-primary-container">
          <img 
            alt="Vibrant campus courtyard" 
            className="absolute inset-0 w-full h-full object-cover" 
            src="/images/hero.jpg"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-container/85 to-transparent flex flex-col justify-center px-6 md:px-8">
            <div className="max-w-2xl">
              <h1 className="font-headline-lg text-headline-lg text-on-primary mb-2 drop-shadow-lg leading-tight">
                Your Campus, Your Marketplace.
              </h1>
              <p className="font-body-lg text-body-lg text-on-primary/95 mb-8 max-w-lg">
                Buy and sell textbooks, tech, and dorm gear with fellow students and faculty members.
              </p>
              
              {/* Integrated Search Bar Form */}
              <form action="/search" method="get" onSubmit={handleSearchSubmit} className="relative max-w-xl group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-secondary transition-colors">
                  search
                </span>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-14 pl-12 pr-28 rounded-full border-none bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm shadow-xl focus:ring-2 focus:ring-secondary text-on-surface dark:text-zinc-50 placeholder:text-outline-variant font-body-md" 
                  placeholder="Search textbooks, electronics, dorm gear..."
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-secondary-container text-on-secondary-container px-6 py-2 rounded-full font-label-lg hover:bg-secondary-fixed transition-colors active:scale-95 shadow-md cursor-pointer"
                >
                  Search
                </button>
              </form>
              
              {activeSearch && (
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-body-sm text-on-primary bg-black/45 px-3 py-1 rounded-full backdrop-blur-sm flex items-center gap-1 font-semibold">
                    Search: "{activeSearch}"
                    <button type="button" onClick={() => { setSearchQuery(""); setActiveSearch(""); }} className="material-symbols-outlined text-[16px] hover:text-error transition-colors cursor-pointer">close</button>
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Trust Signals Bar */}
        <div className="flex flex-wrap items-center justify-center gap-8 py-4 bg-surface-container dark:bg-zinc-900 rounded-2xl mb-8 px-4 shadow-sm">
          <div className="flex items-center gap-2 hover:scale-105 transition-transform duration-200">
            <span className="material-symbols-outlined text-on-tertiary-container dark:text-secondary-fixed text-[24px]">
              verified_user
            </span>
            <span className="font-label-lg text-label-lg text-on-surface dark:text-zinc-200">Verified Campus Email Required</span>
          </div>
          <div className="flex items-center gap-2 hover:scale-105 transition-transform duration-200">
            <span className="material-symbols-outlined text-on-tertiary-container dark:text-secondary-fixed text-[24px]">
              location_on
            </span>
            <span className="font-label-lg text-label-lg text-on-surface dark:text-zinc-200">Safe Meetup Zones</span>
          </div>
          <div className="flex items-center gap-2 hover:scale-105 transition-transform duration-200">
            <span className="material-symbols-outlined text-on-tertiary-container dark:text-secondary-fixed text-[24px]">
              shield
            </span>
            <span className="font-label-lg text-label-lg text-on-surface dark:text-zinc-200">Fraud Prevention Systems</span>
          </div>
        </div>

        {/* Categories Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-headline-sm text-headline-sm text-on-surface dark:text-zinc-100">Browse by Category</h2>
            <button 
              onClick={handleClearFilters}
              className="font-label-lg text-label-lg text-primary dark:text-secondary-fixed hover:underline flex items-center gap-1 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
            {CATEGORIES.map((cat) => {
              // Determine standard symbols icons for categories
              let iconName = "grid_view";
              if (cat === "Textbooks") iconName = "menu_book";
              else if (cat === "Electronics") iconName = "laptop_mac";
              else if (cat === "Dorm Essentials") iconName = "bed";
              else if (cat === "Bikes & Transport") iconName = "directions_bike";
              else if (cat === "Clothing") iconName = "apparel";
              
              const isSelected = selectedCategory === cat;

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex flex-col items-center justify-center p-6 rounded-2xl border transition-all duration-300 group cursor-pointer ${isSelected ? "bg-secondary-container text-on-secondary-container border-secondary-fixed scale-105 shadow-md" : "bg-surface-container-low dark:bg-zinc-900 border-surface-variant dark:border-zinc-800 hover:border-secondary dark:hover:border-secondary-fixed hover:translate-y-[-2px] text-on-surface dark:text-zinc-300"}`}
                >
                  <span className={`material-symbols-outlined text-[40px] mb-2 group-hover:scale-110 transition-transform ${isSelected ? "text-on-secondary-container" : "text-primary dark:text-secondary-fixed"}`}>
                    {iconName}
                  </span>
                  <span className="font-label-lg text-label-lg font-bold text-center">{cat}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Main Bento Grid & Filtering Display */}
        <section className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface dark:text-zinc-100">
                Featured Opportunities {selectedCategory !== "All" && `in "${selectedCategory}"`}
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-zinc-400">
                Showing {filteredProducts.length} items available on campus
              </p>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => setIsListingModalOpen(true)}
                className="bg-primary dark:bg-secondary-container text-on-primary dark:text-on-secondary-container px-4 py-2.5 rounded-xl font-label-lg text-label-lg font-semibold hover:opacity-90 active:scale-95 transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span> List an Item
              </button>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-surface-container-low dark:bg-zinc-900 rounded-2xl border border-dashed border-outline-variant p-8">
              <span className="material-symbols-outlined text-[64px] text-outline-variant mb-4">
                sentiment_dissatisfied
              </span>
              <h3 className="font-headline-sm text-headline-sm font-semibold mb-2">No products found</h3>
              <p className="font-body-md text-body-md text-on-surface-variant dark:text-zinc-400 max-w-md mx-auto mb-6">
                We couldn't find any listings matching your active filters or search terms. Try widening your search!
              </p>
              <button
                onClick={handleClearFilters}
                className="bg-secondary-container text-on-secondary-container px-6 py-2.5 rounded-full font-label-lg hover:bg-secondary-fixed transition-colors active:scale-95 cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white dark:bg-zinc-900 rounded-2xl border border-surface-variant dark:border-zinc-800 overflow-hidden flex flex-col group cursor-pointer shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300"
                  >
                    <div className="relative overflow-hidden h-48" onClick={() => router.push(`/product/${product.id}`)}>
                      <img
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        src={product.image}
                      />

                      {myListingIds.has(product.id) && (
                        <div className="absolute top-2 right-2 flex gap-1 z-10">
                          <button
                            onClick={(e) => handleEditListing(product, e)}
                            className="bg-primary text-white p-1.5 rounded-full shadow-lg hover:opacity-90 active:scale-95 transition-all"
                            title="Edit listing"
                          >
                            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>edit</span>
                          </button>
                        </div>
                      )}

                      {product.isFacultyVerified && (
                        <div className="absolute top-4 left-4 bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-md text-label-md flex items-center gap-1 shadow-sm backdrop-blur-sm">
                          <span className="material-symbols-outlined text-[16px] font-bold">verified</span>
                          Faculty Verified
                        </div>
                      )}

                      <span className="absolute bottom-3 right-3 bg-black/60 text-white text-[12px] px-2.5 py-1 rounded-full font-semibold backdrop-blur-sm shadow-sm">
                        {product.condition}
                      </span>

                      {/* Wishlist heart button */}
                      <button
                        onClick={(e) => handleToggleWishlist(product, e)}
                        className="absolute bottom-3 left-3 bg-white/90 p-1.5 rounded-full shadow-md hover:scale-110 active:scale-95 transition-all z-10"
                        title={wishlistIds.has(product.id) ? "Remove from wishlist" : "Save to wishlist"}
                      >
                        <span
                          className="material-symbols-outlined text-[18px]"
                          style={{ color: wishlistIds.has(product.id) ? "#ba1a1a" : "#888", fontVariationSettings: wishlistIds.has(product.id) ? "'FILL' 1" : "'FILL' 0" }}
                        >favorite</span>
                      </button>
                    </div>

                    <div className="p-4 flex flex-col justify-between flex-grow">
                      <div onClick={() => router.push(`/product/${product.id}`)}>
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <span className="text-[12px] font-bold tracking-widest text-outline uppercase dark:text-zinc-400">
                            {product.category}
                          </span>
                          <span className="font-label-md text-label-md text-on-surface-variant dark:text-zinc-500 font-medium">
                            {product.timeAdded}
                          </span>
                        </div>
                        <h3 className="font-headline-sm font-bold text-on-surface dark:text-zinc-100 leading-snug group-hover:text-secondary dark:group-hover:text-secondary-fixed transition-colors text-body-lg truncate">
                          {product.title}
                        </h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-zinc-400 mt-2 line-clamp-2 hidden md:block">
                          {product.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-2 border-t border-surface-variant dark:border-zinc-800">
                        <span className="font-headline-sm text-headline-sm text-primary dark:text-secondary-fixed" onClick={() => router.push(`/product/${product.id}`)}>
                          ${product.price.toFixed(2)}
                        </span>

                        <button
                          onClick={() => handleAddToCart(product)}
                          className="bg-surface-container-highest dark:bg-zinc-800 hover:bg-secondary-container hover:text-on-secondary-container dark:hover:bg-secondary-fixed dark:hover:text-on-secondary-container text-on-surface dark:text-zinc-200 px-3 py-1.5 rounded-lg font-label-md text-label-md flex items-center gap-1 active:scale-95 transition-all shadow-sm cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
              ))}
            </div>
          )}
        </section>

        {/* Recently Added Section with Scroll */}
        <section className="mb-8 overflow-hidden border-t border-surface-variant dark:border-zinc-800 pt-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface dark:text-zinc-100">Recently Added Listings</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-zinc-400">Fresh listings from your campus students today</p>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => triggerScroll("left")}
                className="material-symbols-outlined p-2 border border-surface-variant dark:border-zinc-700 rounded-full hover:bg-surface-container dark:hover:bg-zinc-800 text-on-surface dark:text-zinc-200 transition-colors shadow-sm cursor-pointer"
              >
                chevron_left
              </button>
              <button 
                onClick={() => triggerScroll("right")}
                className="material-symbols-outlined p-2 border border-surface-variant dark:border-zinc-700 rounded-full hover:bg-surface-container dark:hover:bg-zinc-800 text-on-surface dark:text-zinc-200 transition-colors shadow-sm cursor-pointer"
              >
                chevron_right
              </button>
            </div>
          </div>
          
          <div 
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto hide-scrollbar pb-4 snap-x scroll-smooth"
          >
            {products.slice(0, 6).map((product) => (
              <div
                key={`recent-${product.id}`}
                className="min-w-[260px] max-w-[260px] snap-start bg-white dark:bg-zinc-900 rounded-2xl border border-surface-variant dark:border-zinc-800 overflow-hidden hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 cursor-pointer"
              >
                <div className="h-40 relative bg-surface-container overflow-hidden" onClick={() => router.push(`/product/${product.id}`)}>
                  <img
                    alt={product.title}
                    className="w-full h-full object-cover"
                    src={product.image}
                  />
                  <span className="absolute top-2.5 right-2.5 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm backdrop-blur-sm">
                    {product.condition}
                  </span>
                </div>
                <div className="p-2 flex flex-col justify-between h-32">
                  <div onClick={() => router.push(`/product/${product.id}`)}>
                    <h4 className="font-label-lg text-label-lg font-bold text-on-surface dark:text-zinc-100 truncate">
                      {product.title}
                    </h4>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-outline dark:text-zinc-400">
                      {product.category}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-surface-variant dark:border-zinc-800">
                    <p className="text-primary dark:text-secondary-fixed font-bold text-body-md" onClick={() => router.push(`/product/${product.id}`)}>
                      ${product.price.toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-primary/5 dark:bg-zinc-800 hover:bg-secondary-container hover:text-on-secondary-container px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-0.5 active:scale-95 transition-all cursor-pointer"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Graduating Seller CTA Banner Section */}
        <section className="bg-primary-container dark:bg-zinc-900 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-container/10 rounded-full blur-3xl"></div>
          <div className="text-center md:text-left z-10">
            <h2 className="font-headline-md text-headline-md text-on-primary mb-2 tracking-tight">
              Graduating soon? Empty your dorm!
            </h2>
            <p className="font-body-md text-body-md text-on-primary/80 max-w-lg">
              Turn your textbook collection, tech gadgets, and furniture into fast cash with our faculty-verified secure community.
            </p>
          </div>
          <button 
            onClick={() => setIsListingModalOpen(true)}
            className="bg-secondary-container text-on-secondary-container px-6 py-4 rounded-xl font-headline-sm text-headline-sm font-bold hover:scale-105 active:scale-95 transition-all shadow-xl z-10 cursor-pointer"
          >
            List an Item Now
          </button>
        </section>
      </main>

      {/* Footer Section */}
      <footer className="w-full py-6 px-4 md:px-16 bg-surface-container dark:bg-zinc-900 border-t border-surface-variant dark:border-zinc-800 transition-colors duration-300">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="flex flex-col gap-1 max-w-sm">
            <span className="font-headline-sm text-headline-sm font-bold text-primary dark:text-secondary-fixed tracking-tight">
              CampusKart
            </span>
            <p className="font-body-sm text-body-sm text-on-surface dark:text-zinc-400">
              © 2026 CampusKart. All rights reserved. Secure and trustworthy marketplace for college campuses.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-8">
            <div className="flex flex-col gap-2 min-w-[120px]">
              <span className="font-label-lg text-label-lg text-primary dark:text-secondary-fixed font-bold uppercase tracking-wider">
                Marketplace
              </span>
              <a className="font-body-sm text-body-sm text-on-surface-variant dark:text-zinc-400 hover:text-secondary hover:underline transition-all" href="#">
                Campus Directory
              </a>
              <a className="font-body-sm text-body-sm text-on-surface-variant dark:text-zinc-400 hover:text-secondary hover:underline transition-all" href="#">
                Seller Guidelines
              </a>
              <a className="font-body-sm text-body-sm text-on-surface-variant dark:text-zinc-400 hover:text-secondary hover:underline transition-all" href="#">
                Active Listings
              </a>
            </div>
            <div className="flex flex-col gap-2 min-w-[120px]">
              <span className="font-label-lg text-label-lg text-primary dark:text-secondary-fixed font-bold uppercase tracking-wider">
                Support
              </span>
              <a className="font-body-sm text-body-sm text-on-surface-variant dark:text-zinc-400 hover:text-secondary hover:underline transition-all" href="#">
                Trust & Safety
              </a>
              <a className="font-body-sm text-body-sm text-on-surface-variant dark:text-zinc-400 hover:text-secondary hover:underline transition-all" href="#">
                Safe Meetup Map
              </a>
              <a className="font-body-sm text-body-sm text-on-surface-variant dark:text-zinc-400 hover:text-secondary hover:underline transition-all" href="#">
                Contact Support
              </a>
            </div>
            <div className="flex flex-col gap-2 min-w-[120px]">
              <span className="font-label-lg text-label-lg text-primary dark:text-secondary-fixed font-bold uppercase tracking-wider">
                Legal
              </span>
              <a className="font-body-sm text-body-sm text-on-surface-variant dark:text-zinc-400 hover:text-secondary hover:underline transition-all" href="#">
                Privacy Policy
              </a>
              <a className="font-body-sm text-body-sm text-on-surface-variant dark:text-zinc-400 hover:text-secondary hover:underline transition-all" href="#">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Action Button (FAB) for quick listing */}
      <button 
        onClick={() => setIsListingModalOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-primary dark:bg-secondary-container text-on-primary dark:text-on-secondary-container rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 cursor-pointer"
        title="List an Item Quickly"
      >
        <span className="material-symbols-outlined text-[32px]">add</span>
      </button>

      {/* SHOPPING CART DRAWER PANEL (Glassmorphic) */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop overlay */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsCartOpen(false)}
          />
          
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <div className="pointer-events-auto w-screen max-w-md transform bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md shadow-2xl transition-all duration-300 border-l border-surface-variant dark:border-zinc-800 flex flex-col">
              
              <div className="flex items-center justify-between px-6 py-5 border-b border-surface-variant dark:border-zinc-800 bg-surface-container/50 dark:bg-zinc-900/50">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary dark:text-secondary-fixed text-[28px]">
                    shopping_cart
                  </span>
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface dark:text-zinc-100">
                    Your Cart
                  </h3>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="material-symbols-outlined p-1 rounded-full hover:bg-surface-container dark:hover:bg-zinc-800 text-on-surface dark:text-zinc-200 transition-colors cursor-pointer"
                >
                  close
                </button>
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center h-full">
                    <span className="material-symbols-outlined text-[72px] text-outline-variant mb-4">
                      shopping_cart_off
                    </span>
                    <h4 className="font-body-lg text-body-lg font-bold mb-1">Your cart is empty</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-zinc-400 max-w-xs mb-6">
                      Add products from the marketplace to get started on buying textbooks and tech.
                    </p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="bg-primary dark:bg-secondary-container text-on-primary dark:text-on-secondary-container px-6 py-2.5 rounded-xl font-label-lg hover:opacity-90 active:scale-95 transition-all shadow-md cursor-pointer"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div 
                      key={`cart-item-${item.product.id}`}
                      className="flex gap-4 p-3 bg-surface-container-low dark:bg-zinc-900/50 rounded-xl border border-surface-variant dark:border-zinc-800"
                    >
                      <div className="w-20 h-20 relative rounded-lg overflow-hidden bg-surface-container flex-shrink-0">
                        <img 
                          alt={item.product.title} 
                          className="w-full h-full object-cover" 
                          src={item.product.image}
                        />
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex justify-between items-start gap-1">
                            <h4 className="font-body-md text-body-md font-bold text-on-surface dark:text-zinc-100 truncate">
                              {item.product.title}
                            </h4>
                            <button 
                              onClick={() => handleRemoveFromCart(item.product.id)}
                              className="text-outline-variant hover:text-error transition-colors material-symbols-outlined text-[18px] cursor-pointer"
                              title="Delete Item"
                            >
                              delete
                            </button>
                          </div>
                          <span className="text-[11px] text-outline dark:text-zinc-400 uppercase font-semibold">
                            {item.product.category}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center mt-2">
                          <span className="font-body-md text-body-md font-bold text-primary dark:text-secondary-fixed">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </span>
                          
                          <div className="flex items-center border border-surface-variant dark:border-zinc-700 rounded-lg overflow-hidden bg-white dark:bg-zinc-800">
                            <button 
                              onClick={() => handleUpdateQuantity(item.product.id, -1)}
                              className="px-2 py-1 hover:bg-surface-container dark:hover:bg-zinc-700 font-bold text-on-surface dark:text-zinc-300 cursor-pointer"
                            >
                              -
                            </button>
                            <span className="px-3 font-body-sm text-body-sm font-bold text-on-surface dark:text-zinc-100">
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => handleUpdateQuantity(item.product.id, 1)}
                              className="px-2 py-1 hover:bg-surface-container dark:hover:bg-zinc-700 font-bold text-on-surface dark:text-zinc-300 cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Sticky Footer Checkout */}
              {cartItems.length > 0 && (
                <div className="p-6 border-t border-surface-variant dark:border-zinc-800 bg-surface-container/50 dark:bg-zinc-900/50 space-y-4">
                  <div className="flex justify-between items-center font-body-lg text-body-lg font-bold">
                    <span>Subtotal</span>
                    <span className="font-headline-sm text-headline-sm text-primary dark:text-secondary-fixed font-black">
                      ${getCartTotal().toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="p-3 bg-secondary-container/20 dark:bg-secondary-container/5 rounded-xl border border-secondary-container/30 text-[12px] text-on-secondary-container dark:text-zinc-300 flex gap-2">
                    <span className="material-symbols-outlined text-[18px] text-secondary dark:text-secondary-fixed flex-shrink-0">
                      info
                    </span>
                    <p>
                      Trades are completed in safe meet-up zones designated by campus maps. Coordinate with sellers directly.
                    </p>
                  </div>

                  <Link
                    href="/checkout"
                    className="w-full bg-primary text-on-primary font-bold py-4 rounded-xl shadow-lg hover:opacity-90 active:scale-95 transition-all font-body-lg text-body-lg cursor-pointer flex items-center justify-center gap-2"
                    onClick={() => setIsCartOpen(false)}
                  >
                    Proceed to Checkout
                    <span className="material-symbols-outlined text-[20px]" aria-hidden="true">arrow_forward</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DYNAMIC OVERLAY MODAL: PRODUCT DETAILS VIEW */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedProduct(null)} />
          
          <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl border border-surface-variant dark:border-zinc-800 animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-10 bg-black/40 text-white hover:bg-black/60 p-2 rounded-full backdrop-blur-sm transition-colors material-symbols-outlined text-[20px] cursor-pointer"
            >
              close
            </button>

            <div className="h-64 sm:h-80 relative overflow-hidden bg-primary-container">
              <img 
                alt={selectedProduct.title} 
                className="w-full h-full object-cover" 
                src={selectedProduct.image}
              />
              
              <span className="absolute bottom-4 left-4 bg-black/70 text-white font-body-sm text-body-sm px-3.5 py-1.5 rounded-full font-bold shadow-md backdrop-blur-sm">
                Condition: {selectedProduct.condition}
              </span>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="text-[12px] font-bold tracking-widest text-outline uppercase dark:text-zinc-400 bg-surface-container dark:bg-zinc-850 px-3 py-1 rounded-full">
                    {selectedProduct.category}
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant dark:text-zinc-500 font-medium">
                    Added {selectedProduct.timeAdded}
                  </span>
                </div>
                
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface dark:text-zinc-50 leading-tight">
                  {selectedProduct.title}
                </h3>
                
                <p className="font-headline-sm text-headline-sm font-bold text-primary dark:text-secondary-fixed mt-2">
                  ${selectedProduct.price.toFixed(2)}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-label-lg text-label-lg text-primary dark:text-secondary-fixed font-bold uppercase tracking-wider">
                  Description
                </h4>
                <p className="font-body-md text-body-md text-on-surface-variant dark:text-zinc-300 leading-relaxed">
                  {selectedProduct.description}
                </p>
              </div>

              {/* Seller details & verification */}
              <div className="flex items-center justify-between p-4 bg-surface-container-low dark:bg-zinc-950 rounded-xl border border-surface-variant dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[36px] text-outline">
                    account_circle
                  </span>
                  <div>
                    <h5 className="font-body-sm text-body-sm font-bold text-on-surface dark:text-zinc-200">
                      Seller: {selectedProduct.seller}
                    </h5>
                    <p className="text-[11px] text-on-surface-variant dark:text-zinc-500 font-semibold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Online / Active Seller
                    </p>
                  </div>
                </div>

                {selectedProduct.isFacultyVerified && (
                  <div className="bg-secondary-container text-on-secondary-container px-3 py-1.5 rounded-full font-label-md text-label-md font-bold flex items-center gap-1 shadow-sm">
                    <span className="material-symbols-outlined text-[16px] font-bold">verified</span>
                    Faculty Verified
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4 border-t border-surface-variant dark:border-zinc-800">
                <button
                  onClick={() => {
                    handleAddToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="flex-1 bg-secondary-container hover:bg-secondary-fixed text-on-secondary-container dark:text-on-secondary-container font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl active:scale-95 transition-all font-body-md text-body-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                  Add to Shopping Cart
                </button>
                <button
                  onClick={() => {
                    showToast(`Instant message request sent to ${selectedProduct.seller.split(' ')[0]}!`);
                    setSelectedProduct(null);
                  }}
                  className="bg-primary dark:bg-zinc-800 hover:opacity-90 text-on-primary dark:text-zinc-200 font-bold px-6 py-3.5 rounded-xl active:scale-95 transition-all font-body-md text-body-md flex items-center gap-2 border border-transparent dark:border-zinc-700 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">chat</span>
                  Contact Seller
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CROP MODAL */}
      {showCropModal && cropSrc && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80" onClick={() => setShowCropModal(false)} />
          <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl border border-surface-variant dark:border-zinc-800">
            <div className="flex items-center justify-between px-5 py-3 border-b border-surface-variant dark:border-zinc-800">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface dark:text-zinc-100">Crop & Adjust Photo</h3>
              <button onClick={() => setShowCropModal(false)} className="material-symbols-outlined p-1 rounded-full hover:bg-surface-container dark:hover:bg-zinc-800 text-on-surface dark:text-zinc-200 transition-colors cursor-pointer">close</button>
            </div>

            {/* Crop area */}
            <div className="relative w-full bg-black" style={{ height: 320 }}>
              <Cropper
                image={cropSrc}
                crop={crop}
                zoom={zoom}
                aspect={4/3}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, px) => setCroppedAreaPixels(px)}
              />
            </div>

            {/* Zoom slider */}
            <div className="px-5 py-4 space-y-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant dark:text-zinc-400 text-[20px]">photo_size_select_small</span>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.05}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="flex-1 accent-primary cursor-pointer"
                  aria-label="Zoom"
                />
                <span className="material-symbols-outlined text-on-surface-variant dark:text-zinc-400 text-[20px]">photo_size_select_large</span>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCropModal(false)}
                  className="flex-1 py-3 rounded-xl border border-outline-variant dark:border-zinc-700 font-label-lg text-on-surface dark:text-zinc-200 hover:bg-surface-container dark:hover:bg-zinc-800 active:scale-95 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (croppedAreaPixels) {
                      const cropped = await getCroppedImg(cropSrc, croppedAreaPixels);
                      setImagePreview(cropped);
                    }
                    setShowCropModal(false);
                  }}
                  className="flex-1 py-3 rounded-xl bg-primary text-on-primary font-label-lg hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-md"
                >
                  Use Photo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DIALOG: LIST AN ITEM (FORM VALIDATION) */}
      {isListingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setIsListingModalOpen(false); setEditingProduct(null); setImagePreview(""); }} />

          <div className="relative w-full max-w-xl bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl border border-surface-variant dark:border-zinc-800 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-surface-variant dark:border-zinc-800 bg-surface-container/50 dark:bg-zinc-950/50">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface dark:text-zinc-100 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary dark:text-secondary-fixed text-[28px]">
                  {editingProduct ? "edit" : "storefront"}
                </span>
                {editingProduct ? "Edit Your Listing" : "List Your Item for Sale"}
              </h3>
              <button
                onClick={() => { setIsListingModalOpen(false); setEditingProduct(null); setImagePreview(""); }}
                className="material-symbols-outlined p-1 rounded-full hover:bg-surface-container dark:hover:bg-zinc-855 text-on-surface dark:text-zinc-200 transition-colors cursor-pointer"
              >
                close
              </button>
            </div>

            <form onSubmit={handleListSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="font-label-lg text-label-lg font-bold text-primary dark:text-zinc-200">
                    Item Title <span className="text-error">*</span>
                  </label>
                  <input 
                    type="text"
                    required
                    value={newListing.title}
                    onChange={(e) => setNewListing(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full h-11 px-4 rounded-xl border border-surface-variant dark:border-zinc-700 bg-white dark:bg-zinc-950 text-on-surface dark:text-zinc-50 focus:ring-2 focus:ring-secondary font-body-md"
                    placeholder="e.g. Calculus Vol 1, Bose QuietComfort..."
                  />
                </div>

                {/* Category */}
                <div className="space-y-1">
                  <label className="font-label-lg text-label-lg font-bold text-primary dark:text-zinc-200">
                    Category <span className="text-error">*</span>
                  </label>
                  <select 
                    value={newListing.category}
                    onChange={(e) => setNewListing(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full h-11 px-4 rounded-xl border border-surface-variant dark:border-zinc-700 bg-white dark:bg-zinc-950 text-on-surface dark:text-zinc-50 focus:ring-2 focus:ring-secondary font-body-md"
                  >
                    {CATEGORIES.filter(c => c !== "All").map(c => (
                      <option key={`select-cat-${c}`} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div className="space-y-1">
                  <label className="font-label-lg text-label-lg font-bold text-primary dark:text-zinc-200">
                    Asking Price ($) <span className="text-error">*</span>
                  </label>
                  <input 
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={newListing.price}
                    onChange={(e) => setNewListing(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full h-11 px-4 rounded-xl border border-surface-variant dark:border-zinc-700 bg-white dark:bg-zinc-950 text-on-surface dark:text-zinc-50 focus:ring-2 focus:ring-secondary font-body-md"
                    placeholder="0.00"
                  />
                </div>

                {/* Condition */}
                <div className="space-y-1">
                  <label className="font-label-lg text-label-lg font-bold text-primary dark:text-zinc-200">
                    Item Condition <span className="text-error">*</span>
                  </label>
                  <select 
                    value={newListing.condition}
                    onChange={(e) => setNewListing(prev => ({ ...prev, condition: e.target.value }))}
                    className="w-full h-11 px-4 rounded-xl border border-surface-variant dark:border-zinc-700 bg-white dark:bg-zinc-950 text-on-surface dark:text-zinc-50 focus:ring-2 focus:ring-secondary font-body-md"
                  >
                    <option value="Mint">Mint (Like New)</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair / Worn</option>
                  </select>
                </div>

                {/* Faculty Verified Check */}
                <div className="flex items-center gap-2 pt-6 pl-2">
                  <input 
                    type="checkbox"
                    id="fac-verify"
                    checked={newListing.isFacultyVerified}
                    onChange={(e) => setNewListing(prev => ({ ...prev, isFacultyVerified: e.target.checked }))}
                    className="w-5 h-5 rounded border-surface-variant dark:border-zinc-700 bg-white dark:bg-zinc-950 text-secondary focus:ring-secondary cursor-pointer"
                  />
                  <label htmlFor="fac-verify" className="font-body-sm text-body-sm font-semibold text-on-surface dark:text-zinc-200 cursor-pointer flex items-center gap-1 select-none">
                    Faculty Sponsored <span className="material-symbols-outlined text-[16px] text-secondary dark:text-secondary-fixed">verified</span>
                  </label>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="font-label-lg text-label-lg font-bold text-primary dark:text-zinc-200">
                  Item Details / Description <span className="text-error">*</span>
                </label>
                <textarea 
                  required
                  rows={4}
                  value={newListing.description}
                  onChange={(e) => setNewListing(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-4 rounded-xl border border-surface-variant dark:border-zinc-700 bg-white dark:bg-zinc-950 text-on-surface dark:text-zinc-50 focus:ring-2 focus:ring-secondary font-body-md"
                  placeholder="Mention battery health, textbook edition, safe meetup time preferences..."
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-1">
                <label className="font-label-lg text-label-lg font-bold text-primary dark:text-zinc-200">
                  Item Photo <span className="text-on-surface-variant font-normal text-[12px]">(optional)</span>
                </label>
                <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-surface-variant dark:border-zinc-700 rounded-xl cursor-pointer hover:border-primary transition-colors bg-surface-container-low dark:bg-zinc-900 overflow-hidden relative">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-on-surface-variant pointer-events-none">
                      <span className="material-symbols-outlined text-[40px]">add_photo_alternate</span>
                      <span className="font-body-sm text-body-sm">Click to upload a photo</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
                {imagePreview && (
                  <button type="button" onClick={() => setImagePreview("")} className="text-error font-label-sm text-label-sm hover:underline">
                    Remove photo
                  </button>
                )}
              </div>

              <div className="pt-4 border-t border-surface-variant dark:border-zinc-800 flex gap-4">
                <button
                  type="button"
                  onClick={() => { setIsListingModalOpen(false); setEditingProduct(null); setImagePreview(""); }}
                  className="flex-1 bg-surface-container hover:bg-surface-container-high dark:bg-zinc-850 dark:hover:bg-zinc-800 text-on-surface dark:text-zinc-200 font-bold py-3 rounded-xl active:scale-95 transition-all font-body-md text-body-md cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-secondary-container hover:bg-secondary-fixed text-on-secondary-container dark:text-on-secondary-fixed font-bold py-3 rounded-xl shadow-lg hover:shadow-xl active:scale-95 transition-all font-body-md text-body-md cursor-pointer"
                >
                  {editingProduct ? "Save Changes" : "Publish Listing"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
