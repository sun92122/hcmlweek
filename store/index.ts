import { defineStore, createPinia } from "pinia";
import Product from "~/pages/product/[product].vue";

const API_KEY =
  "AKfycbwZtfLjvI7jhdgbcJLUDVPp4ca3Xs2kQzv1phs_ZKhJjcpvd2wu5aWyGMZ1xEZJY8Qf9g";
const API_URL = `https://script.google.com/macros/s/${API_KEY}/exec`;
// "https://script.google.com/macros/s/AKfycbxsmJ6CWp-ffRH_YOu1n2eB-JVDvE-gc4OQSGJ6jYx2XPNsveut7C4NmfDiRGwthTQoXg/exec";
interface Product {
  price: {
    ori: number | null;
    max: number | null;
    min: number;
  };
  noted: string;
  image: string;
  options: {
    name: string | null;
    price: number | null;
    tag: string | null;
  }[];
  description: string | null;
  tags: string[] | null;
}

interface Products {
  [key: string]: Product;
}

interface Cart {
  [key: string]: {
    [key: number]: number;
  };
}

interface State {
  cart: Cart;
  isLoading: boolean;
  products: Products;
  tmpProduct: Product | null;
  tmpProductName: string | null;
  tmpOptionIndex: number;
  cartCount: number;
  apiURL: string;
}

export const useStore = defineStore("store", {
  state: () =>
    ({
      cart: {},
      isLoading: false,
      products: {} as Products,
      tmpProduct: null as Product | null,
      tmpProductName: null as string | null,
      tmpOptionIndex: -1,
      cartCount: 1,
      apiURL: API_URL,
    } as unknown as State),
  actions: {
    addToCart(productName: string, options: number, count: number) {
      if (options === -1) options = 0;
      if (this.cart[`${productName}`]) {
        if (this.cart[`${productName}`][options]) {
          this.cart[`${productName}`][options] += count;
        } else {
          this.cart[`${productName}`][options] = count;
        }
      } else {
        this.cart[`${productName}`] = {
          [options]: count,
        };
      }
    },
    removeFromCart(productName: string, options: number) {
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
      // API_URL/getProducts => (json) => products
      await fetch(`${API_URL}`).then(async (res) => {
        this.products = await res.json();
      });
    },
    async getProductFromAPI(productName: string) {
      // API_URL/getProduct?name=productName => (json) => product
      await fetch(`${API_URL}?name=${productName}`)
        .then(async (res) => {
          this.tmpProduct = await res.json();
          if (
            !this.tmpProduct ||
            !this.tmpProduct.price ||
            !this.tmpProduct.price.min
          )
            return false;
          return true;
        })
        .catch((err) => {
          console.error(err);
        });
      return false;
    },
    goToProduct(productName: string) {
      this.tmpProduct = this.products[`${productName}`];
    },
    resetTmpObjectIndex() {
      this.tmpOptionIndex = -1;
    },
    resetCartCount() {
      this.cartCount = 1;
    },
  },
  getters: {
    getTotal() {
      let total = 0;
      for (const productName in this.cart) {
        for (const option in this.cart[productName]) {
          if (this.products[productName].options.length === 0) {
            total +=
              this.cart[productName][option] *
              this.products[productName].price.min;
          } else {
            total +=
              this.cart[productName][option] *
              (this.products[productName].options[option].price ||
                this.products[productName].price.min);
          }
        }
      }
      return total;
    },
    getCartCount(): number {
      let count = 0;
      for (const productName in this.cart) {
        count += Object.keys(this.cart[productName]).length;
      }
      return count;
    },
    getProducts(): Products {
      return this.products;
    },
    getProduct(): Product | null {
      return this.products[`${this.tmpProductName}`] || null;
    },
  },
  persist: {
    paths: ["cart"],
  },
});
