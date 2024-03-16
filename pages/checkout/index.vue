<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import { useStore } from "~/store";
import { useRouter, onBeforeRouteLeave } from "vue-router";

const store = useStore();
const router = useRouter();

if (
  Object.keys(store.products).length === 0 ||
  Object.keys(store.cart).length === 0
) {
  router.push("/");
}

const schema = z.object({
  // Name is required
  name: z
    .string({
      required_error: "請輸入姓名",
      invalid_type_error: "請輸入姓名",
    })
    .min(1, "請輸入姓名"),
  // Major is required
  major: z
    .string({
      required_error: "請輸入系級",
      invalid_type_error: "請輸入系級",
    })
    .min(1, "請輸入系級"),
  // Phone is required and must be a valid phone number
  phone: z
    .string({
      required_error: "請輸入電話號碼",
      invalid_type_error: "請輸入正確的電話號碼",
    })
    .min(9, "請輸入正確的電話號碼"),
  // Email is required and must be a valid email address
  email: z
    .string({
      required_error: "請輸入 Email",
      invalid_type_error: "請輸入正確的 Email 格式",
    })
    .email("請輸入正確的 Email 格式"),
  // Remarks is optional
  remarks: z.string().optional(),
});

type Schema = z.output<typeof schema>;

let tmpState = reactive({
  name: undefined,
  major: undefined,
  phone: undefined,
  email: undefined,
  lottery: true,
  pickup: false,
  pickupname: undefined,
  pickupphone: undefined,
  pickupemail: undefined,
  pickupinfo: store.getPickupInfo,
  remarks: undefined,
});
if (store.form) {
  tmpState = store.form;
}
const state = tmpState;

const canLottery = store.getTotal >= 100;
state.lottery = canLottery;

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // Do something with data
  console.log(event.data);

  router.push("/confirm");
}

const links = [
  {
    label: "購物車",
    to: "/cart",
  },
  {
    label: "填寫聯絡資料",
  },
];

const cartOptions = computed(() => {
  const cartTmp = [];
  const cart = store.cart;
  const products = store.products;
  for (const productName in cart) {
    if (!products[productName]) continue;
    if (products[productName].options.length < 1) {
      cartTmp.push({
        name: productName,
        price: products[productName].price.min,
        count: cart[productName][0],
        subtotal: products[productName].price.min * cart[productName][0],
      });
    } else {
      for (const option in cart[productName]) {
        cartTmp.push({
          name:
            productName + " - " + products[productName].options[option].name,
          price: products[productName].options[option].price,
          count: cart[productName][option],
          subtotal:
            (products[productName].options[option].price ||
              products[productName].price.min) * cart[productName][option],
        });
      }
    }
  }
  return cartTmp;
});

const cartNum = computed(() => {
  let num = 0;
  for (const productName in store.cart) {
    for (const option in store.cart[productName]) {
      num += store.cart[productName][option];
    }
  }
  return num;
});

onBeforeRouteLeave(() => {
  store.form = state;
});
</script>

