import { H as defineStore } from './server.mjs';

const API_KEY = "AKfycbxsmJ6CWp-ffRH_YOu1n2eB-JVDvE-gc4OQSGJ6jYx2XPNsveut7C4NmfDiRGwthTQoXg";
const API_URL = `https://script.google.com/macros/s/${API_KEY}/exec`;
const useStore = defineStore("store", {
  state: () => ({
    cart: {},
    isLoading: false,
    products: {},
    tmpProduct: null,
    tmpProductName: null,
    tmpOptionIndex: -1,
    cartCount: 1,
    apiURL: API_URL
  }),
  actions: {
    addToCart(productName, options, count) {
      if (options === -1)
        options = 0;
      if (this.cart[`${productName}`]) {
        if (this.cart[`${productName}`][options]) {
          this.cart[`${productName}`][options] += count;
        } else {
          this.cart[`${productName}`][options] = count;
        }
      } else {
        this.cart[`${productName}`] = {
          [options]: count
        };
      }
    },
    removeFromCart(productName, options) {
      console.log(productName, options);
      if (this.cart[`${productName}`]) {
        if (this.cart[`${productName}`][options]) {
          delete this.cart[`${productName}`][options];
        }
        if (Object.keys(this.cart[`${productName}`]).length === 0) {
          delete this.cart[`${productName}`];
        }
      }
    },
    async getProductsFromAPI() {
      await fetch(`${API_URL}`).then(async (res) => {
        this.products = await res.json();
      });
    },
    async getProductFromAPI(productName) {
      await fetch(`${API_URL}?name=${productName}`).then(async (res) => {
        this.tmpProduct = await res.json();
        if (!this.tmpProduct || !this.tmpProduct.price || !this.tmpProduct.price.min)
          return false;
        return true;
      }).catch((err) => {
        console.error(err);
      });
      return false;
    },
    goToProduct(productName) {
      this.tmpProduct = this.products[`${productName}`];
    },
    resetTmpObjectIndex() {
      this.tmpOptionIndex = -1;
    },
    resetCartCount() {
      this.cartCount = 1;
    }
  },
  getters: {
    getTotal() {
      let total = 0;
      for (const productName in this.cart) {
        for (const option in this.cart[productName]) {
          if (this.products[productName].options.length === 0) {
            total += this.cart[productName][option] * this.products[productName].price.min;
          } else {
            total += this.cart[productName][option] * (this.products[productName].options[option].price || this.products[productName].price.min);
          }
        }
      }
      return total;
    },
    getCartCount() {
      let count = 0;
      for (const productName in this.cart) {
        count += Object.keys(this.cart[productName]).length;
      }
      return count;
    },
    getProducts() {
      return this.products;
    },
    getProduct() {
      return this.products[`${this.tmpProductName}`] || null;
    }
  },
  persist: {
    paths: ["cart"]
  }
});

export { useStore as u };
//# sourceMappingURL=index-p1Z-8VrX.mjs.map
