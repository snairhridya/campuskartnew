"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { PRODUCTS, type Product } from "@/app/lib/products";
import { supabase } from "@/lib/supabase";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [product, setProduct] = useState<Product | null | undefined>(undefined);

  // Check if already wishlisted
  useEffect(() => {
    try {
      const saved = localStorage.getItem("campuskart_wishlist");
      const list = saved ? JSON.parse(saved) : [];
      setWishlisted(list.some((i: { id: number }) => i.id === Number(params.id)));
    } catch {}
  }, [params.id]);

  const handleWishlist = () => {
    if (!product) return;
    try {
      const saved = localStorage.getItem("campuskart_wishlist");
      const list = saved ? JSON.parse(saved) : [];
      if (wishlisted) {
        const updated = list.filter((i: { id: number }) => i.id !== product.id);
        localStorage.setItem("campuskart_wishlist", JSON.stringify(updated));
      } else {
        list.unshift({
          id: product.id, title: product.title, price: product.price,
          originalPrice: product.originalPrice, condition: product.condition,
          category: product.category, image: product.image,
          isFacultyVerified: product.isFacultyVerified, seller: product.seller,
          savedDate: "Just now",
        });
        localStorage.setItem("campuskart_wishlist", JSON.stringify(list));
      }
    } catch {}
    setWishlisted((w) => !w);
  };

  useEffect(() => {
    const id = Number(params.id);

    // 1. Check static products
    const staticProduct = PRODUCTS.find((p) => p.id === id);
    if (staticProduct) { setProduct(staticProduct); return; }

    // 2. Check localStorage
    try {
      const saved = localStorage.getItem("campuskart_listings");
      const listings = saved ? JSON.parse(saved) : [];
      const local = listings.find((p: { id: number }) => p.id === id);
      if (local) {
        setProduct({
          ...local,
          originalPrice: +(local.price * 1.3).toFixed(2),
          rating: 4.5, reviewCount: 0,
          specs: { Condition: local.condition, Category: local.category, Seller: local.seller },
          reviews: [],
        } as Product);
        return;
      }
    } catch {}

    // 3. Fetch from Supabase
    supabase.from("products").select("*").eq("id", id).single().then(({ data }) => {
      if (data) {
        setProduct({
          id: data.id, title: data.title, category: data.category,
          price: data.price, originalPrice: +(data.price * 1.3).toFixed(2),
          condition: data.condition, description: data.description,
          image: data.image, isFacultyVerified: data.is_faculty_verified,
          timeAdded: data.time_added, seller: data.seller,
          rating: 4.5, reviewCount: 0,
          specs: { Condition: data.condition, Category: data.category, Seller: data.seller },
          reviews: [],
        } as Product);
      } else {
        setProduct(null);
      }
    });
  }, [params.id]);

  // Loading state
  if (product === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="material-symbols-outlined animate-spin text-primary text-[48px]">progress_activity</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <span className="material-symbols-outlined text-[64px] text-outline-variant">search_off</span>
        <h1 className="font-headline-sm text-headline-sm text-on-surface">Product not found</h1>
        <button
          onClick={() => router.push("/")}
          className="bg-primary text-on-primary px-6 py-3 rounded-full font-label-lg"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);

  const handleAddToCart = () => {
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
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
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
    window.location.href = "/checkout";
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen mb-24 md:mb-0">

      {/* Top App Bar */}
      <header className="bg-surface shadow-sm sticky top-0 z-50 flex items-center justify-between w-full px-4 md:px-16 h-16 max-w-[1280px] mx-auto">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-surface-container-high active:scale-95 transition-all"
            aria-label="Go back"
          >
            <span className="material-symbols-outlined text-primary" aria-hidden="true">arrow_back</span>
          </button>
          <a href="/" className="font-headline-sm text-headline-sm text-primary font-bold tracking-tight">
            CampusKart
          </a>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded-full hover:bg-surface-container-high active:scale-95 transition-all"
            aria-label="Share this listing"
          >
            <span className="material-symbols-outlined text-primary" aria-hidden="true">share</span>
          </button>
          <button
            onClick={() => router.push("/cart")}
            className="p-2 rounded-full hover:bg-surface-container-high active:scale-95 transition-all"
            aria-label="View cart"
          >
            <span className="material-symbols-outlined text-primary" aria-hidden="true">shopping_cart</span>
          </button>
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto pb-10">

        {/* Hero Image */}
        <section className="relative">
          <div className="w-full overflow-hidden bg-surface-container-low" style={{ aspectRatio: "4/3", maxHeight: "420px" }}>
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Floating badges */}
          <div className="absolute bottom-4 left-4 flex gap-2">
            <span className="px-3 py-1 rounded-full font-label-md text-label-md text-on-surface border border-outline-variant flex items-center gap-1 backdrop-blur-sm bg-white/80">
              <span
                className="material-symbols-outlined text-secondary"
                style={{ fontSize: "14px", fontVariationSettings: "'FILL' 1" }}
                aria-hidden="true"
              >
                star
              </span>
              {product.rating}
            </span>
            {product.isFacultyVerified && (
              <span className="px-3 py-1 rounded-full font-label-md text-label-md text-on-secondary-container border border-secondary-container/40 flex items-center gap-1 backdrop-blur-sm bg-white/80">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "14px" }}
                  aria-hidden="true"
                >
                  verified
                </span>
                Faculty Verified
              </span>
            )}
          </div>
        </section>

        {/* Content */}
        <div className="px-4 md:px-16 mt-4 lg:grid lg:grid-cols-2 lg:gap-6">

          {/* Left Column */}
          <div>
            {/* Title + wishlist */}
            <div className="flex justify-between items-start">
              <h1 className="font-headline-md text-headline-md text-on-surface leading-tight flex-1 pr-2">
                {product.title}
              </h1>
              <button
                onClick={handleWishlist}
                className="p-2 rounded-full hover:bg-surface-container-high transition-colors active:scale-95"
                aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <span
                  className={`material-symbols-outlined ${wishlisted ? "text-error" : "text-outline"}`}
                  style={{ fontVariationSettings: wishlisted ? "'FILL' 1" : "'FILL' 0" }}
                  aria-hidden="true"
                >
                  favorite
                </span>
              </button>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2 mt-2 flex-wrap">
              <span className="font-headline-sm text-headline-sm text-primary">
                ${product.price.toFixed(2)}
              </span>
              <span className="font-body-sm text-body-sm text-outline-variant line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
              <span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full font-label-md text-label-md">
                {discount}% OFF
              </span>
            </div>

            {/* Description */}
            <div className="mt-4 p-4 bg-surface-container-low rounded-xl border border-outline-variant/30">
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Seller info */}
            <div className="mt-4 p-4 bg-surface-container rounded-xl border border-outline-variant/20 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-sm flex-shrink-0">
                {product.seller.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-label-lg text-label-lg text-on-surface">
                  {product.seller}
                </p>
                <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                  Online · Added {product.timeAdded}
                </p>
              </div>
              <span className="text-label-md text-label-md text-on-surface-variant font-label-md">
                {product.reviewCount} reviews
              </span>
            </div>

            {/* Specifications */}
            <div className="mt-6">
              <h2 className="font-label-lg text-label-lg uppercase tracking-wider text-outline mb-3">
                Item Specifications
              </h2>
              <div className="grid grid-cols-2 gap-px bg-outline-variant rounded-xl overflow-hidden border border-outline-variant">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="bg-surface p-4">
                    <span className="font-label-md text-label-md text-outline block">{key}</span>
                    <span className="font-body-md text-body-md text-on-surface font-semibold">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="mt-6 lg:mt-0">

            {/* Reviews */}
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-label-lg text-label-lg uppercase tracking-wider text-outline">
                Student Reviews ({product.reviewCount})
              </h2>
              <button className="text-secondary font-label-lg text-label-lg hover:underline">
                View All
              </button>
            </div>

            <div className="space-y-3">
              {product.reviews.map((review, i) => (
                <div key={i} className="p-4 bg-surface-container rounded-xl border border-outline-variant/10">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-xs flex-shrink-0">
                      {review.initials}
                    </div>
                    <div>
                      <span className="font-label-md text-label-md text-on-surface block">
                        {review.name} · {review.role}
                      </span>
                      <div className="flex gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className="material-symbols-outlined text-secondary"
                            style={{
                              fontSize: "12px",
                              fontVariationSettings: star <= review.rating ? "'FILL' 1" : "'FILL' 0",
                            }}
                            aria-hidden="true"
                          >
                            star
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant italic">
                    &ldquo;{review.text}&rdquo;
                  </p>
                </div>
              ))}
            </div>

            {/* Desktop action buttons */}
            <div className="hidden lg:flex gap-4 mt-6">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-surface border-2 border-primary text-primary py-4 px-6 rounded-full font-label-lg text-label-lg hover:bg-surface-container-low active:scale-95 transition-all"
              >
                {addedToCart ? "✓ ADDED!" : "ADD TO CART"}
              </button>
              <button onClick={handleBuyNow} className="flex-1 bg-primary text-on-primary py-4 px-6 rounded-full font-label-lg text-label-lg hover:opacity-90 active:scale-95 transition-all">
                BUY NOW
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-8 px-4 md:px-16">
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-4">
              Related {product.category}
            </h2>
            <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 md:-mx-16 md:px-16" style={{ scrollbarWidth: "none" }}>
              {related.map((item) => (
                <a
                  key={item.id}
                  href={`/product/${item.id}`}
                  className="min-w-[180px] bg-surface rounded-xl border border-outline-variant overflow-hidden flex-shrink-0 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
                >
                  <div className="h-[140px] bg-surface-container overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-label-md text-label-md text-on-surface line-clamp-1">{item.title}</h3>
                    <p className="font-label-lg text-label-lg text-primary mt-1">${item.price.toFixed(2)}</p>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Mobile bottom action bar */}
      <div className="fixed bottom-0 left-0 w-full bg-surface border-t border-outline-variant px-4 py-3 flex gap-3 shadow-lg md:hidden z-50">
        <button
          onClick={handleAddToCart}
          className="flex-1 bg-surface border-2 border-primary text-primary py-3 rounded-full font-label-lg text-label-lg active:scale-95 transition-all"
        >
          {addedToCart ? "✓ ADDED!" : "ADD TO CART"}
        </button>
        <button onClick={handleBuyNow} className="flex-1 bg-primary text-on-primary py-3 rounded-full font-label-lg text-label-lg active:scale-95 transition-all">
          BUY NOW
        </button>
      </div>
    </div>
  );
}
