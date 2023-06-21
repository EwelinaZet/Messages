<script setup>
import { computed, defineProps, defineEmits } from "vue";

const props = defineProps({
  message: {
    type: Object,
  }
});

const emit = defineEmits(["input"]);

function handleClose () {
  emit('popup-visible', false)
}

</script>

<template>
  <div class="container">
    <div
      class="container-overlay"
      @click="handleClose"
    />
    <div class="container-message">
      <img src="@/assets/close.png" @click="handleClose"/>
      <div class="container-message-email">{{ message.value.email }}</div>
      <div class="container-message-date">{{ message.value.date }}</div>
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

    &-email {
      font-weight: 600;
    }

    &-date {
      padding: 12px 0 24px 0;
    }

    &-title {
      padding-left: 10px;
      font-size: 22px;
    }

    > img {
      width: 24px;
      height: 24px;
      position: absolute;
      top: 12px;
      right: 12px;
    }
  }
}
</style>
