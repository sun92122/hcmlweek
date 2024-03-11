<template>
  <div class="product-box" @click="redirectToProduct">
    <div class="product-img">
      <NuxtImg
        :src="ProductImage ? ProductImage : 'https://via.placeholder.com/150'"
        alt="product"
      />
    </div>
    <div class="product-info">
      <div class="product-name">
        <span>{{ ProductName }}</span>
      </div>
      <div class="product-noted">
        <span v-html="ProductNoted"></span>
      </div>
      <div class="product-price">
        <span v-if="Price">
          <span>NT ${{ Price.min }}</span>
          <span v-if="Price.max > Price.min">-</span>
          <span v-if="Price.max > Price.min">NT ${{ Price.max }}</span>
          <del v-if="Price.ori">NT ${{ Price.ori }}</del>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from "../store";
import { defineComponent } from "vue";

export default defineComponent({
  name: "productBox",
  props: {
    ProductImage: {
      type: String,
      required: false,
    },
    ProductName: {
      type: [String, Number],
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
      store.goToProduct(`${this.ProductName}`);
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
  background-color: rgba(227, 113, 168, 0.5);
  border-radius: 10px;
  box-shadow: 0 0 10px 0 rgba(250, 101, 255, 0.312);
  margin: 0.5rem 0.5rem 0;
}

.product-img {
  width: 42vw;
  height: 42vw;
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
  max-width: 42vw;
  height: 100px;
}

.product-info div {
  width: 100%;
  text-align: left;
}

.product-noted {
  font-size: x-small;
}

.product-name .product-price {
  font-size: large;
}

.product-price span span {
  margin-right: 0.5rem;
}
</style>
