<template>
  <div class="cart-box">
    <div class="product-img">
      <NuxtLink :to="`/product/${productName}`">
        <NuxtImg
          :src="
            productImage ? productImage : 'https://via.placeholder.com/150'
          "
          :alt="`product-${productName}`"
          sizes="40vw"
          fit="inside"
          :modifiers="{ roundCorner: '50' }"
        />
      </NuxtLink>
    </div>
    <div class="product-container">
      <div class="product-name">
        <NuxtLink :to="`/product/${productName}`">
          <span>{{ productName }}</span>
        </NuxtLink>
      </div>
      <!-- <div class="product-info">
        <div class="product-option">
          <span></span>
        </div>
        <div class="product-count">
          <span>數量</span>
        </div>
        <div class="product-subtotal">
          <span>小計</span>
        </div>
      </div> -->
      <div class="product-info" v-for="(count, option) in item">
        <div class="product-option">
          <span>{{
            productOptions[option] ? productOptions[option].name : ""
          }}</span>
        </div>
        <div class="product-count">
          <span>{{ count }}</span>
        </div>
        <div class="product-subtotal">
          <span
            >NT ${{
              productOptions[option]
                ? count * (productOptions[option].price || productPrice.min)
                : count * productPrice.min
            }}</span
          >
        </div>
        <!-- <div class="product-remove">
          <UButton
            size="2xs"
            variant="outline"
            color="red"
            :label="'移除'"
            @click="() => store.removeFromCart(productName, parseInt(option))"
          ></UButton>
        </div> -->
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
    productImage: {
      type: String,
      required: true,
    },
    productOptions: {
      type: Object,
      required: true,
    },
    productPrice: {
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

.product-img img {
  width: 100%;
  height: auto;
  border-radius: 5%;
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
  margin-top: 0.2rem;
  margin-bottom: 0.5rem;
  padding-left: 1rem;
  font-size: medium;
  font-weight: 500;
}

.product-info {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin-top: 0.5rem;
  font-size: small;
}

.product-info div {
  margin-right: 1rem;
}

.product-info div span {
  text-align: left;
}

.product-option {
  padding-left: 1.2rem;
  width: 27%;
  text-align: left;
}

.product-count {
  width: 15%;
}

.product-subtotal {
  width: 30%;
}

.product-remove {
  height: 2rem;
}
</style>
