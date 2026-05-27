"use client";

import { useState } from "react";

const CATEGORIES = ["Textbooks", "Tech", "Dorm Life", "Bikes", "Clothing"];
const CONDITIONS = ["New", "Used - Excellent", "Used - Good"];

const PRODUCTS = [
  {
    id: 1,
    title: "Organic Chemistry, 8th Ed",
    author: "McMurry • Like new",
    specs: "ISBN: 978-1305080485. Minimal highlighting, clean edges.",
    price: 45.0,
    condition: "USED-EXCELLENT",
    location: "Main Campus Library Hub",
    verified: true,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCv-xz4BjOxBPQmvA3buw4cnJ6xxZXtCGVGI5CJNRjhBPJPSSxr58o20RXiRYQujG1abIV_PzDSB7Bjydurj--ZacMhX3vzi8_k0EEtYHetXvmxy-DG03uihMZ7XUpVB4ibjcWbUsfsvr8w1znSWfozW7Xr9ERYzxkfn5MR8GnGyGpi1vRKjDgktVJPVhhHcUOxgRwrjheefwVQFDSnKslnAt09JjYTHJc2KuFystwdW4GFhkmLspMzg_qm_9ZaVbW9LlGrZ_nrkeU",
  },
  {
    id: 2,
    title: "Microeconomics 10th Ed",
    author: "Pindyck & Rubinfeld",
    specs: "ISBN: 978-0134407623. Minor wear on the corners.",
    price: 32.0,
    condition: "USED-GOOD",
    location: "Student Union North",
    verified: false,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBq4VUUlCnyjomytft1sG6jNbUOQEkdkhcXx9MkOKW3z-87O6MAGpjxGx8UX892PDnIF8ShA56RtC56vc7XzBrnIy2Sp58HqU1Kc2LXv1xYUD-tGfEthn5IBwIAbgtwRqurJ2uPo7V7rklqQty5nQDmI8S1JmwQSRyHnuKuVc5CrBKciMAR3s6tbqwByH2exuYXZRK-GBvTGvvXzdJ2aCqfi_cmL3uwOB0suFZYUE7HxgJFoUSLrdSzfDj2ucnouxCc9-T3FDPhqn4",
  },
  {
    id: 3,
    title: "Calc III: Multivariable",
    author: "Stewart • Brand new",
    specs: "ISBN: 978-1285741550. Still in plastic wrap.",
    price: 75.0,
    condition: "NEW",
    location: "Engineering Quad",
    verified: false,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBljf00W3LPEYZbOGDWKMMWNMomHTaV4l5E---QrdAFrAvg_Tpi5b1p3d6NSKaduRFTzxPvWEb6irui3wWFdAuRt0_U5sQt3QhJYGWBEvquXpAJboLKlggFCD3FRXBF_Z90nBfmLJAw8WFX5ZsuV-JuPo3VyT13fbEu-YStK8BQcf6F4ut2rTvURQ8NNPiSAxz2j5eW9asmP1EIF9zVCcplMtchOA44aZaTbSRgkJf0zx1pfoBvO7rk70PRlvNOrk9AYrE36GcLquQ",
  },
  {
    id: 4,
    title: "Intro to Psychology",
    author: "Myers • Required for 101",
    specs: "ISBN: 978-1319050627. No marks or highlights.",
    price: 28.0,
    condition: "USED-EXCELLENT",
    location: "Arts & Sciences Hub",
    verified: true,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCmCTXX0MeH_H_44bKmeGONaWIVGmN1QrmJlcNFVM7VUMEGA8WrsYydg1gFdiLMpRKRRTAKYxSt2cRfubJ5x1PwxNNMVOTIZoLSZ9W0Mcqz3y-OqWVpUXUef6S2iMKlA7wuXIId2k9UYcKypfxilgqSjXWsMSfQV835n9fQ_5tBwN06psuERSTAIMzrjCI6pj24k-fW3AHccBp7dKntEJn8HTVQvKmOEgIEmaCPaxEq7Zc-hrneT4QSC4uN3kcmWsWuBTNAr3OUIN0",
  },
  {
    id: 5,
    title: "Anthology of Literature",
    author: "Norton • Volume A",
    specs: "ISBN: 978-0393603125. Significant highlighting in first 3 chapters.",
    price: 18.0,
    condition: "USED-GOOD",
    location: "Graduate Lounge",
    verified: false,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDIdtXvbhRhlBH2FZuhcw_-bdjs5pKMaDMXVw0IWUqlaH-uWnH8JAYiXw2Twzl0fq_AFaol0HTpOj94S4XfkUCiHo9NZ6RJKCRZIxIbO7N6t9_G5XSwqCU7lSKqFpXTQKoDL4puOO4SVWCQ7pd86gXwdrbU-yQfxCZaeWs0whK-EWlVdUm6fcuyHCS1YXoLw_ZPG2-lWYn_IuqJce77-EOqrLnfPJvL-5sBCMPBEluSAv5Uj5Se7Do7Qa8aeVsoCFM4_C5t_44lUl8",
  },
  {
    id: 6,
    title: "Architectural Systems",
    author: "Allen • Like new",
    specs: "ISBN: 978-1118986837. Includes unredeemed digital code.",
    price: 55.0,
    condition: "USED-EXCELLENT",
    location: "Design Studio Dock",
    verified: true,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDXWqQVZj8AVv5voll3qQMdgV2NUH4SlmIKr2-JUJjee6hDXd4BobdAaN7DJKr9VPDOeDI2Ody7HCWOo110u4tJQASxTY9K8iqKxrcoejP1ACzq0VT6t9lEUcdjHC1G4WIORpJcRPZzK3Fotl5249qAJPwMgfQvJhNO6aHMxakZJRuymoj88-zdHx5EdeyxUNwF3NpSSUot9W9AJBRJqRYS7hMBwIMtxVKs-8sq9li7Gfp4nCRMOyrVmxxzt11exhTmu7hfnBmdPmQ",
  },
];

