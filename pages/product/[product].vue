<template>
  <div class="product-page-container">
    <div class="product-container">
      <div class="product-img">
        <img :src="product.image" alt="product" />
      </div>
      <div class="product-info-container">
        <div class="product-name-container">
          <span>{{ productName }}</span>
        </div>
        <div class="product-noted-container">
          <span v-html="product.noted"></span>
        </div>
        <div
          v-if="product.options.length >= 2"
          class="product-option-container"
        >
          <UButton
            v-for="(option, index) in product.options"
            color="black"
            variant="solid"
            :key="index"
            :label="option.name"
            :onClick="(tmpOptionIndex = index)"
            :ui="{
              primary: tmpOptionIndex === index,
              secondary: tmpOptionIndex !== index,
              rounded: false,
            }"
          ></UButton>
        </div>
        <div class="product-price-container">
          <span v-if="product.price.max !== null" v-show="tmpOptionIndex === -1">
            <span>NT ${{ product.price.min }}</span>
            <span v-if="product.price.max > product.price.min">-</span>
            <span v-if="product.price.max > product.price.min"
              >NT ${{ product.price.max }}</span
            >
            <del v-if="product.price.ori">{{ product.price.ori }}</del>
          </span>
          <span v-if="product.price.max === null">
            <span>NT ${{ product.price.min }}</span>
            <del v-if="product.price.ori">{{ product.price.ori }}</del>
          </span>
          <span v-show="tmpOptionIndex !== -1">
            <span>NT ${{ product.options[tmpOptionIndex].price }}</span>
          </span>
        </div>
        <div class="add-to-cart-container">
          <UButton :label="'Add to cart'"></UButton>
        </div>
      </div>
      <div class="product-description-container">
        <span>{{ product.description }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mapWritableState } from "pinia";
import { useStore } from "~/store";

export default {
  methods: {},
  computed: {
    // ...mapWritableState(useStore, {
    //   product: "tmpProduct",
    // }),
    ...mapWritableState(useStore, ["tmpOptionIndex"]),
  },
  setup() {
    const route = useRoute();
    const productName = route.params.product;

    const store = useStore();
    store.resetTmpObjectIndex();
    const product = store.products[`${productName}`];
    return { productName, product };
  },
};
</script>

<style scoped>
div {
  display: flex;
}

.product-page-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding: 2rem;
}

.product-container {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  margin-top: 20px;
}

.product-img {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 50%;
}

.product-img img {
  width: 100%;
  height: auto;
}

.product-info-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 50%;
  height: 100%;
  padding-left: 2rem;
}

.product-name-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;
  margin-top: 20px;
}

.product-name-container span {
  font-size: 2rem;
  font-weight: bold;
}

.product-noted-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
}

.product-noted-container span {
  font-size: 1.5rem;
  font-weight: bold;
}

.product-option-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
}

.product-option-container button {
  margin-top: 10px;
  margin-right: 10px;
  min-width: 5rem;
  align-items: center;
  justify-content: center;
}

.product-price-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  margin-top: 20px;
}

.product-price-container span {
  font-size: 1.8rem;
  font-weight: bold;
}
</style>
