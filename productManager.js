const fs = require("fs");
const path = require("path");

class ProductManager {
  constructor(filePath) {
    this.filePath = filePath;
    this.products = this.readProducts();
  }

  readProducts() {
    try {
      const data = fs.readFileSync(this.filePath, "utf8");
      return JSON.parse(data);
    } catch (error) {
      if (error.code === "ENOENT") {
        console.error("File not found, creating a new one.");
        this.products = [];
        this.writeProducts();
        return this.products;
      } else {
        throw error;
      }
    }
  }

  writeProducts() {
    try {
      fs.writeFileSync(
        this.filePath,
        JSON.stringify(this.products, null, 2),
        "utf8"
      );
    } catch (error) {
      throw error;
    }
  }

  _getNewProductId() {
    return this.products.length > 0
      ? Math.max(...this.products.map((p) => p.id)) + 1
      : 1;
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    if (this.products.some((product) => product.code === code)) {
      throw new Error("Product code already exists");
    }

    const newProduct = {
      id: this._getNewProductId(),
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    this.products.push(newProduct);
    this.writeProducts();
  }

  getProductById(id) {
    return this.products.find((product) => product.id === id) || null;
  }

  getProducts() {
    return this.products;
  }

  updateProduct(id, updatedProduct) {
    const index = this.products.findIndex((product) => product.id === id);
    if (index === -1) {
      throw new Error("Product not found");
    }

    this.products[index] = { ...this.products[index], ...updatedProduct };
    this.writeProducts();
  }

  deleteProduct(id) {
    const index = this.products.findIndex((product) => product.id === id);
    if (index === -1) {
      throw new Error("Product not found");
    }

    this.products.splice(index, 1);
    this.writeProducts();
  }
}

module.exports = ProductManager;
