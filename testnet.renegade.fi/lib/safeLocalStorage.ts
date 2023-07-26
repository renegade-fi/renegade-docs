// TODO: Currently causes hydration mismatch if safe local storage is used
export function safeLocalStorageGetItem(key: string): string | null {
  return localStorage.getItem(key)
  // if (typeof window !== "undefined") {
  //   return localStorage.getItem(key)
  // }
  // return null
}

export function safeLocalStorageSetItem(key: string, value: string): void {
  localStorage.setItem(key, value)
  // if (typeof window !== "undefined") {
  //   localStorage.setItem(key, value)
  // }
}
