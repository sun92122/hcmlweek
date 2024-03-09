<template>
  <div>
    <div class="product-container">
      <div>
        <productBox
          v-for="(product, productName) in products"
          :-product-image="product.image"
          :-product-name="productName"
          :-product-noted="product.noted"
          :-price="product.price"
          :key="productName"
        >{{ key }}</productBox>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from "../store";
import productBox from "~/components/productBox.vue";

export default {
  name: "Home",
  layout: "default",
  data() {
    return {
      productBox,
    };
  },
  setup() {
    const store = useStore();
    const products = store.products;
    return { products };
  },
};
</script>

<style>
.product-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.product-container div {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  width: auto;
}
</style>
