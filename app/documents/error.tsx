"use client"

import { ErrorPanel } from "@/components/ui/error-panel"

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return <ErrorPanel reset={reset} />
}
