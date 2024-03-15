import { defineStore, createPinia } from "pinia";
import Product from "~/pages/product/[product].vue";

// read from .env
const API_KEY = process.env.API_KEY;
const API_URL = `https://script.google.com/macros/s/${API_KEY}/exec`;
// e.g., "https://script.google.com/macros/s/AKfycbxsmJ6CWp-ffRH_YOu1n2eB-JVDvE-gc4OQSGJ6jYx2XPNsveut7C4NmfDiRGwthTQoXg/exec";
interface Product {
  price: {
    ori: number | null;
    max: number | null;
    min: number;
  };
  noted: string;
  image: string;
  description: string[] | null;
  tags: string[] | null;
  options: {
    name: string | null;
    price: number | null;
    tag: string | null;
  }[];
}

interface Products {
  [key: string]: Product;
}

interface Cart {
  [key: string]: {
    [key: number]: number;
  };
}

interface Tag {
  label: string;
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
  nowTag: string;
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
      nowTag: "所有商品",
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
    addOneToCart(productName: string, options: number) {
      if (options === -1) options = 0;
      if (this.cart[`${productName}`]) {
        if (this.cart[`${productName}`][options]) {
          this.cart[`${productName}`][options]++;
        } else {
          this.cart[`${productName}`][options] = 1;
        }
      } else {
        this.cart[`${productName}`] = {
          [options]: 1,
        };
      }
    },
    minusOneToCart(productName: string, options: number) {
      if (options === -1) options = 0;
      if (this.cart[`${productName}`]) {
        if (this.cart[`${productName}`][options]) {
          this.cart[`${productName}`][options]--;
          if (this.cart[`${productName}`][options] === 0) {
            delete this.cart[`${productName}`][options];
          }
          if (Object.keys(this.cart[`${productName}`]).length === 0) {
            delete this.cart[`${productName}`];
          }
        }
      }
    },
    goToProduct(productName: string) {
      this.tmpProduct = this.products[`${productName}`];
    },
    resetTmpObjectIndex() {
      this.tmpOptionIndex = -1;
    },
    setNowTag(tag: string) {
      this.nowTag = tag;
    },
  },
  getters: {
    getTotal() {
      let total = 0;
      for (const productName in this.cart) {
        if (!this.products[productName]) continue;
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
    getCart(): Cart {
      return this.cart;
    },
    getTags(): Tag[] {
      const tags: string[] = [];
      for (const productName in this.products) {
        const productTags = this.products[productName].tags;
        if (
          productTags &&
          Array.isArray(productTags) &&
          productTags.length > 0
        ) {
          for (const tag of productTags) {
            if (tag.trim().length === 0) continue;
            if (!tags.includes(tag)) {
              tags.push(tag);
            }
          }
        }
      }
      const outputTags: Tag[] = [];
      outputTags.push({ label: "所有商品" });
      for (const tag of tags) {
        outputTags.push({ label: tag });
      }
      return outputTags;
    },
    getNowTag(): string {
      return this.nowTag;
    },
    getPickupInfo(): string {
      const tempInfo: any = { 週後取貨: [] };
      tempInfo.週後取貨 = [];
      for (const productName in this.cart) {
        for (const option in this.cart[productName]) {
          if (this.products[productName].options.length === 0) {
            tempInfo.週後取貨.push(
              `${productName} x${this.cart[productName][option]}`
            );
          } else if (this.products[productName].options[option].tag === null) {
            tempInfo.週後取貨.push(
              `${productName} - ${this.products[productName].options[option].name} x${this.cart[productName][option]}`
            );
          } else {
            if (
              !tempInfo[`${this.products[productName].options[option].tag}`]
            ) {
              tempInfo[`${this.products[productName].options[option].tag}`] =
                [];
            }
            tempInfo[`${this.products[productName].options[option].tag}`].push(
              `${productName} - ${this.products[productName].options[option].name} x${this.cart[productName][option]}`
            );
          }
        }
      }
      let output = "";
      for (const key in tempInfo) {
        if (tempInfo[key].length > 0) {
          output += "\n";
          output += `${key}：\n`;
          output += tempInfo[key].join("\n");
          output += "\n";
        }
      }
      return output;
    },
  },
  persist: {
    paths: ["cart"],
  },
});
