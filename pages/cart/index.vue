<template>
  <div>
    <div class="cart-container">
      <div v-if="!Object.keys(cart).length" class="cart-empty-container">
        <h2>購物車是空的</h2>
        <UButton
          color="black"
          size="lg"
          :label="'去逛逛商品'"
          @Click="() => $router.push('/')"
        ></UButton>
      </div>
      <div v-else>
        <span class="text-2xl">購物車～～</span>
        <div class="title-container">
          <div class="title-text">
            <div class="product-name">
              <span>商品</span>
            </div>
            <div class="product-subtotal">
              <span>小計</span>
            </div>
          </div>
          <UDivider />
        </div>
        <div v-for="(item, product) in cart">
          <cartBox
            v-if="products[product]"
            :key="product"
            :productName="String(product)"
            :productImage="products[product].image || ''"
            :productOptions="products[product].options || {}"
            :productPrice="products[product].price"
            :item="item"
          />
        </div>
        <UDivider />
        <div class="cart-total">
          <span class="text-3xl" v-if="total > 0"
            >合計：NT ${{ store.getTotal }}</span
          >
        </div>
        <div class="next-button-container" v-if="total > 0">
          <UButton
            color="fuchsia"
            variant="solid"
            size="lg"
            :label="'下一步，填寫聯路資訊'"
            to="/checkout"
          ></UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from "~/store";
import cartBox from "~/components/cartBox.vue";

export default {
  name: "Cart",
  layout: "default",
  data() {
    return {
      cartBox,
    };
  },
};
</script>

<script setup lang="ts">
const store = useStore();
const products = store.getProducts;

store.resetTmpObjectIndex();
if (Object.keys(products).length === 0) {
  var productsData = {};
  const { data } = await useAsyncData("productsData", () =>
    $fetch(store.apiURL).then(async (res: any) => {
      productsData = await res;
    })
  );
  store.products = productsData;
}

const cart = store.getCart;
const total = store.getTotal;
</script>

<style scoped>
.cart-container {
  margin-top: 2rem;
}

.cart-empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
  font-size: x-large;
}

.title-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-left: 1rem;
  padding-right: 1rem;
  margin-bottom: 1rem;
}

.title-text {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-left: 1rem;
  padding-right: 1rem;
  width: 100%;
  font-size: small;
}

.next-button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
}
</style>
