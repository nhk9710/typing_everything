<script setup>
import {ref,watch} from 'vue';
import wordLump from '../../word_data/words.json'
import { usePlayerStore } from "stores/player";

//word config, 전역 변수 모음 ========================
let gameState = ref(false); //게임 패배 또는 승리 시 활성화 변수
let gamePause = ref(false); // 게임 일시정지 활성화 변수
let endMessage = ref(''); // 현 스테이지 종료시 메시지 변수
let wordValue = ref(''); //입력해야 할 단어 변수
const typing = ref(''); // 플레이어 입력 변수
const step = ref(1); // 스테이지 단계 변수
const moveSpeed = ref(0.005); // 플레이어 움직임 속도 변수
const npcSpeed = ref(0.005); // NPC 움직임 속도 변수
const babyMode = ref(false); // 응애모드 활성화 변수
let count = ref(3); //게임 시작 전 카운트 다운 변수
const userName = usePlayerStore();

let gameVal = ref('');

let npcValue = ref(0);
let userValue = ref(0);
//변수 모음 끝 ================================

//새로운 단어 선언 함수
const newWord = () => {
  return wordValue.value = wordLump.item[Math.floor(Math.random() * 188658)]
}
console.log(usePlayerStore())
//user, 플레이어 프로그레스 바 변화 함수

//정답 입력시 체크 하는 코드
const check_word = () => {
  if(wordValue.value === typing.value){
    userValue.value += wordValue.value.length * moveSpeed.value
    newWord();
    typing.value = '';
  }
};

//npc player, NPC움직임 관련 변수
let moveNpc = ''


//게임 일시정지 함수
const pauseGame = () => {
  clearInterval(moveNpc);
  gamePause.value = true;
}

//게임 재실행 함수
const resumeGame = () => {
  gamePause.value = false;
  typing.value = '';
}

//재도전,응애모드 실행 관련 함수
const retry = (state) => {
  count.value = 3;
  if(state === 'baby' && !babyMode.value){
    moveSpeed.value += 0.005;
    babyMode.value = true;
  }else if(state === 'next'){
    step.value += 1;
    npcSpeed.value += 0.001;
  }
  gameState.value = false;
  npcValue.value = 0;
  userValue.value = 0;
  endMessage.value = '';
  newWord();
  typing.value = '';
  setTimeout(startCountdown, 1000);
}

const startCountdown = () => {
  const timer = setInterval(() => {
    count.value--;
    if(count.value === 0){
      clearInterval(timer);
      moveNpc = setInterval(() => {
        npcValue.value += 0.005
      },500)
    }
  },1000);
}

//새로운 단어 선언 함수 실행
newWord();
setTimeout(startCountdown, 500);
//게임 승패 여부 관련 감시 코드
watch([userValue, npcValue], () => {
  if(parseFloat(npcValue.value.toFixed(4)) >= 1 && parseFloat(userValue.value.toFixed(4)) <= 1){
    gameState.value = true;
    gameVal.value = 'Lose';
    endMessage.value = userName.name + '의 패배!!'
    clearInterval(moveNpc);
  }
  if(parseFloat(userValue.value.toFixed(4)) >= 1 && parseFloat(npcValue.value.toFixed(4)) <= 1){
    gameState.value = true;
    gameVal.value = 'Win';
    endMessage.value = userName.name + '의 승리!!!'
    clearInterval(moveNpc);
  }
})
</script>


<template>
  <div>
    <div class="chk-contain"></div>
  <q-page class="racing-container flex flex-center column">
    <div class="q-mb-lg">
      <span class="text-h4 text-white text-bold">STAGE : {{ step }}</span>
    </div>
    <div v-if="count > 0">
      <span class="text-h5 text-white text-bold">시작 {{ count }} 초 전...</span>
    </div>
    <div class="box-container">
      <q-linear-progress class="q-mb-sm" stripe track-color="grey-2" color="negative" rounded size="20px" :value="npcValue"></q-linear-progress>
      <q-linear-progress track-color="grey-2" color="positive" rounded size="20px" :value="userValue"></q-linear-progress>
    </div>
    <div draggable="false" class="disable-dblclick q-mt-lg">
      <p class="text-bold text-h5 text-white disable-dblclick">{{ wordValue }}</p>
    </div>
    <div>
      <template v-if="count === 3">
        <span class="text-h4 text-white text-bold">Ready...</span>
      </template>
      <template v-if="count ===  2">
        <span class="text-h4 text-white text-bold">Set....</span>
      </template>
      <template v-if="count === 1">
        <span class="text-h4 text-white text-bold">Go!!!</span>
      </template>
      <template v-if="count === 0">
      <q-input
        label="단어"
        v-model="typing"
        filled
        bg-color="white"
        autofocus
        @keyup.enter="check_word"
        @keyup.space="pauseGame"/>
      </template>
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
        <q-card-actions align="right" v-if="gameVal === 'Win'">
          <q-btn label="다음 단계" class="bg-green-3 text-bold text-white" @click="retry('next')" />
        </q-card-actions>
        <q-card-actions align="right" v-if="gameVal === 'Lose'">
          <q-btn label="응애모드" v-if="!babyMode" class="bg-pink-5 text-bold text-white" @click="retry('baby')"/>
          <q-btn label="재도전" class="bg-red-5 text-bold text-white" @click="retry('again')"/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- if game is pause show dialog   -->
    <q-dialog v-model="gamePause" >
      <q-card class="end-container">
        <q-card-section>
          <div class="text-h6">GAME PAUSE</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <p class="text-h5">일시정지</p>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="게임 재개" class="bg-blue-9 text-bold text-white" @click="resumeGame()" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
  </div>
</template>


<style scoped lang="sass">
.racing-container
  width: 100%
  height: 100vh
  background-color: #1f2040

.disable-dblclick
  pointer-events: none
  user-select: none

.box
  width: 2vw
  height: 2vw
  border-radius: 5px

.box-container
  width: 50%
  display: flex
  flex-direction: column
  justify-content: start
  border-radius: 5px

.end-container
  width: 15vw

.chk-contain
  border: 1px solid red

.red
  background-color: red
  margin-bottom: 2%
.green
  background-color: green
</style>
