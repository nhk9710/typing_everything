<script setup>
import { ref } from 'vue'
import { usePlayerStore } from "stores/player";
import { storeToRefs } from 'pinia';

const count = ref(0);

const player = usePlayerStore();

function selectCharacter(val) {
  player.character = val;
}

</script>

<template>
  <q-page class="flex flex-center column">
    <div class="character-card">
    <q-card class="character bg-red-2" @click="selectCharacter('red')">
      <q-card-section>
        RED
      </q-card-section>
    </q-card>
    <q-card class="character bg-green-2" @click="selectCharacter('green')">
      <q-card-section>
        GREEN
      </q-card-section>
    </q-card>
    <q-card class="character bg-blue-2" @click="selectCharacter('blue')">
      <q-card-section>
        BLUE
      </q-card-section>
    </q-card>
    <q-card class="character bg-yellow-2" @click="selectCharacter('yellow')">
      <q-card-section>
        YELLOW
      </q-card-section>
    </q-card>
    </div>

    <div class="name-box">
      <!--  player name    -->
      <q-input :color="player.character ? player.character : ''" v-model="player.name" label="당신의 이름" >
        <template v-slot:append>
          <q-icon name="close" @click="player.name = ''" class="cursor-pointer" />
        </template>
      </q-input>
    </div>

    <div class="submit-btn">
    <!--  submit    -->
    <!--  go normalstage.vue    -->
      <q-btn color="primary" label="시작" @click="$router.push('/racing')" />
    </div>
  </q-page>
</template>

<style scoped lang="sass">

.character
  width: 10vw
  height: 10vw

.character:hover
  cursor: pointer

.character-card
  display: flex
  justify-content: space-between
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
