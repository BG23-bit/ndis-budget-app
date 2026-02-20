import { Suspense } from "react";
import PageClient from "./client";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <PageClient />
    </Suspense>
  );
}