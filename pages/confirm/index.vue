<script setup lang="ts">
import { useStore } from "~/store";

const links = [
  {
    label: "購物車",
    to: "/cart",
  },
  {
    label: "填寫聯絡資料",
    to: "/checkout",
  },
  {
    label: "確認訂單",
  },
];

const store = useStore();

const cart = store.cart;
const form = store.form;

const router = useRouter();

const pickupInfo = store.getPickupInfoAsStr().replaceAll("\n", "<br />");
const remarks = `${form.remarks}`.replaceAll("\n", "<br />");
const state = reactive({
  姓名: form.name,
  系級: form.major,
  總價: store.getTotal,
  訂單總覽: pickupInfo,
  聯絡電話: form.phone,
  電子郵件: form.email,
  參加抽獎: form.lottery ? "是" : "",
  備註: remarks,
});

function submited() {
  store.cart = [] as any;
  store.form = null;
  // router.push("/success");
  console.log("submited");
}
</script>

<template>
  <div class="confirm-container font-sans">
    <div class="confirm-header">
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
    </div>

    <div class="subtitle">
      <span class="text-2xl">確認訂單</span>
    </div>
    <div class="subtitle">
      <span>
        請確認您的訂單資訊，並點擊「確認訂單」按鈕完成訂購。若有錯誤請返回上一頁修改。
      </span>
    </div>
    <div class="confirm-info-container">
      <div>
        <span>訂購人姓名</span>
        <span>{{ form.name }}</span>
      </div>
      <div>
        <span>訂購人系級/處室</span>
        <span>{{ form.major }}</span>
      </div>
      <div>
        <span>訂購人電話</span>
        <span>{{ form.phone }}</span>
      </div>
      <div>
        <span>訂購人信箱</span>
        <span>{{ form.email }}</span>
      </div>
      <div v-if="!!form.lottery">
        <span>參加抽獎</span>
        <span>是</span>
      </div>
      <div v-if="!form.pickup">
        <span>取貨方式</span>
        <span>自行取貨</span>
      </div>
      <div v-if="!!form.pickup">
        <span>取貨人姓名</span>
        <span>{{ form.pickupname }}</span>
      </div>
      <div v-if="!!form.pickup">
        <span>取貨人電話</span>
        <span>{{ form.pickupphone }}</span>
      </div>
      <div v-if="!!form.pickup">
        <span>取貨人信箱</span>
        <span>{{ form.pickupemail }}</span>
      </div>
      <div>
        <span>付款方式</span>
        <span
          >正式週現場付款
          <UIcon
            dynamic
            name="i-bi-info-circle"
            class="text-gray-400 dark:text-gray-500 w-3 cursor-pointer"
            @click="router.push('/help#payment')"
          />
        </span>
      </div>
      <div>
        <span>總金額</span>
        <span class="font-semibold">NT ${{ store.getTotal }}</span>
      </div>
      <div>
        <span>訂購商品</span>
      </div>
      <UTextarea
        v-model="store.getPickupInfo"
        :ui="{ default: { size: 'xl', variant: 'none' } }"
        disabled
        autoresize
      />
      <div>
        <span>訂單備註</span>
        <span v-if="!form.remarks">無</span>
      </div>
      <UTextarea
        v-if="!!form.remarks"
        v-model="form.remarks"
        :ui="{ default: { size: 'xl', variant: 'none' } }"
        :rows="1"
        disabled
        autoresize
      />
    </div>

    <iframe
      name="hidden_iframe"
      id="hidden_iframe"
      style="display: none"
    ></iframe>
    <form
      class="flex flex-col items-center justify-center py-6"
      :action="store.apiURL"
      method="post"
      target="hidden_iframe"
      autocomplete="off"
      name="form"
      enctype="text/plain"
      @submit.after="submited"
    >
      <input name="姓名" v-model="state.姓名" type="hidden" />
      <input name="系級" v-model="state.系級" type="hidden" />
      <input name="總價" v-model="state.總價" type="hidden" />
      <input name="訂單總覽" v-model="state.訂單總覽" type="hidden" />
      <input name="聯絡電話" v-model="state.聯絡電話" type="hidden" />
      <input name="電子郵件" v-model="state.電子郵件" type="hidden" />
      <input name="參加抽獎" v-model="state.參加抽獎" type="hidden" />
      <input name="備註" v-model="state.備註" type="hidden" />
      <UButton
        color="fuchsia"
        variant="solid"
        size="lg"
        :label="'送出訂單'"
        type="submit"
      ></UButton>
    </form>
  </div>
</template>

<style>
.confirm-container {
  width: 550px;
  max-width: 90vw;
  margin: auto;
}

.confirm-header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 1rem;
  margin-top: 1rem;
}

.subtitle {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  text-align: left;
  margin: 1rem 0 1rem;
}

.confirm-info-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin: 1rem 0 0;
}

.confirm-info-container div {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  margin: 0.5rem 0 0.5rem;
}
</style>
