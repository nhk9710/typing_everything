<script setup>
import Story from '../../word_data/story.json'
import {ref, watch} from 'vue';

let nowText = ref(0);
let nowAlphabet = ref(0);
let title = Story.story[0].title; // 선택한 장문 제목
let story = ref('') // 선택한 장문 문장

const myType = () => {
  let text = document.getElementById('answer');
  if(story.value.split('')[nowAlphabet.value] === document.getElementById('answer').innerHTML[nowAlphabet.value]){
    nowAlphabet.value += 1;
    if(text.innerHTML === story.value){
      nowText.value += 1;
      newSentence();
      text.innerHTML = '';
    }
  }
}

const newSentence = () => {
  return story.value = Story.story[0].content[nowText.value];
}

newSentence();


</script>

<template>
  <div>
    <q-page class="story-container flex column flex-center">
      <div style="width: 50%">
      <span class="text-h5 text-white">{{ story }}</span>
        <div
          id="answer"
          contenteditable="true"
          class="text-white text-h5 text-bold"
          @input="myType"
          style="width: 100%; height: 10vh; border: 1px solid white">
        </div>
      </div>
    </q-page>
  </div>
</template>


<style scoped lang="sass">
.story-container
  width: 100%
  height: 100vh
  background-color: #1f2040
</style>
