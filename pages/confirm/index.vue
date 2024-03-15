<script setup lang="ts">
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
</style>
