<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useStore } from "@/stores/index";
import BasePagination from "@/components/BasePagination.vue";
import PopUp from "@/components/PopUp.vue";
import moment from 'moment'

const store = useStore();

const currentPage = ref(1);

const perPage = ref(10);

let messages = ref([]);

let messagesList = ref([]);

let search = ref("");

let isVisible = ref(false);

let showMessage = reactive({});

const getMessages = computed(() => {
  return store.messages;
});

const getTotalPages = computed(() => {
  return Math.ceil(messagesList.value.length / perPage.value);
});

onMounted(async () => {
  await store.fetchMessages();
  messages.value = getMessages.value;
  messagesList.value = getMessages.value;
  visibleRows();
  sortByDate();
});

function sortByDate() {
  return messages.value.sort((a, b) =>
    a["date"] !== b["date"] ? (a["date"] < b["date"] ? 1 : -1) : 0
  );
}

function sortTableItems(value) {
  return messages.value.sort((a, b) =>
    a[value] !== b[value] ? (a[value] < b[value] ? -1 : 1) : 0
  );
}

function onPageChange(page) {
  console.log('onPageChange', page)
  currentPage.value = page;
  visibleRows();
}

function visibleRows() {
  const startIndex = (currentPage.value - 1) * 10;
  const endIndex = startIndex + 10 - 1;
  messages.value = messagesList.value.filter(
    (el, index) => index >= startIndex && index <= endIndex
  );
  return messages.value;
}

function handleMessageSearch() {
  let searchWord = search.value?.trim() || "";
  let newArray = getMessages.value.map((a) => ({ ...a }));
  newArray = newArray.filter((item) =>
    item.title.toLowerCase().includes(searchWord)
  );

  messagesList.value = newArray;
  currentPage.value = 1
  visibleRows();
}

function handleShowMessage (value) {
  console.log('value', showMessage.value)
  showMessage.value = value
  isVisible.value = true
}

function handleClose () {
  return isVisible.value = false
}

function dateFormat (value) {
  return moment(value).format('MMM Do, YYYY')
}
</script>

<template>
  <div>
    <input v-model="search" placeholder="Search" class="search" @input="handleMessageSearch" >
  </div>
  <div class="messages">
    <div class="messages-header">
      <div class="messages-header-icon">Type</div>
      <div class="messages-header-title" @click="sortTableItems('title')">
        Title <img src="@/assets/arrow.svg" class="arrow"/>
      </div>
      <div class="messages-header-date" @click="sortByDate('date')">
        Date <img src="@/assets/arrow.svg" class="arrow"/>
      </div>
      <div class="messages-header-email" @click="sortTableItems('email')">
        From <img src="@/assets/arrow.svg" class="arrow"/>
      </div>
    </div>
    <div v-for="message in messages" :key="message.id" class="messages-table" @click="handleShowMessage(message)">
      <div class="messages-table-icon">
        <img src="@/assets/email.png" />
      </div>
      <div class="messages-table-title">{{ message.title }}</div>
      <div class="messages-table-date">{{ dateFormat(message.date) }}</div>
      <div class="messages-table-from">{{ message.email }}</div>
    </div>
  </div>

  <BasePagination
    v-if="messagesList.length"
    :totalPages="getTotalPages"
    :perPage="perPage"
    :currentPage="currentPage"
    @pagechanged="onPageChange"
  />

  <PopUp v-if="isVisible" :message="showMessage" @popup-visible="handleClose"/>
</template>

<style lang="scss" scoped>
.search {
  background: #ffffff;
  color: #4d4f56;
  border: 1px solid #282b31;
  border-radius: 40px;
  padding: 8px 12px;
  margin: 15px 0;

  &:focus {
    border: 1px solid #282b31;
  }
}
.messages {
  border: 1px solid #0f131d;
  border-width: 1px 1px 0 1px;
  width: 1000px;

  &-header {
    display: flex;
    border-bottom: 1px solid #0f131d;
    padding: 12px;
    font-size: 17px;
    font-weight: 700;
    color: #282b31;

    > div:not(:first-child) {
      width: 30%;
      display: flex;
    }

    &-icon {
      width: 10%;
    }

    &-date {
      padding-left: 30px;
    }

    .arrow {
      margin-left: 10px;
    }
  }
  &-table {
    width: 1000px;
    display: flex;
    border-bottom: 1px solid #0f131d;
    padding: 12px;

    > div:not(:first-child) {
      width: 30%;
    }

    > img {
      margin-left: 10px;
    }

    &-icon {
      width: 10%;
      > img {
        width: 40px;
      }
    }

    &-title {
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;

    }

    &-date {
      padding-left: 30px;
    }
  }
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
