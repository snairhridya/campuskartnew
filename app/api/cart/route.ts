import { NextRequest, NextResponse } from "next/server";

interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
}

const cart: CartItem[] = [];

export async function GET() {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return NextResponse.json({ items: cart, total });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { id, title, price, quantity = 1 } = body;

  if (!id || !title || price === undefined) {
    return NextResponse.json({ error: "Missing required fields: id, title, price" }, { status: 400 });
  }

  if (price < 0) {
    return NextResponse.json({ error: "Price cannot be negative" }, { status: 400 });
  }

  const existing = cart.find((item) => item.id === id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ id, title, price, quantity });
  }

  return NextResponse.json({ message: "Item added to cart", cart }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));

  if (!id) {
    return NextResponse.json({ error: "Missing item id" }, { status: 400 });
  }

  const index = cart.findIndex((item) => item.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Item not found in cart" }, { status: 404 });
  }

  cart.splice(index, 1);
  return NextResponse.json({ message: "Item removed from cart", cart });
}
