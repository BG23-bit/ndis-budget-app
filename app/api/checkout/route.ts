import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    // ✅ IMPORTANT: do NOT read env vars or create Stripe client at module scope.
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      // ✅ No throw (throws can crash build). Return JSON instead.
      return NextResponse.json(
        { error: "Missing STRIPE_SECRET_KEY env var" },
        { status: 500 }
      );
    }

    const stripe = new Stripe(stripeSecretKey);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // If you're not using auth yet, we don't require userId here.
    // Keep it simple so build + deploy succeeds.
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "aud",
            product_data: { name: "NDIS Budget Calculator – Lifetime Access" },
            unit_amount: 4999,
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/?success=1`,
      cancel_url: `${baseUrl}/?canceled=1`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: err?.message || "Checkout error" },
      { status: 500 }
    );
  }
}
