const STORAGE_KEY = "china_abdulaziz_products";

function getProducts() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveProducts(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

function addProduct(product) {
  const products = getProducts();

  product.id = Date.now();

  products.push(product);

  saveProducts(products);
}

function deleteProduct(id) {
  const products = getProducts();

  saveProducts(products.filter((product) => product.id !== id));
}
