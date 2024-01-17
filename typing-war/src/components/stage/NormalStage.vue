<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import worditem from '../../word_data/words.json'

let wordvalue = ''

const newword = () => {
  return wordvalue = worditem.item[Math.floor(Math.random() * 188687)]
}

const typedText = ref('');
const startTime = ref(0);
const kpm = ref(0);

const handleInput = () => {
  if (!startTime.value) {
    startTime.value = Date.now();
    setInterval(updateKPM, 1000);
  }
};

const updateKPM = () => {
  const elapsedTime = (Date.now() - startTime.value) / 1000 / 20;
  kpm.value = Math.round((typing.value.length / elapsedTime) * 60);
};

onMounted(() => {
  document.addEventListener('keydown', handleInput);
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleInput);
});

//user input value
const typing = ref('');

//typing combo value
const progress = ref(0.4);

//typing success score
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
      <q-linear-progress class="combo-progress" :value="progress" />
    </div>
    <div class="stage-ground flex flex-center">
      <p class="text-bold text-h5">{{ wordvalue }}</p>
    </div>
    <div>
      <q-input label="단어" v-model="typing" @keyup.enter="check_word" @input="handleInput"/>
    </div>
    <div>
      <p>속도 : {{ kpm }}</p>
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
  display: flex
  justify-content: space-between

.combo-progress
  width: 30%
</style>
