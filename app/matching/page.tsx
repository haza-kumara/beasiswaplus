import { Suspense } from "react";
import MatchingContent from "./matching-content";

export default function MatchingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 w-full flex flex-col gap-6 p-8 max-w-3xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold">
              Beasiswa yang Cocok Untukmu
            </h1>
            <p className="text-muted-foreground mt-1">
              Memuat rekomendasi beasiswa...
            </p>
          </div>
        </div>
      }
    >
      <MatchingContent />
    </Suspense>
  );
}