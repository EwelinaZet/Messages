import { defineStore, Store } from "pinia";
import axios from "axios";
import { InjectionKey } from 'vue'

interface Messages {
  email: string,
  title: string,
  date: string,
  id: string
}
export interface State {
  messages: Messages[]
}
export const key: InjectionKey<Store<State>> = Symbol()

export const useStore = defineStore({
  id: "main",
  state: () => ({
    messages: []
  }),
  actions: {
    async fetchMessages() {
      try {
        const getUserRes = await axios.get('https://64908c801e6aa71680cb737f.mockapi.io/api/messages_1', { params: { _format: "json" }});

        const [ mes1, mes2 ] = await Promise.all([
          axios.get('https://64908c801e6aa71680cb737f.mockapi.io/api/messages_1'),
          axios.get('https://64908c801e6aa71680cb737f.mockapi.io/api/messages_2')
        ])

        if (getUserRes.status >= 200 && getUserRes.status <= 205) {
          this.messages = [...mes1.data, ...mes2.data]
          return this.messages;
        }
      } catch (err) {
        this.messages = [];
        return false;
      }
    }
  },
});
