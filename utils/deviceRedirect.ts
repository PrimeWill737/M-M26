export function deviceUrl(
  links: { website: string; android: string; ios: string },
  userAgent: string,
  touchPoints = 0,
) {
  if (/android/i.test(userAgent)) return links.android || links.website;
  if (
    /iPad|iPhone|iPod/i.test(userAgent) ||
    (/Macintosh/i.test(userAgent) && touchPoints > 1)
  )
    return links.ios || links.website;
  return links.website;
}
