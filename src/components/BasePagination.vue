<script setup lang="ts">
import { computed, defineProps, defineEmits, PropType } from "vue"

const props = defineProps({
  maxVisibleButtons: {
    type: Number,
    required: false,
    default: 3,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  perPage: {
    type: Number,
    required: true,
  },
  currentPage: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits<{
  (e: "pagechanged", value: number): void
}>()

const startPage = computed(() => {
  if (props.currentPage === 1) {
    return 1
  }

  if (props.currentPage === props.totalPages) {
    return props.totalPages - props.maxVisibleButtons + 1
  }

  return props.currentPage - 1
})

const pages = computed(() => {
  const range = []
  for (
    let i = startPage.value;
    i <=
    Math.min(startPage.value + props.maxVisibleButtons - 1, props.totalPages);
    i++
  ) {
    if (i > 0)
      range.push({
        name: i,
        isDisabled: i === props.currentPage,
      })
  }

  return range
})

const isInFirstPage = computed(() => {
  return props.currentPage === 1
})

const isInLastPage = computed(() => {
  return props.currentPage === props.totalPages
})

function onClickFirstPage() {
  emit("pagechanged", 1)
}

function onClickPreviousPage() {
  emit("pagechanged", props.currentPage - 1)
}

function onClickPage(page: number) {
  emit("pagechanged", page)
}

function onClickNextPage() {
  emit("pagechanged", props.currentPage + 1)
}

function onClickLastPage() {
  console.log(props.totalPages)
  emit("pagechanged", props.totalPages)
}

function isPageActive(page: number) {
  return props.currentPage === page
}
</script>

<template>
  <ul class="pagination">
    <li class="pagination-item">
      <button
        class="base-btn"
        type="button"
        @click="onClickFirstPage"
        :disabled="isInFirstPage"
      >
        First
      </button>
    </li>

    <li class="pagination-item">
      <button
        type="button"
        class="base-btn"
        @click="onClickPreviousPage"
        :disabled="isInFirstPage"
      >
        Previous
      </button>
    </li>

    <!-- Visible Buttons Start -->
    <li v-for="page in pages" :key="page" class="pagination-item">
      <button
        type="button"
        class="base-btn"
        @click="onClickPage(page.name)"
        :class="{ active: isPageActive(page.name) }"
      >
        {{ page.name }}
      </button>
    </li>

    <!-- Visible Buttons End -->

    <li class="pagination-item">
      <button
        class="base-btn"
        type="button"
        @click="onClickNextPage"
        :disabled="isInLastPage"
      >
        Next
      </button>
    </li>

    <li class="pagination-item">
      <button
        class="base-btn"
        type="button"
        @click="onClickLastPage"
        :disabled="isInLastPage"
      >
        Last
      </button>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
.pagination {
  list-style-type: none;
  margin: 20px;
  justify-content: center;
  display: flex;
}

.pagination-item {
  display: inline-block;
}

.base-btn {
  background: #ffffff;
  color: #4d4f56;
  border: none;
  border-radius: 40px;
  padding: 8px 12px;
  margin-right: 5px;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
  }

  &:hover {
    box-shadow: rgba(17, 17, 26, 0.1) 0px 8px 24px,
      rgba(17, 17, 26, 0.1) 0px 16px 56px, rgba(17, 17, 26, 0.1) 0px 24px 80px;
    font-weight: 700;
  }
}
.active {
  background-color: #c9ccd1;
  color: #ffffff;
  font-weight: 700;
}
</style>
