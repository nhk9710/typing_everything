<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import wordLump from '../../word_data/words.json'
import gsap from 'gsap'
import worditem from "src/word_data/words.json";

//word config
let wordValue = ref('');
const typing = ref('');
const newWord = () => {
  return wordValue.value = worditem.item[Math.floor(Math.random() * 188687)]
}


//npc player

//user
let moveRange = ref(0)
let npcRange = ref(0)

const moveBox = () => {
  moveRange.value += 10;
  gsap.to(".green", {x : moveRange.value, duration:1});
}

const moveNpc = () => {
  setInterval(() => {
    npcRange.value += 10;
    gsap.to(".red", {x : npcRange.value, duration:1});
  },1000)
}

const check_word = () => {
  if(wordValue.value === typing.value){
    newWord();
    moveBox();
    typing.value = '';
  }
}
newWord();
moveNpc();
</script>


<template>
  <q-page class="racing-container flex flex-center column">
    <div class="box red"></div>
    <div class="box green"></div>
    <div>
      <p class="text-bold text-h5 text-white">{{ wordValue }}</p>
    </div>
    <div>
      <q-input label="단어" v-model="typing" filled bg-color="white" @keyup.enter="check_word"/>
    </div>
  </q-page>
</template>


<style scoped lang="sass">
.racing-container
  width: 100%
  height: 100vh
  background-color: #1f2040


.box
  width: 2vw
  height: 2vw
  border-radius: 5px
  margin-bottom: 2%

.red
  background-color: red
.green
  background-color: green
</style>
