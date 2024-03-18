<script setup lang="ts">
const router = useRouter();
</script>

<template>
  <div class="submited-container font-sans">
    <div class="subtitle">
      <span class="text-2xl">訂單已送出</span>
    </div>
    <div class="subtitle">
      <span>
        感謝您的訂購，您的訂單已送出，請記得於正式週至竹苗週攤位付款。
      </span>
    </div>
  </div>
  <UButton
    color="fuchsia"
    variant="solid"
    size="lg"
    @click="() => router.push('/')"
    >返回首頁</UButton
  >
</template>

<style>
.submited-container {
  width: 550px;
  max-width: 90vw;
  margin: auto;
}

.subtitle {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  text-align: left;
  margin: 1rem 0 1rem;
}
</style>
