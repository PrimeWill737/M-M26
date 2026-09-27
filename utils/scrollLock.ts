let locks = 0;

export function lockPageScroll() {
  locks += 1;
  document.body.style.overflow = "hidden";
  return () => {
    locks = Math.max(0, locks - 1);
    if (locks === 0) document.body.style.overflow = "";
  };
}
