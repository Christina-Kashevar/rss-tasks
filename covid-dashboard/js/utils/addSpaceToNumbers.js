export default function addSpaceToNumbers(num) {
  const stringNumber = num.toString();
  return stringNumber.replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, `$1 `);
}
