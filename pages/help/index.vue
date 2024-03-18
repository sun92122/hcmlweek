<script setup>
import { useStore } from "~/store";
</script>

<template>
  <!-- 
HELP

🌱預購商品付款方式：
於正式週3/24-4/12期間，至竹苗週攤位付款（現金／LINE Pay）

🌱預購商品取貨地點及時間：
1. 熱食預購商品：
日期：
西大發：3/25-4/12
晌午粄食、彭老師野薑花粽、老街一口菜包：4/8-4/12
貢丸湯、酒釀湯圓、仙草凍：3/25、3/27、3/29
時間：12:30-13:00
地點：竹苗週攤位

2.非熱食預購商品：
日期：4/18、4/19 
時間：12:30-13:00 
地點：誠正中庭

▪︎若非熱食預購商品的領取時間不克前來，請將您方便的時間填在訂單備註💖

🤑預購抽獎資格：
於3/18-3/22下單滿60元即擁有抽獎資格！

🤑預購抽獎獎品：
1. 豪哥炸雞 10元折價券×10
2. 燈籠滷味創始店 10元折價券×10
3. 茶壜 20元折價券×20

（3/25會公布中獎名單於竹苗週IG帳號，折價券於取貨時一併領取）

🌱與竹苗的聯絡方式：
有任何其他疑問都可以私訊IG帳號：@hcmlweek
-->
  <UContainer
    :ui="{
      padding: 'px-0 sm:px-6',
    }"
  >
    <NuxtImg
      preload
      format="webp"
      src="/banner.webp"
      alt="banner"
      class="banner-container"
    />
  </UContainer>

  <div class="help-container font-sans">
    <div class="help-title-container">
      <span class="help-title">竹苗文化週</span>
      <span class="help-subtitle" id="payment">2024 師大竹苗文化週</span>
    </div>
    <div class="help-paragraph">
      <span>🌱預購商品付款方式：</span>
      <span class="ml-8"
        >於正式週3/24-4/12期間，至竹苗週攤位付款（現金／LINE Pay）</span
      >
    </div>
    <div class="help-paragraph">
      <span>🌱預購商品取貨地點及時間：</span>
      <span class="ml-4">1. 熱食預購商品：</span>
      <span class="ml-8">日期：</span>
      <span class="ml-8">貢丸湯、酒釀湯圓、仙草凍：3/25、3/27、3/29</span>
      <span class="ml-8">西大發：3/25-3/29</span>
      <span class="ml-8">晌午粄食、彭老師野薑花粽、老街一口菜包：4/8-4/12</span>
      <span class="ml-8">時間：12:30-13:00</span>
      <span class="ml-8">地點：竹苗週攤位</span>
      <span>　</span>
      <span class="ml-4">2. 非熱食預購商品：</span>
      <span class="ml-8">日期：4/18、4/19</span>
      <span class="ml-8">時間：12:30-13:00</span>
      <span class="ml-8">地點：誠正中庭</span>
      <span>　</span>
      <span
        >▪若非熱食預購商品的領取時間不克前來，請將您方便的時間填在訂單備註💖</span
      >
    </div>
    <div class="help-paragraph">
      <span id="lottery">🤑預購抽獎資格：</span>
      <span class="ml-8">於3/18-3/23下單滿60元即擁有抽獎資格！</span>
      <span>　</span>
      <span>🤑預購抽獎獎品：</span>
      <span class="ml-4">1. 豪哥炸雞 10元折價券×10</span>
      <span class="ml-4">2. 燈籠滷味創始店 10元折價券×10</span>
      <span class="ml-4">3. 茶壜 20元折價券×20</span>
      <span>　</span>
      <span>（3/25會公布中獎名單於竹苗週IG帳號，折價券於取貨時一併領取）</span>
    </div>
    <div class="help-paragraph">
      <span>🌱與竹苗的聯絡方式：</span>
      <span
        >　　有任何其他疑問都可以私訊IG帳號：<ULink
          to="https://www.instagram.com/hcmlweek"
          target="_blank"
          ><u>@hcmlweek</u></ULink
        ></span
      >
    </div>
    <div class="help-paragraph">
      <span
        >網站發生問題？
        <UButton
          label="嘗試移除 Cookie"
          variant="link"
          @click="
            () => {
              const store = useStore();
              store.$reset();
              const cookies = useCookie('store');
              cookies.value = null;
              reloadNuxtApp({ path: '/' });
            }
          "
        />
      </span>
      <span
        >本網站部署於
        <ULink
          to="https://www.cloudflare.com/zh-tw/developer-platform/pages/"
          target="_blank"
          ><u>Cloudflare Pages</u></ULink
        >
        ，原始碼可於
        <ULink to="https://github.com/sun92122/hcmlweek" target="_blank"
          ><u>GitHub</u></ULink
        >取得。</span
      >
    </div>
  </div>
</template>

<style>
.banner-container {
  padding: 0 0 0;
  width: 100%;
  height: auto;
  margin: auto;
}

.help-container {
  width: 550px;
  max-width: 90vw;
  margin: auto;
  text-align: left;
}

.help-title-container {
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}

.help-subtitle {
  font-size: 1.5rem;
  font-weight: normal;
}

.help-paragraph {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}
</style>
