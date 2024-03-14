<template>
  <div class="homepage-container">
    <UContainer>
      <USkeleton class="banner-container" />
    </UContainer>
    <UHorizontalNavigation
      :links="productTags"
      class="nav-container"
      :ui="{ container: 'flex-wrap' }"
    >
      <template #default="{ link }">
        <ULink
          class="group-hover:text-primary relative"
          @click="() => store.setNowTag(link.label)"
          :active="link.label === getNowTag"
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
.homepage-container {
  padding: 0 calc(50vw - 500px) 0;
}

.banner-container {
  padding: 0 0 0;
  width: 100vw;
  height: 33vw;
  margin: auto;
}

.nav-container {
  padding: 0 1rem 0;
  width: 98vw;
  margin: auto;
}

@media screen and (min-width: 685px) {
  .homepage-container {
    padding: 0 calc(50vw - 630px) 0;
  }
}

.product-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 max(calc(50% - 42vw - 1rem), calc(50% - 210px - 1rem)) 0;
}

.product-container div {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  width: auto;
}

@media screen and (min-width: 695px) {
  .product-container {
    padding: 0 calc((100% - 630px - 3rem) / 2) 0;
  }
}

@media screen and (min-width: 925px) {
  .product-container {
    padding: 0 calc((100% - 840px - 4rem) / 2) 0;
  }
}
</style>
