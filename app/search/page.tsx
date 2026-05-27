"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { PRODUCTS } from "@/app/lib/products";
import { supabase } from "@/lib/supabase";

const CATEGORIES = ["All", "Textbooks", "Electronics", "Dorm Essentials", "Bikes & Transport", "Clothing"];
const CONDITIONS = ["Any", "Mint", "Excellent", "Good"];

type SimpleProduct = {
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
};

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<SimpleProduct[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("campuskart_listings");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [inputValue, setInputValue] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCondition, setSelectedCondition] = useState("Any");
  const [facultyOnly, setFacultyOnly] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [addedId, setAddedId] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("Most Recent");

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false })
      .then(({ data }) => {
        let base: SimpleProduct[] = [];
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
          base = PRODUCTS.map((p) => ({
            id: p.id,
            title: p.title,
            category: p.category,
            price: p.price,
            condition: p.condition,
            description: p.description,
            image: p.image,
            isFacultyVerified: p.isFacultyVerified,
            timeAdded: p.timeAdded,
            seller: p.seller,
          }));
        }
        // Merge locally published listings
        try {
          const saved = localStorage.getItem("campuskart_listings");
          const local: SimpleProduct[] = saved ? JSON.parse(saved) : [];
          const baseIds = new Set(base.map((p) => String(p.id)));
          const extras = local.filter((l) => !baseIds.has(String(l.id)));
          setProducts([...extras, ...base]);
        } catch {
          setProducts(base);
        }
      });
  }, []);

  useEffect(() => {
    const q = searchParams.get("q") || "";
    setQuery(q);
    setInputValue(q);
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setQuery(inputValue);
    router.push(`/search?q=${encodeURIComponent(inputValue)}`);
  };

  const filtered = products.filter((p) => {
    const matchesQuery =
      !query ||
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesCondition = selectedCondition === "Any" || p.condition === selectedCondition;
    const matchesFaculty = !facultyOnly || p.isFacultyVerified;
    const matchesMin = !minPrice || p.price >= parseFloat(minPrice);
    const matchesMax = !maxPrice || p.price <= parseFloat(maxPrice);
    return matchesQuery && matchesCategory && matchesCondition && matchesFaculty && matchesMin && matchesMax;
  }).sort((a, b) => {
    if (sortBy === "Price: Low to High") return a.price - b.price;
    if (sortBy === "Price: High to Low") return b.price - a.price;
    return 0;
  });

  const handleAddToCart = (product: SimpleProduct) => {
    try {
      const saved = localStorage.getItem("campuskart_cart");
      const cart = saved ? JSON.parse(saved) : [];
      const existing = cart.find((i: { product: { id: number } }) => i.product?.id === product.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ product, quantity: 1 });
      }
      localStorage.setItem("campuskart_cart", JSON.stringify(cart));
    } catch {}
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <>
      {/* Top Nav */}
      <header className="bg-surface border-b border-outline-variant shadow-sm z-50 sticky top-0">
        <div className="flex justify-between items-center w-full px-4 md:px-16 py-3 max-w-7xl mx-auto">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xl font-extrabold text-primary">
              CampusKart
            </Link>
            <nav className="hidden md:flex gap-8 items-center">
              <Link href="/" className="text-base font-bold text-on-surface-variant hover:text-primary transition-colors">Shop</Link>
              <Link href="/sell" className="text-base font-bold text-on-surface-variant hover:text-primary transition-colors">Sell</Link>
            </nav>
          </div>

          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8 hidden lg:block">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
              <input
                type="search"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-full py-2 pl-10 pr-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-md"
                placeholder="Search textbooks, tech, bikes..."
              />
            </div>
          </form>

          <div className="flex items-center gap-2">
            <Link href="/cart">
              <button className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors" aria-label="Cart">
                <span className="material-symbols-outlined">shopping_cart</span>
              </button>
            </Link>
            <Link href="/profile">
              <button className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center border border-outline-variant cursor-pointer active:scale-95 transition-transform" aria-label="Profile">
                <span className="material-symbols-outlined text-on-primary-container text-[20px]">account_circle</span>
              </button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-16 py-8">

        {/* Mobile search bar */}
        <form onSubmit={handleSearch} className="lg:hidden mb-6">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
            <input
              type="search"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-full py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary outline-none font-body-md"
              placeholder="Search products..."
            />
          </div>
        </form>

        {/* Heading */}
        <div className="mb-6 border-b border-outline-variant pb-4">
          <nav className="flex text-on-surface-variant text-label-md mb-2 items-center gap-2">
            <Link href="/" className="hover:text-primary transition-colors">Marketplace</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-semibold">{query ? `"${query}"` : "All Products"}</span>
          </nav>
          <h1 className="font-headline-md text-headline-md text-on-surface">
            {query ? `Search Results for "${query}"` : "Browse All Products"}
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-6">

          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 flex-shrink-0 space-y-6">

            {/* Category */}
            <fieldset>
              <legend className="font-label-lg text-label-lg text-on-surface mb-3 uppercase tracking-wider font-bold">Category</legend>
              <div className="space-y-2">
                {CATEGORIES.map((cat) => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === cat}
                      onChange={() => setSelectedCategory(cat)}
                      className="border-outline-variant text-primary focus:ring-primary"
                    />
                    <span className={`font-body-md transition-colors ${selectedCategory === cat ? "text-primary font-semibold" : "text-on-surface-variant group-hover:text-primary"}`}>
                      {cat}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Price Range */}
            <fieldset>
              <legend className="font-label-lg text-label-lg text-on-surface mb-3 uppercase tracking-wider font-bold">Price Range</legend>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min={0}
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="bg-surface-container border border-outline-variant rounded px-2 py-1 text-body-sm w-full outline-none focus:border-primary transition-colors"
                  placeholder="Min $"
                />
                <input
                  type="number"
                  min={0}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="bg-surface-container border border-outline-variant rounded px-2 py-1 text-body-sm w-full outline-none focus:border-primary transition-colors"
                  placeholder="Max $"
                />
              </div>
            </fieldset>

            {/* Condition */}
            <fieldset>
              <legend className="font-label-lg text-label-lg text-on-surface mb-3 uppercase tracking-wider font-bold">Condition</legend>
              <div className="space-y-2">
                {CONDITIONS.map((cond) => (
                  <label key={cond} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="condition"
                      checked={selectedCondition === cond}
                      onChange={() => setSelectedCondition(cond)}
                      className="border-outline-variant text-primary focus:ring-primary"
                    />
                    <span className={`font-body-md transition-colors ${selectedCondition === cond ? "text-primary font-semibold" : "text-on-surface-variant group-hover:text-primary"}`}>
                      {cond}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Faculty Verified toggle */}
            <div className="p-4 bg-surface-container border border-secondary rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="font-label-lg text-secondary font-bold" id="faculty-label">Faculty Verified</span>
                <button
                  role="switch"
                  aria-checked={facultyOnly}
                  aria-labelledby="faculty-label"
                  onClick={() => setFacultyOnly((v) => !v)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${facultyOnly ? "bg-secondary" : "bg-surface-container-high"}`}
                >
                  <span className={`absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full shadow transition-transform ${facultyOnly ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>
              <p className="text-[11px] text-on-surface-variant">Show only faculty-verified listings.</p>
            </div>

            {/* Reset */}
            <button
              onClick={() => { window.location.href = "/search"; }}
              className="w-full py-2 border border-outline-variant rounded-lg text-on-surface-variant font-label-md hover:bg-surface-container transition-colors"
            >
              Reset Filters
            </button>
          </aside>

          {/* Results */}
          <section className="flex-1">

            {/* Sort bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3 bg-surface-container-lowest p-3 rounded border border-outline-variant shadow-sm">
              <p className="font-body-md text-on-surface-variant px-2">
                <span className="font-bold text-primary">{filtered.length}</span> items found
              </p>
              <div className="flex items-center gap-3 px-2">
                <label htmlFor="sort-select" className="text-label-md text-on-surface-variant whitespace-nowrap">Sort by:</label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent border-none font-label-lg text-primary focus:ring-2 focus:ring-primary rounded cursor-pointer outline-none"
                >
                  <option>Most Recent</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Empty state */}
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <span className="material-symbols-outlined text-[64px] text-outline-variant mb-4">search_off</span>
                <h2 className="font-headline-sm text-headline-sm mb-2">No results found</h2>
                <p className="font-body-md text-on-surface-variant mb-6 max-w-xs">Try a different search term or clear the filters.</p>
                <button
                  onClick={() => { window.location.href = "/search"; }}
                  className="bg-primary text-on-primary px-6 py-3 rounded-full font-label-lg hover:opacity-90 active:scale-95 transition-all"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Product grid */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((product) => (
                <li
                  key={product.id}
                  className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden flex flex-col group hover:-translate-y-1 hover:shadow-lg transition-all duration-200 cursor-pointer"
                  onClick={() => router.push(`/product/${product.id}`)}
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-surface-container">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.isFacultyVerified ? (
                      <span className="absolute top-2 right-2 bg-secondary text-on-secondary-fixed font-label-md text-[10px] px-2 py-1 rounded-full flex items-center gap-1 shadow-md pointer-events-none">
                        <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                        FACULTY VERIFIED
                      </span>
                    ) : (
                      <span className="absolute top-2 right-2 bg-primary-container text-on-primary font-label-md text-[10px] px-2 py-1 rounded-full flex items-center gap-1 shadow-md pointer-events-none">
                        <span className="material-symbols-outlined text-[12px]">person</span>
                        STUDENT SELLER
                      </span>
                    )}
                    <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[11px] px-2 py-0.5 rounded-full font-semibold pointer-events-none">
                      {product.condition}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="p-4 flex flex-col flex-1">
                    <h2 className="font-headline-sm text-[17px] leading-snug text-on-surface group-hover:text-primary transition-colors">{product.title}</h2>
                    <p className="font-body-sm text-on-surface-variant mt-0.5 text-[12px]">{product.category} · {product.seller}</p>
                    <p className="text-[12px] text-on-surface-variant mt-2 line-clamp-2">{product.description}</p>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="font-headline-sm text-headline-sm text-primary">${product.price.toFixed(2)}</span>
                    </div>

                    {/* Add to Cart — stops card click from firing */}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                      className={`mt-3 w-full py-2.5 rounded-lg font-label-lg active:scale-95 transition-all flex items-center justify-center gap-2 ${addedId === product.id ? "bg-secondary text-on-secondary" : "bg-primary text-on-primary hover:opacity-90"}`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {addedId === product.id ? "check_circle" : "add_shopping_cart"}
                      </span>
                      {addedId === product.id ? "Added to Cart!" : "Add to Cart"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 px-4 md:px-16 bg-surface-container border-t border-outline-variant mt-8 text-center">
        <p className="font-body-sm text-on-surface-variant">&copy; 2025 CampusKart. Academic Integrity &amp; Safety First.</p>
      </footer>

      {/* FAB */}
      <Link href="/sell">
        <button className="fixed bottom-8 right-8 bg-primary text-on-primary shadow-lg flex items-center gap-2 px-6 py-4 rounded-full font-label-lg hover:scale-105 active:scale-95 transition-all z-40">
          <span className="material-symbols-outlined">add</span>
          List an Item
        </button>
      </Link>
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  );
}
