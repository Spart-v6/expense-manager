const formatNumberWithCurrency = (number, currency) => {
  const isNegative = +number < 0;
  const absoluteValue = Math.abs(+number).toLocaleString("en-IN");
  let formattedNumber = currency + absoluteValue;
  if (isNegative) formattedNumber = "-" + formattedNumber;
  return formattedNumber;
};

export default formatNumberWithCurrency;
