export function getCreditCardType(num: string): string {
  let cardType;
  if (/^5[1-5]/.test(num)) {
    cardType = 'MasterCard';
  } else if (/^4/.test(num)) {
    cardType = 'Visa';
  } else if (/^3[47]/.test(num)) {
    cardType = 'American Express';
  } else if (
    /^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)/.test(
      num
    )
  ) {
    cardType = 'Discover';
  } else {
    cardType = 'Visa';
  }
  return cardType;
}
