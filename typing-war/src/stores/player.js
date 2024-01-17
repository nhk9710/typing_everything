import { defineStore } from 'pinia'


export const usePlayerStore = defineStore('player', {
  state: () => ({
    name: 'player',
    step: 1,
    character : '',
    heart : 10
  }),
  actions: {
  }

})
