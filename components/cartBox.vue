<template>
  <div class="cart-box">
    <div class="product-img">
      <NuxtLink :to="`/product/${productName}`">
        <NuxtImg
          :src="
            product.image ? product.image : 'https://via.placeholder.com/150'
          "
          :alt="`product-${productName}`"
          sizes="40vw"
          fit="inside"
        />
      </NuxtLink>
    </div>
    <div class="product-container">
      <div class="product-name">
        <NuxtLink :to="`/product/${productName}`">
          <span>{{ productName }}</span>
        </NuxtLink>
      </div>
      <div class="product-info">
        <div class="product-option">
          <span></span>
        </div>
        <div class="product-count">
          <span>數量</span>
        </div>
        <div class="product-subtotal">
          <span>小計</span>
        </div>
      </div>
      <div class="product-info" v-for="(count, option) in item">
        <div class="product-option">
          <span>{{
            product.options[option] ? product.options[option].name : ""
          }}</span>
        </div>
        <div class="product-count">
          <span>{{ count }}</span>
        </div>
        <div class="product-subtotal">
          <span>{{
            product.options[option]
              ? count * (product.options[option].price || product.price.min)
              : count * product.price.min
          }}</span>
        </div>
        <div class="product-remove">
          <UButton
            size="2xs"
            variant="outline"
            color="red"
            :label="'移除'"
            @click="() => store.removeFromCart(productName, parseInt(option))"
          ></UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from "~/store";
import { defineComponent } from "vue";

export default defineComponent({
  name: "cartBox",
  props: {
    productName: {
      type: String,
      required: true,
    },
    product: {
      type: Object,
      required: true,
    },
    item: {
      type: Object,
      required: true,
    },
  },
});
</script>

<script setup lang="ts">
const store = useStore();
</script>

<style scoped>
.cart-box {
  display: flex;
  flex-direction: row;
  /* align-items: start; */
  justify-content: left;
  padding-left: 1rem;
  margin-bottom: 2rem;
}

.product-img {
  max-width: calc(25vw + 10px);
  max-height: calc(25vw + 10px);
}

.product-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  max-width: 800px;
}

.product-name {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  padding-left: 2rem;
  font-size: 1.2rem;
  font-weight: 500;
}

.product-info {
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-top: 0.5rem;
}

.product-info div {
  margin-right: 1rem;
}

.product-info div span {
  text-align: left;
}

.product-option {
  padding-left: 1.5rem;
  width: 27%;
  text-align: left;
}

.product-count {
  width: 15%;
}

.product-subtotal {
  width: 15%;
}

.product-remove {
  height: 2rem;
}
</style>
