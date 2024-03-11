<template>
  <div class="product-page-container">
    <div class="product-container" v-if="product">
      <div class="product-img">
        <NuxtImg
          :src="
            product.image ? product.image : 'https://via.placeholder.com/150'
          "
          :alt="productName"
        />
      </div>
      <div class="product-info-container">
        <div class="product-name-container">
          <span>{{ productName }}</span>
        </div>
        <div class="product-noted-container">
          <span v-html="product.noted"></span>
        </div>
        <div class="product-price-container" v-if="product.price">
          <span v-if="product.price.max !== null" v-show="tmpOptionIndex == -1">
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
          <span
            v-if="product.price.max !== null && tmpOptionIndex >= 0"
            v-show="tmpOptionIndex !== -1"
          >
            <span>NT ${{ product.options[tmpOptionIndex].price }}</span>
          </span>
        </div>
        <div
          v-if="product.options.length >= 2"
          class="product-option-container"
        >
          <UButton
            v-for="(option, index) in product.options"
            :color="tmpOptionIndex === index ? 'purple' : 'gray'"
            variant="outline"
            :key="index"
            :label="option.name"
            :onClick="
              () => {
                tmpOptionIndex = index;
              }
            "
            :ui="{
              primary: tmpOptionIndex === index,
              secondary: tmpOptionIndex !== index,
              rounded: false,
            }"
          ></UButton>
        </div>
        <div class="count-container">
          <UButtonGroup
            orientation="horizontal"
            size="md"
            :ui="{
              rounded: false,
            }"
          >
            <UButton
              color="gray"
              variant="solid"
              :label="'-'"
              @click="
                () => {
                  cartCount = Math.max(0, Math.floor(cartCount) - 1);
                }
              "
              :ui="buttonStyle"
            ></UButton>
            <UInput
              color="gray"
              variant="outline"
              placeholder="?"
              type="number"
              v-model="cartCount"
              :ui="{
                rounded: false,
                base: 'text-center',
              }"
            ></UInput>
            <UButton
              color="gray"
              variant="solid"
              :label="'+'"
              @click="
                () => {
                  cartCount = Math.floor(cartCount) + 1;
                }
              "
              :ui="buttonStyle"
            ></UButton>
          </UButtonGroup>
          <div class="add-to-cart-container">
            <UButton
              color="purple"
              size="md"
              :label="'加入購物車'"
              @Click="
                addToCart(
                  productName,
                  tmpOptionIndex,
                  cartCount,
                  product.options.length
                )
              "
            ></UButton>
          </div>
        </div>
      </div>
      <div class="product-description-container">
        <ULink to="/">
          <span class="back-link">&lt; 返回首頁</span>
        </ULink>
        <span v-html="product.description ? product.description : ''"></span>
      </div>
    </div>
    <div v-else>
      <h1 class="text-center w-full text-3xl">Loading...</h1>
      <div class="product-description-container">
        <ULink to="/">
          <span class="back-link">&lt; 返回首頁</span>
        </ULink>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mapWritableState } from "pinia";
import { useStore } from "~/store";

export default {
  async asyncData() {
    const store = useStore();
    if (Object.keys(store.products).length !== 0) {
      return;
    }
    store.products = await $fetch(store.apiURL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (res: any) => await res.json());
  },
  data() {
    const toast = useToast();
    return {
      toast,
    };
  },
  methods: {
    addToCart(name: string, index: number, count: number, optNum: number) {
      if (count === 0) {
        return;
      }

      if (index === -1 && optNum > 0) {
        this.toast.add({
          title: "請選擇選項",
          description: "請選擇一個選項",
          timeout: 2500,
        });
        return;
      }

      const store = useStore();
      store.addToCart(name, index, Math.max(0, Math.floor(count)));

      store.resetCartCount();
      this.toast.add({
        title: "成功加入購物車",
        description:
          `${count} 件 ${name}` +
          (index >= 0
            ? `（${store.getProducts[name].options[index].name}）`
            : ""),
        timeout: 2500,
      });
    },
  },
  computed: {
    ...mapWritableState(useStore, ["tmpOptionIndex"]),
    ...mapWritableState(useStore, ["cartCount"]),
  },
};
</script>

<script setup lang="ts">
const buttonStyle = {
  primary: true,
  rounded: false,
};
const cartCount = ref(1);

const route = useRoute();
const productName = String(route.params.product);

const store = useStore();
store.resetTmpObjectIndex();
store.tmpProductName = productName;
if (Object.keys(store.products).length === 0) {
  var productsData = {};
  const { data } = await useAsyncData("productsData", () =>
    $fetch(store.apiURL).then(async (res: any) => {
      productsData = await res;
    })
  );
  store.products = productsData;
}

const product = store.getProduct;
if (!product) {
  const toast = useToast();
  toast.add({
    title: "找不到商品",
    description: "找不到這個商品",
    timeout: 5000,
  });
}
</script>

<style scoped>
div {
  display: flex;
}

.product-page-container {
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding: 2rem;
}

.product-container {
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.product-img {
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 90%;
}

.product-img img {
  width: 100%;
  height: auto;
  border-radius: 5%;
}

.product-info-container {
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 90%;
  height: 100%;
  padding-left: 1rem;
}

.product-name-container {
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;
  margin-top: 20px;
}

.product-name-container span {
  font-size: xx-large;
  font-weight: bold;
}

.product-noted-container {
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
}

.product-noted-container span {
  font-size: x-large;
  font-weight: bold;
}

.product-option-container {
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
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  margin-top: 0.5rem;
}

.product-price-container span {
  font-size: x-large;
  font-weight: bold;
  text-align: left;
}

.product-price-container span * {
  margin-right: 0.5rem;
}

.count-container {
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  margin-top: 3rem;
}

.count-container div {
  max-width: 40%;
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input {
  -moz-appearance: "textfield";
  appearance: "textfield";
}

.add-to-cart-container {
  padding-right: 1rem;
  align-items: center;
  justify-content: center;
  width: 50%;
  margin-left: 1rem;
}

.product-description-container {
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  width: 90%;
  margin-top: 3rem;
}

.product-description-container * {
  font-size: large;
  font-weight: bold;
  margin-top: 1rem;
}

@media screen and (min-aspect-ratio: 4/3) {
  .product-name-container span .product-price-container span {
    font-size: 2.5rem;
  }
}
</style>
