import { defineStore, createPinia } from "pinia";

const API_URL = "https://api.nuxtjs.dev/products";

interface Product {
  price: {
    ori: number | null;
    max: number | null;
    min: number;
  };
  noted: string;
  image: string;
  options: {
    name: string;
    price: number;
    tag: string;
  }[];
  description: string | null;
}

interface Products {
  [key: string]: Product;
}

interface State {
  isLoading: boolean;
  products: Products;
  tmpProduct: Product | null;
  tmpOptionIndex: number;
}

export const useStore = defineStore("store", {
  state: () =>
    ({
      // cart: {
      //   carts: [],
      // },
      isLoading: false,
      products: {
        ProductName: {
          price: {
            ori: 200,
            max: 100,
            min: 50,
          },
          noted: "Food",
          image: "https://via.placeholder.com/150",
          options: [
            {
              name: "A",
              price: 50,
              tag: "Food",
            },
            {
              name: "B",
              price: 100,
              tag: "Food",
            },
          ],
        },
        "Product Name1": {
          price: {
            min: 50,
          },
          noted: "Food",
          image: "https://via.placeholder.com/150",
          options: [
            {
              name: "A",
              tag: "Food",
            },
          ],
        },
        "Product Name2": {
          price: {
            max: 100,
            min: 50,
          },
          noted: "Food",
          image: "https://via.placeholder.com/150",
          options: [
            {
              name: "A",
              price: 50,
              tag: "Food",
            },
            {
              name: "B",
              price: 50,
              tag: "Food",
            },
          ],
        },
        "Product Name3": {
          price: {
            ori: 200,
            min: 50,
          },
          noted: "Food",
          image: "https://via.placeholder.com/150",
          options: [
            {
              name: "A",
              price: 50,
              tag: "Food",
            },
            {
              name: "測試測試測試測試",
              price: 50,
              tag: "Food",
            },
            {
              name: "C",
              price: 50,
              tag: "Food",
            },
          ],
        },
      },
      tmpProduct: null as Product | null,
      tmpOptionIndex: -1,
    } as unknown as State),
  actions: {
    getCart() {},
    addCart() {},
    removeCart() {},
    removeAllCart() {},
    loading() {},
    getProductsFromAPI() {
      // API_URL/getProducts
      // fetch(`${API_URL}/getProducts`)
      //   .then((res) => {
      //     products = res.json();
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
    },
    goToProduct(productName: string) {
      this.tmpProduct = this.products[`${productName}`];
    },
    resetTmpObjectIndex() {
      this.tmpOptionIndex = -1;
    },
    getProduct(productName: string) {
      return this.products[`${productName}`];
    },
  },
  getters: {},
});
