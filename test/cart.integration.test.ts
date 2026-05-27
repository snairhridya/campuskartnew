import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST, DELETE } from "../app/api/cart/route";
import { NextRequest } from "next/server";

function makeRequest(method: string, body?: object, url = "http://localhost:3000/api/cart") {
  return new NextRequest(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
}

// Reset cart state before each test
beforeEach(async () => {
  // Clear cart by calling GET and removing all items
  const res = await GET();
  const data = await res.json();
  for (const item of data.items) {
    const req = makeRequest("DELETE", undefined, `http://localhost:3000/api/cart?id=${item.id}`);
    await DELETE(req);
  }
});

describe("Cart API Integration Tests", () => {
  it("GET /api/cart returns empty cart initially", async () => {
    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.items).toEqual([]);
    expect(data.total).toBe(0);
  });

  it("POST /api/cart adds an item to the cart", async () => {
    const req = makeRequest("POST", { id: 1, title: "MacBook Pro", price: 899 });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.message).toBe("Item added to cart");
    expect(data.cart).toHaveLength(1);
    expect(data.cart[0].title).toBe("MacBook Pro");
  });

  it("POST /api/cart returns 400 when required fields are missing", async () => {
    const req = makeRequest("POST", { title: "MacBook Pro" });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toContain("Missing required fields");
  });

  it("POST /api/cart returns 400 when price is negative", async () => {
    const req = makeRequest("POST", { id: 2, title: "Textbook", price: -10 });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("Price cannot be negative");
  });

  it("DELETE /api/cart removes an item and returns updated cart", async () => {
    // Add item first
    const addReq = makeRequest("POST", { id: 3, title: "iPad Air", price: 380 });
    await POST(addReq);

    // Then delete it
    const delReq = makeRequest("DELETE", undefined, "http://localhost:3000/api/cart?id=3");
    const res = await DELETE(delReq);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.message).toBe("Item removed from cart");
    expect(data.cart.find((i: { id: number }) => i.id === 3)).toBeUndefined();
  });

  it("DELETE /api/cart returns 404 when item does not exist", async () => {
    const req = makeRequest("DELETE", undefined, "http://localhost:3000/api/cart?id=999");
    const res = await DELETE(req);
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.error).toBe("Item not found in cart");
  });

  it("GET /api/cart calculates total correctly after adding items", async () => {
    await POST(makeRequest("POST", { id: 4, title: "Headphones", price: 210, quantity: 2 }));
    await POST(makeRequest("POST", { id: 5, title: "Desk Lamp", price: 35 }));

    const res = await GET();
    const data = await res.json();

    expect(data.total).toBe(210 * 2 + 35);
  });
});
