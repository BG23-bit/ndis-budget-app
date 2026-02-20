import Stripe from "stripe";
import { NextResponse } from "next/server";

// IMPORTANT: Stripe requires Node runtime (not Edge)
export const runtime = "nodejs";

// Read secret key from env
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY env var");
}

// Initialise Stripe (NO apiVersion to avoid TS errors)
const stripe = new Stripe(stripeSecretKey);

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "aud",
            product_data: {
              name: "NDIS Budget Calculator – Lifetime Access",
            },
            unit_amount: 4999, // $49.99 AUD
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/?success=true`,
      cancel_url: `${baseUrl}/?canceled=true`,
      metadata: {
        userId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe checkout error:", err);

    return NextResponse.json(
      { error: err?.message || "Checkout error" },
      { status: 500 }
    );
  }
}