<script setup>
import {ref,watch} from 'vue';
import wordLump from '../../word_data/words.json'
import gsap from 'gsap'

//word config, 전역 변수 모음 ========================
let gameState = ref(false); //게임 패배 또는 승리 시 활성화 변수
let gamePause = ref(false); // 게임 일시정지 활성화 변수
let endMessage = ref(''); // 현 스테이지 종료시 메시지 변수
let wordValue = ref(''); //입력해야 할 단어 변수
const typing = ref(''); // 플레이어 입력 변수
const step = ref(1); // 스테이지 단계 변수
const moveSpeed = ref(5.5); // 플레이어 움직임 속도 변수
const npcSpeed = ref(10); // NPC 움직임 속도 변수
const babyMode = ref(false); // 응애모드 활성화 변수
let count = ref(3); //게임 시작 전 카운트 다운 변수
//변수 모음 끝 ================================

//새로운 단어 선언 함수
const newWord = () => {
  return wordValue.value = wordLump.item[Math.floor(Math.random() * 188687)]
}

// variable, 플레이어 및 NPC 도달 좌표 변수
let moveRange = ref(0);
let npcRange = ref(0);

//user, 플레이어 움직임 함수
const moveBox = () => {
  moveRange.value += wordValue.value.length * moveSpeed.value;
  gsap.to(".green", {x : moveRange.value, duration:1});
};

//정답 입력시 체크 하는 코드
const check_word = () => {
  if(wordValue.value === typing.value){
    newWord();
    moveBox();
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
  moveNpc = setInterval(() => {
    npcRange.value += npcSpeed.value;
    gsap.to(".red", {x : npcRange.value, duration:1});
  },1000);
  gamePause.value = false;
  typing.value = '';
}

//재도전,응애모드 실행 관련 함수
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
    },1000);
  setTimeout(startCountdown, 1000);
}

const startCountdown = () => {
  const timer = setInterval(() => {
    count.value--;
    if(count.value === 0){
      clearInterval(timer);
      moveNpc = setInterval(() => {
        npcRange.value += npcSpeed.value;
        gsap.to(".red", {x : npcRange.value, duration:1});
      },1000)
    }
  },1000);
}

//새로운 단어 선언 함수 실행
newWord();
setTimeout(startCountdown, 1000);
//게임 승패 여부 관련 감시 코드
watch([moveRange, npcRange], () => {
  if(moveRange.value >= 920){
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
    <div>
      <span class="text-h5 text-white text-bold">STAGE : {{ step }}</span>
    </div>
    <div v-if="count > 0">
      <span class="text-h5 text-white text-bold">시작 {{ count }} 초 전...</span>
    </div>
    <div class="box-container">
      <div class="box red"></div>
      <div class="box green"></div>
    </div>
    <div draggable="false" class="disable-dblclick">
      <p class="text-bold text-h5 text-white disable-dblclick">{{ wordValue }}</p>
    </div>
    <div>
      <q-input
        label="단어"
        v-model="typing"
        filled
        bg-color="white"
        :disable="count > 0"
        @keyup.enter="check_word"
        @keyup.space="pauseGame"/>
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
          <q-btn label="다음 단계" class="bg-green-3 text-bold text-white" @click="retry('next')" />
        </q-card-actions>
        <q-card-actions align="right" v-if="endMessage === '그대의 패배!!!'">
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
  border: 1px solid white
  display: flex
  flex-direction: column
  justify-content: start
  border-radius: 5px

.end-container
  width: 15vw

.red
  background-color: red
  margin-bottom: 2%
.green
  background-color: green
</style>
