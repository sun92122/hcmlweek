<template>
  <div>
    <div class="product-container">
      <div>
        <productBox
          v-for="(product, productName) in tmpProducts"
          :-product-image="product.image"
          :-product-name="productName"
          :-product-noted="product.noted"
          :-price="product.price"
          :key="productName"
          >{{ productName }}</productBox
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
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
};
</script>

<script setup lang="ts">
const store = useStore();
let tmpProducts = store.getProducts;
if (Object.keys(tmpProducts).length === 0) {
  // useAsyncData();
  var productsData = {};
  const { data } = await useAsyncData("productsData", () =>
    $fetch(store.apiURL).then(async (res: any) => {
      productsData = await res;
    })
  );
  const products = productsData;
  store.products = products;
} else {
  console.log("no need to fetch");
  const products = tmpProducts;
}
</script>

<style scoped>
.product-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-left: calc(8vw - 1rem);
}

.product-container div {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  width: auto;
}

@media screen and (min-width: 768px) {
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
}
</style>