export default function SearchPage() {
  const [facultyVerified, setFacultyVerified] = useState(false);
  const [sortBy, setSortBy] = useState("Most Recent");

  return (
    <>
      {/* Skip to main content — first focusable element for keyboard/screen-reader users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[200] focus:bg-primary focus:text-on-primary focus:px-4 focus:py-2 focus:rounded-lg focus:font-label-lg"
      >
        Skip to main content
      </a>

      {/* Top Nav */}
      <header className="bg-surface border-b border-outline-variant shadow-sm z-50 sticky top-0" role="banner">
        <div className="flex justify-between items-center w-full px-4 md:px-16 py-3 max-w-7xl mx-auto">
          <div className="flex items-center gap-6">
            <a href="/" className="font-headline-sm text-headline-sm font-bold text-primary" aria-label="CampusKart home">
              CampusKart
            </a>
            <nav aria-label="Primary navigation" className="hidden md:flex gap-6 items-center">
              <a href="/" className="text-on-surface-variant font-body-md hover:text-primary transition-colors">Shop</a>
              <a href="#" className="text-on-surface-variant font-body-md hover:text-primary transition-colors">Sell</a>
            </nav>
          </div>

          <div role="search" className="flex-1 max-w-md mx-8 hidden lg:block">
            <label htmlFor="site-search" className="sr-only">Search campus marketplace</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]" aria-hidden="true">search</span>
              <input
                id="site-search"
                type="search"
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-full py-2 pl-10 pr-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-md"
                placeholder="Search textbooks, tech, bikes..."
                defaultValue="Textbooks"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors"
              aria-label="Notifications"
            >
              <span className="material-symbols-outlined" aria-hidden="true">notifications</span>
            </button>
            <button
              className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors"
              aria-label="Saved items"
            >
              <span className="material-symbols-outlined" aria-hidden="true">favorite</span>
            </button>
            <button
              className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors"
              aria-label="Shopping cart"
            >
              <span className="material-symbols-outlined" aria-hidden="true">shopping_cart</span>
            </button>
            <button
              className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center border border-outline-variant cursor-pointer active:scale-95 transition-transform overflow-hidden"
              aria-label="View your profile"
            >
              <span className="material-symbols-outlined text-on-primary-container text-[20px]" aria-hidden="true">account_circle</span>
            </button>
          </div>
        </div>
      </header>

      <main id="main-content" className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-16 py-8">

        {/* Breadcrumb + heading */}
        <div className="mb-8 border-b border-outline-variant pb-4">
          <nav aria-label="Breadcrumb" className="flex text-on-surface-variant text-label-md mb-2 items-center gap-2">
            <a href="/" className="hover:text-primary transition-colors">Marketplace</a>
            <span aria-hidden="true" className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span aria-current="page" className="text-primary font-semibold">Textbooks</span>
          </nav>
          <h1 className="font-headline-md text-headline-md text-primary-container">
            Search Results for &ldquo;Textbooks&rdquo;
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-6">

          {/* Sidebar Filters */}
          <aside aria-label="Search filters" className="w-full md:w-64 flex-shrink-0 space-y-8">

            {/* Category filter */}
            <fieldset>
              <legend className="font-label-lg text-label-lg text-primary-container mb-3 uppercase tracking-wider">
                Category
              </legend>
              <div className="space-y-2">
                {CATEGORIES.map((cat) => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      defaultChecked={cat === "Textbooks"}
                      className="rounded border-outline-variant text-primary focus:ring-primary focus:ring-2"
                      aria-label={`Filter by ${cat}`}
                    />
                    <span className={`font-body-md transition-colors ${cat === "Textbooks" ? "text-primary font-semibold" : "text-on-surface-variant group-hover:text-primary"}`}>
                      {cat}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Price range filter */}
            <fieldset>
              <legend className="font-label-lg text-label-lg text-primary-container mb-3 uppercase tracking-wider">
                Price Range
              </legend>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <label htmlFor="price-min" className="sr-only">Minimum price</label>
                  <input
                    id="price-min"
                    type="number"
                    min={0}
                    className="bg-surface-container border border-outline-variant rounded px-2 py-1 text-body-sm w-full outline-none focus:border-primary focus:ring-2 focus:ring-primary transition-colors"
                    placeholder="Min $"
                    aria-label="Minimum price"
                  />
                </div>
                <div>
                  <label htmlFor="price-max" className="sr-only">Maximum price</label>
                  <input
                    id="price-max"
                    type="number"
                    min={0}
                    className="bg-surface-container border border-outline-variant rounded px-2 py-1 text-body-sm w-full outline-none focus:border-primary focus:ring-2 focus:ring-primary transition-colors"
                    placeholder="Max $"
                    aria-label="Maximum price"
                  />
                </div>
              </div>
              <label htmlFor="price-range" className="sr-only">Price range slider</label>
              <input id="price-range" type="range" className="w-full accent-primary" aria-label="Adjust price range" />
            </fieldset>

            {/* Condition filter */}
            <fieldset>
              <legend className="font-label-lg text-label-lg text-primary-container mb-3 uppercase tracking-wider">
                Condition
              </legend>
              <div className="space-y-2">
                {CONDITIONS.map((cond) => (
                  <label key={cond} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="condition"
                      className="border-outline-variant text-primary focus:ring-primary focus:ring-2"
                      aria-label={`Condition: ${cond}`}
                    />
                    <span className="font-body-md text-on-surface-variant group-hover:text-primary transition-colors">{cond}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Faculty Verified toggle */}
            <div className="p-4 bg-surface-container border border-secondary rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="font-label-lg text-secondary font-bold" id="faculty-verified-label">
                  Faculty Verified
                </span>
                <button
                  role="switch"
                  aria-checked={facultyVerified}
                  aria-labelledby="faculty-verified-label"
                  onClick={() => setFacultyVerified((v) => !v)}
                  className={`relative w-11 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 ${facultyVerified ? "bg-secondary" : "bg-surface-container-high"}`}
                >
                  <span
                    className={`absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full shadow transition-transform ${facultyVerified ? "translate-x-5" : "translate-x-0"}`}
                  />
                  <span className="sr-only">{facultyVerified ? "Disable" : "Enable"} faculty verified filter</span>
                </button>
              </div>
              <p className="text-[11px] text-on-surface-variant font-body-sm">
                Show items verified by university faculty members.
              </p>
            </div>
          </aside>

          {/* Results */}
          <section aria-label="Search results" className="flex-1">

            {/* Sort bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3 bg-surface-container-lowest p-3 rounded border border-outline-variant shadow-sm">
              <p className="font-body-md text-on-surface-variant px-2">
                <span className="font-bold text-primary">124</span> items found
              </p>
              <div className="flex items-center gap-3 px-2">
                <label htmlFor="sort-select" className="text-label-md text-on-surface-variant whitespace-nowrap">
                  Sort by:
                </label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent border-none font-label-lg text-primary focus:ring-2 focus:ring-primary rounded cursor-pointer"
                >
                  <option>Most Recent</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Relevance</option>
                </select>
              </div>
            </div>

            {/* Product grid */}
            <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" aria-label="Textbook listings">
              {PRODUCTS.map((product) => (
                <li key={product.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden flex flex-col group hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
                  <div className="relative aspect-[4/3] overflow-hidden bg-surface-container">
                    <img
                      src={product.image}
                      alt={`${product.title} — ${product.author}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.verified ? (
                      <div className="absolute top-2 right-2">
                        <span className="bg-secondary text-on-secondary-fixed font-label-md text-[10px] px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
                          <span className="material-symbols-outlined text-[12px]" aria-hidden="true" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                          FACULTY VERIFIED
                        </span>
                      </div>
                    ) : (
                      <div className="absolute top-2 right-2">
                        <span className="bg-primary-container text-on-primary font-label-md text-[10px] px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
                          <span className="material-symbols-outlined text-[12px]" aria-hidden="true">person</span>
                          STUDENT SELLER
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex flex-col flex-1">
                    <div className="mb-2">
                      <h2 className="font-headline-sm text-[18px] leading-snug text-primary-container">
                        {product.title}
                      </h2>
                      <p className="font-body-sm text-on-surface-variant mt-0.5">{product.author}</p>
                    </div>

                    <div className="mt-1 space-y-1">
                      <h3 className="text-[10px] font-bold text-primary uppercase tracking-tighter">Item Specifications</h3>
                      <p className="text-[12px] text-on-surface-variant line-clamp-2">{product.specs}</p>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="font-headline-sm text-headline-sm text-primary" aria-label={`Price: $${product.price.toFixed(2)}`}>
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="bg-surface-container-high text-on-surface-variant font-label-md px-2 py-0.5 rounded text-[11px]">
                        {product.condition}
                      </span>
                    </div>

                    <div className="mt-4 space-y-3">
                      <button
                        className="w-full py-2 bg-primary text-on-primary rounded font-label-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors flex items-center justify-center gap-2"
                        aria-label={`Message seller about ${product.title}`}
                      >
                        <span className="material-symbols-outlined text-[18px]" aria-hidden="true">mail</span>
                        Message Seller
                      </button>
                      <div className="flex items-center gap-2 text-[12px] text-on-surface-variant">
                        <span className="material-symbols-outlined text-[16px]" aria-hidden="true">location_on</span>
                        <span>{product.location}</span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Pagination */}
            <nav aria-label="Search results pagination" className="mt-8 flex justify-center items-center gap-2">
              <button
                className="w-10 h-10 flex items-center justify-center border border-outline-variant rounded-full text-on-surface-variant hover:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                aria-label="Previous page"
              >
                <span className="material-symbols-outlined" aria-hidden="true">chevron_left</span>
              </button>
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  className={`w-10 h-10 flex items-center justify-center rounded-full font-bold focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${page === 1 ? "bg-primary text-on-primary" : "border border-outline-variant text-on-surface-variant hover:bg-surface-container-high"}`}
                  aria-label={`Page ${page}`}
                  aria-current={page === 1 ? "page" : undefined}
                >
                  {page}
                </button>
              ))}
              <span aria-hidden="true" className="px-2 text-on-surface-variant">...</span>
              <button
                className="w-10 h-10 flex items-center justify-center border border-outline-variant rounded-full text-on-surface-variant hover:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                aria-label="Page 12"
              >
                12
              </button>
              <button
                className="w-10 h-10 flex items-center justify-center border border-outline-variant rounded-full text-on-surface-variant hover:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                aria-label="Next page"
              >
                <span className="material-symbols-outlined" aria-hidden="true">chevron_right</span>
              </button>
            </nav>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 px-4 md:px-16 grid grid-cols-1 md:grid-cols-2 gap-6 bg-primary-container mt-8" role="contentinfo">
        <div className="flex flex-col justify-between">
          <div>
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-primary mb-3">CampusKart</h2>
            <p className="font-body-sm text-on-primary opacity-80 max-w-sm">
              The premium academic marketplace for students and faculty. Secure, verified, and community-driven.
            </p>
          </div>
          <p className="font-body-sm text-on-primary opacity-60 mt-6">
            &copy; 2025 CampusKart. All University IDs and transactions are Faculty Verified.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <nav aria-label="Support links">
            <h3 className="font-label-md text-label-md text-secondary-fixed font-bold uppercase tracking-widest mb-2">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-on-primary opacity-80 hover:opacity-100 text-body-sm transition-opacity">Campus Safety</a></li>
              <li><a href="#" className="text-on-primary opacity-80 hover:opacity-100 text-body-sm transition-opacity">Textbook Buyback</a></li>
              <li><a href="#" className="text-on-primary opacity-80 hover:opacity-100 text-body-sm transition-opacity">Student Services</a></li>
            </ul>
          </nav>
          <nav aria-label="Legal links">
            <h3 className="font-label-md text-label-md text-secondary-fixed font-bold uppercase tracking-widest mb-2">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-on-primary opacity-80 hover:opacity-100 text-body-sm transition-opacity">Terms of Service</a></li>
              <li><a href="#" className="text-on-primary opacity-80 hover:opacity-100 text-body-sm transition-opacity">Privacy Policy</a></li>
              <li><a href="#" className="text-on-primary opacity-80 hover:opacity-100 text-body-sm transition-opacity">Faculty Resources</a></li>
            </ul>
          </nav>
        </div>
      </footer>

      {/* FAB */}
      <button
        className="fixed bottom-8 right-8 bg-secondary-container text-on-secondary-container shadow-lg flex items-center gap-2 px-6 py-4 rounded-full font-label-lg hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 transition-all z-40"
        aria-label="List a new item for sale"
      >
        <span className="material-symbols-outlined" aria-hidden="true">add</span>
        List an Item
      </button>
    </>
  );
}
