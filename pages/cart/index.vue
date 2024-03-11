<template>
  <div>
    <div class="cart-container">
      <div v-if="!Object.keys(cart).length">
        <h2>購物車是空的</h2>
      </div>
      <div v-else>
        <cartBox
          v-for="(item, product) in cart"
          :key="product"
          :productName="String(product)"
          :product="products[product]"
          :item="item"
        />
      </div>
      <div class="cart-total">
        <span>總金額: {{ total }}</span>
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
const cart = store.cart;
const total = store.getTotal;
</script>

<style scoped>
.cart-container {
  margin-top: 2rem;
}
</style>
