import { defineStore, createPinia } from "pinia";

const API_URL = "https://api.nuxtjs.dev/products";

interface Product {
  price: {
    ori: number;
    max: number;
    min: number;
  };
  noted: string;
  image: string;
  options: {
    name: string;
    price: number;
    tag: string;
  }[];
}

interface State {
  isLoading: boolean;
  cart: any;
  products: { [key: string]: Product };
  tmpProduct: Product;
  tmpOptionIndex: number;
}

export const useStore = defineStore("store", {
  state: () => ({
    cart: {
      carts: [],
    },
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
          ori: null,
          max: null,
          min: 50,
        },
        noted: "Food",
        image: "https://via.placeholder.com/150",
        options: [
          {
            name: "A",
            price: null,
            tag: "Food",
          },
        ],
      },
      "Product Name2": {
        price: {
          ori: null,
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
          max: NaN,
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
  }),
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
      this.tmpProduct = this.products["productName"];
    },
    resetTmpObjectIndex() {
      this.tmpOptionIndex = -1;
    },
    getProduct(productName: string) {
      return this.products["productName"];
    }
  },
  getters: {},
});
