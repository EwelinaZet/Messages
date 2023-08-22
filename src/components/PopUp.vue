<script setup lang="ts">
import { computed, defineProps, defineEmits, PropType } from "vue"
import moment from "moment"
import Messages from "@/types/Messages"

const props = defineProps({
  message: {
    type: Object as PropType<Messages>,
    required: true,
  },
})

const emit = defineEmits<{
  (e: "popup-visible", value: boolean): void
}>()

function handleClose() {
  emit("popup-visible", false)
}

function dateFormat(value: string) {
  if (!value) return
  return moment(value).format("MMM Do, YYYY")
}
</script>

<template>
  <div class="container">
    <div class="container-overlay" @click="handleClose" />
    <div class="container-message">
      <img src="@/assets/icons/close.png" @click="handleClose" />
      <div class="container-message-date">{{ dateFormat(message.value.date) }}</div>
      <div class="container-message-email">
        <img src="@/assets/icons/user.png" @click="handleClose" />{{
          message.value.email
        }}
      </div>
      <div class="container-message-title">{{ message.value.title }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: 20;
  font-size: 20px;

  &-overlay {
    background: rgba(23, 49, 59, 0.3);
    backdrop-filter: blur(2px);
    position: absolute;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1;
  }

  &-message {
    width: 710px;
    height: fit-content;
    background: white;
    overflow: auto;
    position: relative;
    z-index: 2;
    padding: 20px;
    padding: 40px 20px;
    border-radius: 15px;

    &-email {
      font-weight: 600;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding-bottom: 20px;
      border-bottom: 1px solid rgba(17, 17, 26, 0.1);

      > img {
        width: 40px;
        height: 40px;
        margin-right: 20px;
      }
    }

    &-date {
      padding-top: 12px;
      display: flex;
      justify-content: flex-end;
      font-size: 12px;
    }

    &-title {
      padding: 10px 0 0 10px;
      font-size: 22px;
      text-align: start;
    }

    > img {
      width: 24px;
      height: 24px;
      position: absolute;
      top: 12px;
      right: 12px;
      cursor: pointer;
    }
  }
}
</style>
