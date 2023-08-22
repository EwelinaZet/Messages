<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue"
import { useStore } from "@/stores/index.js"
import BasePagination from "@/components/BasePagination.vue"
import PopUp from "@/components/PopUp.vue"
import moment from "moment"
import Messages from "@/types/Messages"
import SortTable from "@/types/SortTable"
import { emptyTable } from "@/data/emptyTable.js"

const store = useStore()

const currentPage = ref<number>(1)

const perPage = ref<number>(10)

let search = ref<string>("")

let isVisible = ref<boolean>(false)

let messages = ref<Messages[] | []>([])

let messagesList = ref<Messages[] | []>([])

let showMessage = reactive<Messages | {}>({})

const getMessages = computed(() => {
  return store.messages
})

const getTotalPages = computed(() => {
  return Math.ceil(messagesList.value.length / perPage.value)
})

onMounted(async () => {
  messages.value = emptyTable
  await store.fetchMessages()
  messages.value = getMessages.value
  messagesList.value = getMessages.value
  visibleRows()
  sortByDate()
})

function sortByDate() {
  return messages.value.sort((a, b) =>
    a["date"] !== b["date"] ? (a["date"] < b["date"] ? 1 : -1) : 0
  )
}

function sortTableItems(value: SortTable) {
  return messages.value.sort((a, b) =>
    a[value] !== b[value] ? (a[value] < b[value] ? -1 : 1) : 0
  )
}

function onPageChange(page: number) {
  currentPage.value = page
  visibleRows()
}

function visibleRows() {
  const startIndex = (currentPage.value - 1) * 10
  const endIndex = startIndex + 10 - 1
  messages.value = messagesList.value.filter(
    (el, index) => index >= startIndex && index <= endIndex
  )
  return messages.value
}

function handleMessageSearch() {
  let searchWord = search.value?.trim() || ""
  let newArray = getMessages.value.map((a: any) => ({ ...a }))
  newArray = newArray.filter((item) =>
    item.title.toLowerCase().includes(searchWord)
  )

  messagesList.value = newArray
  currentPage.value = 1
  visibleRows()
}

function handleShowMessage(value: Object) {
  showMessage.value = value
  console.log(value, showMessage)
  isVisible.value = true
}

function handleClose() {
  return (isVisible.value = false)
}

function dateFormat(value: string) {
  if (!value) return
  return moment(value).format("MMM Do, YYYY")
}
</script>

<template>
  <div class="search-box">
    <div>
      <input
        v-model="search"
        placeholder="Search"
        class="search"
        @input="handleMessageSearch"
      />
    </div>
    <div class="messages">
      <div class="messages-header">
        <div class="messages-header-icon">Type</div>
        <div class="messages-header-title" @click="sortTableItems('title')">
          Title <img src="@/assets/icons/arrow.svg" class="arrow" />
        </div>
        <div class="messages-header-date" @click="sortByDate">
          Date <img src="@/assets/icons/arrow.svg" class="arrow" />
        </div>
        <div class="messages-header-email" @click="sortTableItems('email')">
          From <img src="@/assets/icons/arrow.svg" class="arrow" />
        </div>
      </div>
      <div
        v-for="message in messages"
        :key="message.id"
        class="messages-table"
        @click="handleShowMessage(message)"
      >
        <div class="messages-table-icon">
          <img src="@/assets/icons/email.png" />
        </div>
        <div class="messages-table-title">
          <div class="text">{{ message.title }}</div>
          <div v-if="!message.title" class="loader"></div>
        </div>
        <div class="messages-table-date">
          {{ dateFormat(message.date) }}
          <div v-if="!dateFormat(message.date)" class="loader"></div>
        </div>
        <div class="messages-table-from">
          {{ message.email }}
          <div v-if="!message.email" class="loader"></div>
        </div>
      </div>
    </div>

    <BasePagination
      v-if="messagesList.length"
      :totalPages="getTotalPages"
      :perPage="perPage"
      :currentPage="currentPage"
      @pagechanged="onPageChange"
    />

    <PopUp
      v-if="isVisible"
      :message="showMessage"
      @popup-visible="handleClose"
    />
  </div>
</template>

<style lang="scss" scoped>
.search-box {
  height: 1000px;
  .search {
    background: #ffffff;
    color: #4d4f56;
    border: none;
    border-radius: 40px;
    padding: 8px 12px;
    margin: 15px 0;
    cursor: pointer;
    outline: none;

    &:focus {
      box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px,
      rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px;
    }
  }
  .messages {
    border-width: 1px 1px 0 1px;
    border-radius: 15px;
    width: 1000px;
    background: white;
    box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px,
      rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px;

    &-header {
      display: flex;
      border-bottom: 1px solid rgba(17, 17, 26, 0.1);
      padding: 12px;
      font-size: 17px;
      font-weight: 700;
      color: #282b31;

      > div:not(:first-child) {
        width: 30%;
        display: flex;
      }

      &-icon {
        width: 13%;
        opacity: 0.4;
      }

      &-date,
      &-title,
      &-email {
        padding-left: 30px;
        opacity: 0.4;
        > img {
          cursor: pointer;
        }
        &:hover {
          opacity: 1 !important;
        }

      }

      .arrow {
        margin-left: 10px;
      }
    }
    &-table {
      width: 1000px;
      display: flex;
      padding: 12px;
      cursor: pointer;
      border-bottom: 1px solid rgba(17, 17, 26, 0.1);

      &:last-child{
        border-bottom: none;
        border-bottom-right-radius: 15px;
        border-bottom-left-radius: 15px;
      }

      &:hover {
        box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px,
          rgba(17, 17, 26, 0.1) 0px 8px 24px,
          rgba(17, 17, 26, 0.1) 0px 16px 56px;
      }
      > div:not(:first-child) {
        width: 30%;
      }

      > img {
        margin-left: 10px;
      }

      &-icon {
        width: 13%;
        > img {
          width: 40px;
        }
      }

      &-title {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .text {
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          text-align: justify;
        }
      }

      &-date {
        padding-left: 30px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }

      &-from {
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }

      .loader {
        border: 4px solid #f3f3f3;
        border-top: 4px solid #3498db;
        border-radius: 50%;
        width: 18px;
        height: 18px;
        animation: spin 2s linear infinite;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    }
  }

  @media (min-width: 1024px) {
    .greetings h1,
    .greetings h3 {
      text-align: left;
    }
  }
}
</style>
