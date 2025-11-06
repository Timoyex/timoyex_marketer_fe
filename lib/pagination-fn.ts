import { useState } from "react";

export function useCursorPagination() {
  const [cursor, setCursor] = useState<string | null>(null);

  const goNext = (nextCursor: string) => {
    setCursor(nextCursor);
  };

  const goPrev = (prevCursor: string) => {
    setCursor(prevCursor);
  };

  const reset = () => {
    setCursor(null);
  };

  return {
    cursor,
    goNext,
    goPrev,
    reset,
  };
}
