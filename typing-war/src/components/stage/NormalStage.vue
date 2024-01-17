<script setup>
import { useWordStore } from "stores/word-store";
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import worditem from '../../word_data/words.json'

let wordvalue = ''

const newword = () => {
  return wordvalue = worditem.item[Math.floor(Math.random() * 188687)]
}

const typing = ref('');

const score = ref(0);

const check_word = () => {
  if(wordvalue === typing.value){
    newword();
    typing.value = '';
    score.value += 10;
  }
}

newword()

</script>

<template>
  <q-page class="flex flex-center column">
    <div class="score-box">
      <p class="text-bold">SCORE : {{ score }}</p>
    </div>
    <div class="stage-ground flex flex-center">
      <p class="text-bold text-h5">{{ wordvalue }}</p>
    </div>
    <div>
      <q-input label="단어" v-model="typing" @keyup.enter="check_word"/>
    </div>
  </q-page>
</template>

<style scoped lang="sass">
.stage-ground
  width: 30%
  height: 100%
  border-radius: 10px
  background-color: antiquewhite

.score-box
  width: 30%
</style>
