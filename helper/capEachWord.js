const capitalizeSentence = sentence => {
  const words = sentence.split(" ");
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  );
  const capitalizedSentence = capitalizedWords.join(" ");
  return capitalizedSentence;
}

export default capitalizeSentence;