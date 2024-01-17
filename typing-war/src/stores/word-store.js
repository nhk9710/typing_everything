import { defineStore } from 'pinia';
import words from '../word_data/words.json'

export const useWordStore = defineStore('words', {
  state: () => ({
    data: ''
  }),
  actions: {
  },
});
