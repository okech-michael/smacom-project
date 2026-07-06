export function reportError(error: unknown) {
  if (typeof window === "undefined") return;
  console.error("Unhandled application error", error);
}
