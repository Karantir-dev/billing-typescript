export default function isDisabledDedicTariff(name: string) {
  return (
    name?.includes('Config 47') ||
    name?.includes('Config 48') ||
    name?.includes('[NL] Intel 2xL5630 / 32GB RAM / 2x300GB SSD') ||
    name?.includes('[NL] Intel 2xL5630 / 32GB RAM / 2x240GB SSD') ||
    name?.includes('[NL] Intel 2xL5640 / 64GB RAM / 2x600GB SSD')
  )
}
