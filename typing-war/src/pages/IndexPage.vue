<script setup>
import { ref } from 'vue'
import { usePlayerStore } from "stores/player";
import { useRouter, useRoute } from 'vue-router'

//router관련 변수
const router = useRouter();
const route = useRoute();

const count = ref(0);

const player = usePlayerStore();

function selectCharacter(val) {
  player.character = val;
}

const goHere = () => {
  if(player.character === 'blue'){
    router.push({ path:'/racing'});
  }else if(player.character === 'green'){
    router.push({ path:'/story' });
  }else{
    alert('장문과 단문 중 하나를 선택해 주세요.')
  }
}

</script>

<template>
  <q-page class="flex flex-center column">
    <div class="character-card">
<!--    <q-card class="character bg-red-2" @click="selectCharacter('red')">
      <q-card-section>
        RED
      </q-card-section>
    </q-card>-->
    <q-card class="character bg-green-2 flex q-mr-sm justify-center column" @click="selectCharacter('green')">
      <q-card-section class="flex justify-center long">
        <span class=" text-h4 text-bold">장문(오픈 준비중..)</span>
      </q-card-section>
    </q-card>
    <q-card class="character bg-blue-2 flex justify-center column" @click="selectCharacter('blue')">
      <q-card-section class="flex justify-center">
        <span class="short text-h4 text-bold">단어</span>
      </q-card-section>
    </q-card>
<!--    <q-card class="character bg-yellow-2" @click="selectCharacter('yellow')">
      <q-card-section>
        YELLOW
      </q-card-section>
    </q-card>-->
    </div>

    <div class="name-box">
      <!--  player name    -->
      <q-input :color="player.character ? player.character : ''" v-model="player.name" label="당신의 이름" >
        <template v-slot:append>
          <q-icon name="close" @click="player.name = ''" class="cursor-pointer" />
        </template>
      </q-input>
    </div>

    <div class="submit-btn q-mb-lg">
    <!--  submit    -->
    <!--  go normalstage.vue    -->
      <q-btn color="primary" label="시작" @click="goHere" />
    </div>
    <a href="https://www.flaticon.com/kr/free-icons/-" title="컴퓨터 키보드 아이콘">컴퓨터 키보드 아이콘  제작자: berkahicon - Flaticon</a>
  </q-page>
</template>

<style scoped lang="sass">

.character
  width: 10vw
  height: 10vw

.character:hover
  cursor: pointer


.long
  color: #00695C
  transition: 0.5s

.long:hover
  color: #de7009

.short
  color: #1565C4
  transition: 0.5s

.short:hover
  color: #a805fa

.character-card
  display: flex
  justify-content: center
  width: 50%

.name-box
  width: 10%
  margin-top: 2%

.submit-btn
  width: 10%
  display: flex
  justify-content: center
  margin-top: 2%

</style>