<template>
  <div class="checkout-container font-sans">
    <div class="checkout-header">
      <UBreadcrumb :links="links" :divider="null" :ui="{ ol: 'gap-x-3' }">
        <template #icon="{ link, index, isActive }">
          <UAvatar
            :alt="(index + 1).toString()"
            :ui="{
              background: isActive
                ? 'bg-primary-500 dark:bg-primary-400'
                : undefined,
              placeholder: isActive
                ? 'text-white dark:text-gray-900'
                : !!link.to
                ? 'group-hover:text-gray-700 dark:group-hover:text-gray-200'
                : '',
            }"
            size="xs"
          />
        </template>
      </UBreadcrumb>
      <UBreadcrumb
        :links="[{ label: '確認訂單' }, { label: '' }]"
        :divider="null"
        class="mx-3"
      >
        <template #icon="{ link, index, isActive }">
          <UAvatar v-if="index === 0" :alt="(index + 3).toString()" size="xs" />
        </template>
      </UBreadcrumb>
    </div>
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <div class="form-subtitle">
        <span class="text-2xl">購物車詳情</span>
        <span class="text-md font-semibold"
          >共 {{ cartNum }} 項，總計 NT ${{ store.getTotal }}</span
        >
      </div>
      <UTable
        :rows="cartOptions"
        :columns="[
          { key: 'name', label: '商品' },
          { key: 'price', label: '價格' },
          { key: 'count', label: '數量' },
          { key: 'subtotal', label: '小計' },
        ]"
        class="text-left"
      >
        <template #price="{ row }">
          <span>NT ${{ row.price }}</span>
        </template>
        <template #subtotal="{ row }">
          <span>NT ${{ row.subtotal }}</span>
        </template>
      </UTable>

      <div class="form-subtitle">
        <span class="text-2xl">訂購人資料</span>
      </div>
      <UFormGroup label="" name="name">
        <template #default>
          <UInput
            v-model="state.name"
            :ui="{ default: { size: 'xl', variant: 'outline' } }"
            inputClass="bg-white dark:bg-gray-800 py-4"
          >
            <label
              :class="[
                state.name
                  ? 'text-gray-400 dark:text-gray-500 input-label input-label--active'
                  : 'text-gray-400 dark:text-gray-500 input-label',
              ]"
              >姓名</label
            >
          </UInput>
        </template>
        <template #error="props">
          <span
            class="text-red-500 dark:text-red-400 text-xs text-left block w-full"
            >{{ props.error }}</span
          >
        </template>
      </UFormGroup>
      <UFormGroup label="" name="major">
        <template #default>
          <UInput
            v-model="state.major"
            :ui="{ default: { size: 'xl', variant: 'outline' } }"
            inputClass="bg-white dark:bg-gray-800 py-4"
          >
            <label
              :class="[
                state.major
                  ? 'text-gray-400 dark:text-gray-500 input-label input-label--active'
                  : 'text-gray-400 dark:text-gray-500 input-label',
              ]"
              >系級</label
            >
          </UInput>
        </template>
        <template #error="props">
          <span
            class="text-red-500 dark:text-red-400 text-xs text-left block w-full"
            >{{ props.error }}</span
          >
        </template>
      </UFormGroup>
      <UFormGroup name="phone">
        <template #default>
          <UInput
            v-model="state.phone"
            :ui="{ default: { size: 'xl', variant: 'outline' } }"
            inputClass="bg-white dark:bg-gray-800 py-4"
          >
            <label
              :class="[
                state.phone
                  ? 'text-gray-400 dark:text-gray-500 input-label input-label--active'
                  : 'text-gray-400 dark:text-gray-500 input-label',
              ]"
              >電話號碼</label
            >
          </UInput>
        </template>
        <template #error="props">
          <span
            class="text-red-500 dark:text-red-400 text-xs text-left block w-full"
            >{{ props.error }}</span
          >
        </template>
      </UFormGroup>
      <UFormGroup label="" name="email">
        <template #default>
          <UInput
            v-model="state.email"
            :ui="{ default: { size: 'xl', variant: 'outline' } }"
            inputClass="bg-white dark:bg-gray-800 py-4"
          >
            <label
              :class="[
                state.email
                  ? 'text-gray-400 dark:text-gray-500 input-label input-label--active'
                  : 'text-gray-400 dark:text-gray-500 input-label',
              ]"
              >Email</label
            >
          </UInput>
        </template>
        <template #error="props">
          <span
            class="text-red-500 dark:text-red-400 text-xs text-left block w-full"
            >{{ props.error }}</span
          >
        </template>
      </UFormGroup>
      <UFormGroup name="lottery" class="flex items-center">
        <template #default>
          <UToggle
            v-model="state.lottery"
            class="mx-3"
            :disabled="!canLottery"
          />
          <span class="text-md"
            >我要參加抽獎
            <UIcon
              dynamic
              name="i-bi-info-circle"
              class="text-gray-400 dark:text-gray-500 w-3 cursor-pointer"
              @click="router.push('/help#lottery')"
            />
          </span>
        </template>
      </UFormGroup>

      <div class="form-subtitle">
        <span class="text-2xl">取貨資料</span>
      </div>
      <div class="toggle-container">
        <span class="text-md">自行取貨</span>
        <UToggle v-model="state.pickup" class="mx-3" />
        <span class="text-md">委託他人取貨</span>
      </div>
      <UFormGroup name="pickupname" v-show="state.pickup">
        <template #default>
          <UInput
            v-model="state.pickupname"
            :ui="{ default: { size: 'xl', variant: 'outline' } }"
            inputClass="bg-white dark:bg-gray-800 py-4"
          >
            <label
              :class="[
                state.pickupname
                  ? 'text-gray-400 dark:text-gray-500 input-label input-label--active'
                  : 'text-gray-400 dark:text-gray-500 input-label',
              ]"
              >取貨人姓名</label
            >
          </UInput>
        </template>
        <template #error="props">
          <span
            class="text-red-500 dark:text-red-400 text-xs text-left block w-full"
            >{{ props.error }}</span
          >
        </template>
      </UFormGroup>
      <UFormGroup name="pickupphone" v-show="state.pickup">
        <template #default>
          <UInput
            v-model="state.pickupphone"
            :ui="{ default: { size: 'xl', variant: 'outline' } }"
            inputClass="bg-white dark:bg-gray-800 py-4"
          >
            <label
              :class="[
                state.pickupphone
                  ? 'text-gray-400 dark:text-gray-500 input-label input-label--active'
                  : 'text-gray-400 dark:text-gray-500 input-label',
              ]"
              >取貨人電話號碼</label
            >
          </UInput>
        </template>
        <template #error="props">
          <span
            class="text-red-500 dark:text-red-400 text-xs text-left block w-full"
            >{{ props.error }}</span
          >
        </template>
      </UFormGroup>
      <UFormGroup name="pickupemail" v-show="state.pickup">
        <template #default>
          <UInput
            v-model="state.pickupemail"
            :ui="{ default: { size: 'xl', variant: 'outline' } }"
            inputClass="bg-white dark:bg-gray-800 py-4"
          >
            <label
              :class="[
                state.pickupemail
                  ? 'text-gray-400 dark:text-gray-500 input-label input-label--active'
                  : 'text-gray-400 dark:text-gray-500 input-label',
              ]"
              >取貨人 Email</label
            >
          </UInput>
        </template>
        <template #error="props">
          <span
            class="text-red-500 dark:text-red-400 text-xs text-left block w-full"
            >{{ props.error }}</span
          >
        </template>
      </UFormGroup>
      <UTextarea
        v-model="state.pickupinfo"
        :ui="{ default: { size: 'xl', variant: 'none' } }"
        disabled
        autoresize
        textareaClass="bg-white dark:bg-gray-800"
        :placeholder="'出了點狀況？\n返回購物車修改吧！\n\n如果持續發生問題，請聯絡我們！'"
        @change="state.pickupinfo = store.getPickupInfo"
      ></UTextarea>

      <div class="form-subtitle">
        <span class="text-2xl">訂單備註</span>
      </div>
      <UTextarea
        v-model="state.remarks"
        :ui="{ default: { size: 'xl', variant: 'outline' } }"
        :rows="3"
        autoresize
        textareaClass="bg-white dark:bg-gray-800"
        placeholder="留言給竹苗！"
      ></UTextarea>

      <div class="next-button-container">
        <UButton
          color="fuchsia"
          variant="solid"
          size="lg"
          :label="'確認訂單'"
          type="submit"
        ></UButton>
      </div>
    </UForm>
  </div>
</template>

<style scoped>
.checkout-container {
  width: 550px;
  max-width: 90vw;
  margin: auto;
}

.checkout-header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 1rem;
  margin-top: 1rem;
}

.form-subtitle {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  text-align: left;
  margin: 1rem 0 1rem;
}

.input-label {
  text-align: left;
  position: absolute;
  z-index: 5;
  top: 0;
  left: 0;
  display: block;
  width: 100%;
  margin-bottom: 0;
  line-height: 1.5;
  color: #adb5bd;
  pointer-events: none;
  cursor: text;
  border: 1px solid transparent;
  border-radius: 0.25rem;
  transition: all 0.1s ease-in-out;
  height: calc(1.5em + 1.7rem + 2px);
  padding: 0.85rem;
}

.input-label--active {
  padding-top: 0.2rem;
  padding-bottom: 0.2rem;
  font-size: 0.65rem;
  color: #adb5bd;
}

.toggle-container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 1rem 0;
}
</style>
