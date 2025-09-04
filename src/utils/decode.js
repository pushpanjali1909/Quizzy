export function decodeHTMLEntities(str) {
  const el = document.createElement("textarea");
  el.innerHTML = str;
  return el.value;
}
