export function getProductImage(
  productId: string,
  productTitle: string
): string {
  console.log(productId, productTitle);
  return "/images/default-product.png";
}

export function getProductImageAlt(productTitle: string): string {
  return `${productTitle} - Health supplement product`;
}
