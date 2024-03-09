<template>
  <div class="product-box" @click="redirectToProduct">
    <div class="product-img">
      <img :src="ProductImage" alt="product" />
    </div>
    <div class="product-info">
      <div class="product-name">
        <span>{{ ProductName }}</span>
      </div>
      <div class="product-noted">
        <span>{{ ProductNoted }}</span>
      </div>
      <div class="product-price">
        <span>
          <span>{{ Price.min }}</span>
          <span v-if="Price.max > Price.min">-</span>
          <span v-if="Price.max > Price.min">{{ Price.max }}</span>
          <del v-if="Price.ori">{{ Price.ori }}</del>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from "../store";
import { mapWritableState } from "pinia";
import { defineComponent } from "vue";

export default defineComponent({
  name: "productBox",
  props: {
    ProductImage: {
      type: String,
      required: false,
    },
    ProductName: {
      type: String,
      required: false,
    },
    ProductNoted: {
      type: String,
      required: false,
    },
    Price: {
      type: Object,
      required: false,
    },
  },
  methods: {
    redirectToProduct() {
      const store = useStore();
      store.goToProduct(this.ProductName);
      this.$router.push(`/product/${this.ProductName}`);
    },
  },
});
</script>

<style scoped>
.product-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(173, 71, 120, 0.5);
  border-radius: 10px;
  box-shadow: 0 0 10px 0 rgba(250, 101, 255, 0.312);
  margin: 1rem 1rem 0;
}

.product-img {
  width: 265px;
  height: 265px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-img img {
  width: 90%;
  height: 90%;
  border-radius: 5%;
}

.product-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  width: 87%;
  height: 100px;
}

.product-info div {
  width: 100%;
  text-align: left;
}

.product-noted {
  font-size: 0.8rem;
}

.product-name .product-price {
  font-size: 1.2rem;
}

.product-price span span {
  margin-right: 0.5rem;
}
</style>
