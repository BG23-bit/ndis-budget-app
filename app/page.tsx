import React, { Suspense } from "react";
import Client from "./client";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white p-6">Loading…</div>}>
      <Client />
    </Suspense>
  );
}