function importAll(r) {
  return r.keys().map(r);
}

const images = importAll(require.context('../assets/', false, /\.(png|jpe?g|svg)$/));

export default images;
