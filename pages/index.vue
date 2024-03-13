<template>
  <div class="page-container">
    <UHorizontalNavigation :links="productTags" class="px-6">
      <template #default="{ link }">
        <ULink
          class="group-hover:text-primary relative"
          @click="() => store.setNowTag(link.label)"
          >{{ link.label }}</ULink
        >
      </template>
    </UHorizontalNavigation>
    <div class="product-container">
      <div>
        <productBox
          v-for="(product, productName) in tmpProducts"
          v-show="
            getNowTag === '所有商品' ||
            (product.tags && product.tags.includes(getNowTag))
          "
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
const productTags = store.getTags;
store.nowTag = "所有商品";
const getNowTag = computed(() => store.getNowTag);
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
