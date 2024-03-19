<template>
  <div class="product-page-container">
    <div class="product-container" v-if="product">
      <div class="product-img">
        <NuxtImg
          :src="
            product.image ? product.image : 'https://via.placeholder.com/150'
          "
          :alt="productName"
          loading="lazy"
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
          v-if="product.options.length >= 1"
          class="product-option-container"
        >
          <UButton
            v-for="(option, index) in product.options"
            :color="tmpOptionIndex === index ? 'purple' : 'gray'"
            variant="outline"
            :key="index"
            :label="option.name || productName"
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
              rounded: 'rounded-md',
            }"
          >
            <UButton
              color="gray"
              variant="solid"
              icon="i-heroicons-minus-small"
              square
              @click="
                () => {
                  if (!Number.isInteger(cartCount)) cartCount = 1;
                  cartCount = Math.max(1, Math.floor(cartCount) - 1);
                }
              "
              :disabled="cartCount <= 1"
              :ui="buttonStyle"
            ></UButton>
            <UInput
              color="gray"
              variant="outline"
              placeholder="?"
              type="text"
              v-model="cartCount"
              :ui="{
                rounded: false,
                base: 'text-center',
                color: {
                  gray: {
                    outline:
                      Number.isInteger(cartCount) && cartCount > 0
                        ? null
                        : 'ring-red-500 dark:ring-red-400',
                  },
                },
              }"
              @input="
                (e: any) => {
                  cartCount = Math.min(99, Math.floor(e.target.value));
                }
              "
            ></UInput>
            <UButton
              color="gray"
              variant="solid"
              icon="i-heroicons-plus-small"
              square
              @click="
                () => {
                  cartCount = Math.min(9, Math.floor(cartCount) + 1);
                  if (!Number.isInteger(cartCount)) cartCount = 1;
                }
              "
              :disabled="cartCount >= 9"
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
                );
                cartCount = 1;
              "
            ></UButton>
          </div>
        </div>
      </div>
      <div class="product-description-container">
        <ULink to="/">
          <span class="back-link underline">&lt; 返回首頁</span>
        </ULink>
        <span
          v-for="description in product.description"
          v-html="description ? description : ''"
        ></span>
      </div>
    </div>
    <div v-else>
      <h1 class="text-center w-full text-3xl">Loading...</h1>
      <div class="product-description-container">
        <ULink to="/">
          <span class="back-link underline">&lt; 返回首頁</span>
        </ULink>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mapWritableState } from "pinia";
import { useStore } from "~/store";

export default {
  data() {
    const toast = useToast();
    return {
      toast,
    };
  },
  methods: {
    addToCart(name: string, index: number, count: number, optNum: number) {
      if (!Number.isInteger(count) || count < 1) {
        this.toast.add({
          title: "請輸入數量",
          description: "請輸入正確的數量",
          timeout: 2500,
        });
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
      store.$patch({ cartCount: 1 });

      // random toast id
      const toastID = Math.floor(Math.random() * 1000000);
      this.toast.add({
        title: "成功加入 <u>購物車</u> ",
        description:
          `${count} 件 ${name}` +
          (index >= 0
            ? `（${store.getProducts[name].options[index].name}）`
            : ""),
        timeout: 2500,
        id: `${toastID}`,
        click: () => {
          this.$router.push("/cart");
          this.toast.remove(`${toastID}`);
        },
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
} else if (product.options.length == 1) {
  store.tmpOptionIndex = 0;
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
  max-width: 600px;
  margin: 0 auto;
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
  font-size: x-large;
  font-weight: bold;
  text-align: left;
}

.product-noted-container {
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
}

.product-noted-container span {
  font-size: large;
}

.product-option-container {
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
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
  margin-top: 2rem;
}

.count-container div {
  max-width: 40%;
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
  margin: 0 !important;
}

input[type="number"] {
  -moz-appearance: textfield !important;
  appearance: textfield !important;
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
  margin-top: 2rem;
}

.product-description-container * {
  font-family: "Noto Serif TC", serif;
  text-align: left;
  font-size: large;
  font-weight: 400;
  margin-top: 1rem;
}

@media screen and (max-width: 400px) {
  .product-page-container {
    padding: 1rem;
  }
}

@media screen and (min-width: 650px) {
  .product-page-container {
    max-width: 800px;
  }

  .product-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .product-img {
    width: 45%;
    max-width: 45%;
    height: 45%;
    max-height: 45%;
  }

  .product-info-container {
    width: 50%;
    max-width: 50%;
    height: 100%;
    padding-left: 2rem;
  }

  .count-container {
    justify-content: space-between;
  }

  .count-container div {
    max-width: 50%;
  }

  .add-to-cart-container {
    width: 30%;
  }
}
</style>
