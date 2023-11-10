function validatePasswordMatch(a, b) {
  let match = true;
  if (a.length > 0 && b.length > 0 && a !== b) match = false;
  return match;
}

export default validatePasswordMatch;
