function validateWebsite(url) {
  if (!url) return true;
  const a = url.toLocaleLowerCase();
  return a.startsWith('http');
}

export default validateWebsite;
