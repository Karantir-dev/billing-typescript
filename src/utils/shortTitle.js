export default function shortTitle(n, numberSymb = 25) {
  if (n) {
    if (n.length > numberSymb) {
      return n.substring(0, numberSymb) + '...'
    }
  }
  return n
}
