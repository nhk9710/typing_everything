<script setup>
import {ref, onMounted, onUnmounted, watch} from 'vue';
import wordLump from '../../word_data/words.json'
import gsap from 'gsap'

//word config
let gameState = ref(false);
let endMessage = ref('');
let wordValue = ref('');
const typing = ref('');
const step = ref(1);
const moveSpeed = ref(5.5);
const npcSpeed = ref(10);
const babyMode = ref(false);
const newWord = () => {
  return wordValue.value = wordLump.item[Math.floor(Math.random() * 188687)]
}

// variable
let moveRange = ref(0);
let npcRange = ref(0);

//user
const moveBox = () => {
  moveRange.value += wordValue.value.length * moveSpeed.value;
  gsap.to(".green", {x : moveRange.value, duration:1});
};

const check_word = () => {
  if(wordValue.value === typing.value){
    newWord();
    moveBox();
    typing.value = '';
  }
};

//npc player
let moveNpc =
  setInterval(() => {
    npcRange.value += npcSpeed.value;
    gsap.to(".red", {x : npcRange.value, duration:1});
  },1000)

const retry = (state) => {
  if(state === 'baby' && !babyMode.value){
    moveSpeed.value += 2.5;
    babyMode.value = true;
  }else if(state === 'next'){
    step.value += 1;
    npcSpeed.value += 0.2;
  }
  moveRange.value = 0;
  npcRange.value = 0;
  gsap.to(".green", {x : moveRange.value, duration:1});
  gsap.to(".red", {x : npcRange.value, duration:1});
  gameState.value = false;
  endMessage.value = '';
  newWord();
  typing.value = '';
  moveNpc =
    setInterval(() => {
      npcRange.value += npcSpeed.value;
      npcRange.value = Math.round(npcRange.value * 10)/10
      gsap.to(".red", {x : npcRange.value, duration:1});
    },1000)
  console.log(npcSpeed.value);
}

newWord();
watch([moveRange, npcRange], () => {
  if(moveRange.value >= 20){
    gameState.value = true;
    endMessage.value = '그대의 승리'
    clearInterval(moveNpc);
  }
  if(npcRange.value >= 920){
    gameState.value = true;
    endMessage.value = '그대의 패배!!!'
    clearInterval(moveNpc);
  }
})
</script>


<template>
  <q-page class="racing-container flex flex-center column">
    <div class="box-container">
      <div class="box red"></div>
      <div class="box green"></div>
    </div>
    <div>
      <p class="text-bold text-h5 text-white">{{ wordValue }}</p>
    </div>
    <div>
      <q-input label="단어" v-model="typing" filled bg-color="white" @keyup.enter="check_word"/>
      <span class="text-pink-5 text-bold" v-if="babyMode">응애모드 ON!</span>
    </div>


    <!-- if game is over show dialog    -->
    <q-dialog v-model="gameState" >
      <q-card class="end-container">
        <q-card-section>
          <div class="text-h6">GAME OVER</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <p class="text-h5">{{ endMessage }}</p>
        </q-card-section>
        <q-card-actions align="right" v-if="endMessage === '그대의 승리'">
          <q-btn label="다음 단계" class="bg-green-3" @click="retry('next')" />
        </q-card-actions>
        <q-card-actions align="right" v-if="endMessage === '그대의 패배!!!'">
          <q-btn label="응애모드" v-if="!babyMode" class="bg-pink-5" @click="retry('baby')"/>
          <q-btn label="재도전" class="bg-red-5" @click="retry('again')"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
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

.box-container
  width: 50%
  border: 1px solid white
  display: flex
  flex-direction: column
  justify-content: start

.end-container
  width: 15vw

.red
  background-color: red
.green
  background-color: green
</style>
