"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { PRODUCTS, type Product } from "@/app/lib/products";
import { supabase } from "@/lib/supabase";
import Cropper, { Area } from "react-easy-crop";

const CATEGORIES = ["Textbooks", "Electronics", "Dorm Essentials", "Bikes & Transport", "Clothing"];

interface Review {
  name: string;
  initials: string;
  role: string;
  rating: number;
  text: string;
  date: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [product, setProduct] = useState<Product | null | undefined>(undefined);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [reviewForm, setReviewForm] = useState({ name: "", role: "Student", rating: 5, text: "" });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Edit listing states
  const [isMyListing, setIsMyListing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ title: "", category: "Textbooks", price: "", condition: "Excellent", description: "", isFacultyVerified: false });
  const [editImagePreview, setEditImagePreview] = useState<string>("");
  const [cropSrc, setCropSrc] = useState<string>("");
  const [showCropModal, setShowCropModal] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [editSaved, setEditSaved] = useState(false);

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

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => { setCropSrc(reader.result as string); setCrop({ x: 0, y: 0 }); setZoom(1); setShowCropModal(true); };
    reader.readAsDataURL(file);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    const priceNum = parseFloat(editForm.price);
    if (isNaN(priceNum) || priceNum <= 0) return;
    const imageSrc = editImagePreview || product.image;
    const updated = { ...product, title: editForm.title, category: editForm.category, price: priceNum, condition: editForm.condition, description: editForm.description, isFacultyVerified: editForm.isFacultyVerified, image: imageSrc };
    // Store as a persistent local override so refresh doesn't revert it
    try {
      const edits = JSON.parse(localStorage.getItem("campuskart_product_edits") || "{}");
      edits[product.id] = updated;
      localStorage.setItem("campuskart_product_edits", JSON.stringify(edits));
    } catch {}
    // Also update listings entry if present
    try {
      const saved = localStorage.getItem("campuskart_listings");
      const listings = saved ? JSON.parse(saved) : [];
      const idx = listings.findIndex((l: Product) => l.id === product.id);
      if (idx !== -1) { listings[idx] = { ...listings[idx], ...updated }; localStorage.setItem("campuskart_listings", JSON.stringify(listings)); }
    } catch {}
    // Update Supabase silently
    supabase.from("products").update({ title: updated.title, category: updated.category, price: updated.price, condition: updated.condition, description: updated.description, image: updated.image, is_faculty_verified: updated.isFacultyVerified }).eq("id", product.id);
    setProduct(updated as Product);
    setShowEditModal(false);
    setEditSaved(true);
    setTimeout(() => setEditSaved(false), 2500);
  };

  // Check if already wishlisted
  useEffect(() => {
    try {
      const saved = localStorage.getItem("campuskart_wishlist");
      const list = saved ? JSON.parse(saved) : [];
      setWishlisted(list.some((i: { id: number }) => i.id === Number(params.id)));
    } catch {}
  }, [params.id]);

  // Pre-fill edit form whenever product loads
  useEffect(() => {
    if (!product) return;
    setIsMyListing(true); // allow editing any product
    setEditForm({
      title: product.title,
      category: product.category,
      price: String(product.price),
      condition: product.condition,
      description: product.description,
      isFacultyVerified: product.isFacultyVerified,
    });
    setEditImagePreview(product.image.startsWith("data:") ? product.image : "");
  }, [product]);

  // Load reviews from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`campuskart_reviews_${params.id}`);
      setUserReviews(saved ? JSON.parse(saved) : []);
    } catch {}
  }, [params.id]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.name.trim() || !reviewForm.text.trim()) return;
    const initials = reviewForm.name.trim().split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
    const newReview: Review = {
      name: reviewForm.name.trim(),
      initials,
      role: reviewForm.role,
      rating: reviewForm.rating,
      text: reviewForm.text.trim(),
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
    };
    const updated = [newReview, ...userReviews];
    setUserReviews(updated);
    try {
      localStorage.setItem(`campuskart_reviews_${params.id}`, JSON.stringify(updated));
    } catch {}
    setReviewForm({ name: "", role: "Student", rating: 5, text: "" });
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 2500);
  };

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

    // 0. Check user-saved local edits first (overrides everything)
    try {
      const edits = JSON.parse(localStorage.getItem("campuskart_product_edits") || "{}");
      if (edits[id]) { setProduct(edits[id]); return; }
    } catch {}

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
          {isMyListing && (
            <button
              onClick={() => setShowEditModal(true)}
              className="p-2 rounded-full hover:bg-surface-container-high active:scale-95 transition-all flex items-center gap-1 bg-primary text-on-primary px-3 rounded-full"
              aria-label="Edit your listing"
            >
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>edit</span>
              <span className="font-label-md text-label-md hidden sm:inline">Edit</span>
            </button>
          )}
          {editSaved && (
            <span className="text-secondary font-label-md text-label-md flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">check_circle</span> Saved!
            </span>
          )}
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
            {(() => {
              const allReviews = [...userReviews, ...(product.reviews || [])];
              const preview = allReviews.slice(0, 2);
              return (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-label-lg text-label-lg uppercase tracking-wider text-outline">
                      Student Reviews ({allReviews.length})
                    </h2>
                    <button
                      onClick={() => setShowReviewsModal(true)}
                      className="text-secondary font-label-lg text-label-lg hover:underline active:scale-95 transition-all"
                    >
                      {allReviews.length === 0 ? "Write a Review" : "View All"}
                    </button>
                  </div>

                  <div className="space-y-3">
                    {preview.length === 0 && (
                      <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/20 text-center">
                        <p className="font-body-sm text-body-sm text-on-surface-variant">No reviews yet. Be the first!</p>
                        <button onClick={() => setShowReviewsModal(true)} className="mt-2 text-secondary font-label-md hover:underline">Write a Review</button>
                      </div>
                    )}
                    {preview.map((review, i) => (
                      <div key={i} className="p-4 bg-surface-container rounded-xl border border-outline-variant/10">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-xs flex-shrink-0">
                            {review.initials}
                          </div>
                          <div>
                            <span className="font-label-md text-label-md text-on-surface block">{review.name} · {review.role}</span>
                            <div className="flex gap-0.5">
                              {[1,2,3,4,5].map((star) => (
                                <span key={star} className="material-symbols-outlined text-secondary" style={{ fontSize: "12px", fontVariationSettings: star <= review.rating ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant italic">&ldquo;{review.text}&rdquo;</p>
                      </div>
                    ))}
                  </div>
                </>
              );
            })()}

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

      {/* Crop Modal */}
      {showCropModal && cropSrc && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80" onClick={() => setShowCropModal(false)} />
          <div className="relative w-full max-w-md bg-surface rounded-2xl overflow-hidden shadow-2xl border border-outline-variant">
            <div className="flex items-center justify-between px-5 py-3 border-b border-outline-variant">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Crop & Adjust Photo</h3>
              <button onClick={() => setShowCropModal(false)} className="material-symbols-outlined p-1 rounded-full hover:bg-surface-container transition-colors">close</button>
            </div>
            <div className="relative w-full bg-black" style={{ height: 320 }}>
              <Cropper image={cropSrc} crop={crop} zoom={zoom} aspect={4/3} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={(_, px) => setCroppedAreaPixels(px)} />
            </div>
            <div className="px-5 py-4 space-y-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant text-[20px]">photo_size_select_small</span>
                <input type="range" min={1} max={2} step={0.02} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="flex-1 accent-primary cursor-pointer" aria-label="Zoom" />
                <span className="material-symbols-outlined text-on-surface-variant text-[20px]">photo_size_select_large</span>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowCropModal(false)} className="flex-1 py-3 rounded-xl border border-outline-variant font-label-lg text-on-surface hover:bg-surface-container active:scale-95 transition-all cursor-pointer">Cancel</button>
                <button
                  type="button"
                  onClick={async () => {
                    if (croppedAreaPixels) {
                      const cropped = await getCroppedImg(cropSrc, croppedAreaPixels);
                      setEditImagePreview(cropped);
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

      {/* Edit Listing Modal */}
      {showEditModal && product && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowEditModal(false)} />
          <div className="relative w-full max-w-xl bg-surface rounded-2xl overflow-hidden shadow-2xl border border-outline-variant max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>edit</span>
                Edit Listing
              </h3>
              <button onClick={() => setShowEditModal(false)} className="material-symbols-outlined p-1 rounded-full hover:bg-surface-container transition-colors">close</button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4 overflow-y-auto">
              {/* Photo */}
              <div className="space-y-2">
                <span className="font-label-lg text-label-lg font-bold text-primary">Item Photo</span>
                <div className="relative w-full h-44 rounded-xl overflow-hidden border-2 border-outline-variant bg-surface-container-low group">
                  <img src={editImagePreview || product.image} alt="Preview" className="w-full h-full object-cover" />
                  <label className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <span className="material-symbols-outlined text-white text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>photo_camera</span>
                    <span className="text-white font-label-lg text-label-lg font-bold">Change Photo</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleEditImageChange} />
                  </label>
                </div>
                {editImagePreview && (
                  <button type="button" onClick={() => setEditImagePreview("")} className="text-error font-label-sm hover:underline">Remove new photo</button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="font-label-lg text-label-lg font-bold text-primary">Title <span className="text-error">*</span></label>
                  <input type="text" required value={editForm.title} onChange={(e) => setEditForm(f => ({ ...f, title: e.target.value }))} className="w-full h-11 px-4 rounded-xl border border-outline-variant bg-surface text-on-surface focus:ring-2 focus:ring-secondary font-body-md outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="font-label-lg text-label-lg font-bold text-primary">Category</label>
                  <select value={editForm.category} onChange={(e) => setEditForm(f => ({ ...f, category: e.target.value }))} className="w-full h-11 px-4 rounded-xl border border-outline-variant bg-surface text-on-surface focus:ring-2 focus:ring-secondary font-body-md outline-none">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-label-lg text-label-lg font-bold text-primary">Price ($) <span className="text-error">*</span></label>
                  <input type="number" step="0.01" min="0.01" required value={editForm.price} onChange={(e) => setEditForm(f => ({ ...f, price: e.target.value }))} className="w-full h-11 px-4 rounded-xl border border-outline-variant bg-surface text-on-surface focus:ring-2 focus:ring-secondary font-body-md outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="font-label-lg text-label-lg font-bold text-primary">Condition</label>
                  <select value={editForm.condition} onChange={(e) => setEditForm(f => ({ ...f, condition: e.target.value }))} className="w-full h-11 px-4 rounded-xl border border-outline-variant bg-surface text-on-surface focus:ring-2 focus:ring-secondary font-body-md outline-none">
                    <option value="Mint">Mint (Like New)</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair / Worn</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 pt-4">
                  <input type="checkbox" id="edit-fac" checked={editForm.isFacultyVerified} onChange={(e) => setEditForm(f => ({ ...f, isFacultyVerified: e.target.checked }))} className="w-5 h-5 rounded" />
                  <label htmlFor="edit-fac" className="font-body-sm font-semibold text-on-surface cursor-pointer select-none flex items-center gap-1">Faculty Sponsored <span className="material-symbols-outlined text-[16px] text-secondary">verified</span></label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-label-lg text-label-lg font-bold text-primary">Description <span className="text-error">*</span></label>
                <textarea required rows={3} value={editForm.description} onChange={(e) => setEditForm(f => ({ ...f, description: e.target.value }))} className="w-full p-4 rounded-xl border border-outline-variant bg-surface text-on-surface focus:ring-2 focus:ring-secondary font-body-md outline-none resize-none" />
              </div>

              <div className="flex gap-3 pt-2 border-t border-outline-variant">
                <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 py-3 rounded-xl border border-outline-variant font-label-lg text-on-surface hover:bg-surface-container active:scale-95 transition-all">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-xl bg-primary text-on-primary font-label-lg hover:opacity-90 active:scale-95 transition-all shadow-md">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reviews Modal */}
      {showReviewsModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowReviewsModal(false)} />
          <div className="relative w-full sm:max-w-lg bg-surface rounded-t-2xl sm:rounded-2xl shadow-2xl border border-outline-variant max-h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Reviews ({[...userReviews, ...(product.reviews || [])].length})</h3>
              <button onClick={() => setShowReviewsModal(false)} className="material-symbols-outlined p-1 rounded-full hover:bg-surface-container transition-colors">close</button>
            </div>

            <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
              {/* Write a Review form */}
              <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/30">
                <h4 className="font-label-lg text-label-lg text-on-surface mb-3">Write a Review</h4>
                <form onSubmit={handleSubmitReview} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Your name"
                    required
                    value={reviewForm.name}
                    onChange={(e) => setReviewForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full h-10 px-3 rounded-lg border border-outline-variant bg-surface text-on-surface font-body-md text-sm focus:ring-2 focus:ring-secondary outline-none"
                  />
                  <select
                    value={reviewForm.role}
                    onChange={(e) => setReviewForm((f) => ({ ...f, role: e.target.value }))}
                    className="w-full h-10 px-3 rounded-lg border border-outline-variant bg-surface text-on-surface font-body-md text-sm focus:ring-2 focus:ring-secondary outline-none"
                  >
                    <option>Student</option>
                    <option>Faculty</option>
                    <option>Graduate</option>
                    <option>Undergraduate</option>
                  </select>
                  {/* Star Rating */}
                  <div className="flex items-center gap-1">
                    <span className="font-body-sm text-on-surface-variant text-sm mr-1">Rating:</span>
                    {[1,2,3,4,5].map((star) => (
                      <button key={star} type="button" onClick={() => setReviewForm((f) => ({ ...f, rating: star }))}>
                        <span className="material-symbols-outlined text-secondary" style={{ fontSize: "24px", fontVariationSettings: star <= reviewForm.rating ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                      </button>
                    ))}
                  </div>
                  <textarea
                    placeholder="Share your thoughts about this item..."
                    required
                    rows={3}
                    value={reviewForm.text}
                    onChange={(e) => setReviewForm((f) => ({ ...f, text: e.target.value }))}
                    className="w-full p-3 rounded-lg border border-outline-variant bg-surface text-on-surface font-body-md text-sm focus:ring-2 focus:ring-secondary outline-none resize-none"
                  />
                  <button type="submit" className="w-full bg-primary text-on-primary py-2.5 rounded-xl font-label-lg hover:opacity-90 active:scale-95 transition-all">
                    {reviewSubmitted ? "✓ Review Submitted!" : "Submit Review"}
                  </button>
                </form>
              </div>

              {/* All reviews list */}
              {[...userReviews, ...(product.reviews || [])].map((review, i) => (
                <div key={i} className="p-4 bg-surface-container rounded-xl border border-outline-variant/10">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-sm flex-shrink-0">
                      {review.initials}
                    </div>
                    <div className="flex-1">
                      <span className="font-label-md text-label-md text-on-surface block">{review.name} · {review.role}</span>
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map((star) => (
                          <span key={star} className="material-symbols-outlined text-secondary" style={{ fontSize: "12px", fontVariationSettings: star <= review.rating ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                        ))}
                      </div>
                    </div>
                    {"date" in review && <span className="font-body-sm text-body-sm text-on-surface-variant text-xs">{(review as Review).date}</span>}
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant italic">&ldquo;{review.text}&rdquo;</p>
                </div>
              ))}

              {[...userReviews, ...(product.reviews || [])].length === 0 && (
                <p className="text-center font-body-md text-on-surface-variant py-6">No reviews yet. Be the first to review!</p>
              )}
            </div>
          </div>
        </div>
      )}

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
