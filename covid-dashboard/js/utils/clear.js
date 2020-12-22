export default function clear(target) {
  while (target.children.length) {
    target.removeChild(target.lastChild);
  }
}
