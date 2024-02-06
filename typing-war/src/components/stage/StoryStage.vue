<script setup>
import Story from '../../word_data/story.json'
import {ref, watch, onMounted} from 'vue';

let nowText = ref(0); //현재 문장 번호
let nowAlphabet = ref(0); // 현재 입력한 단어 번호
let title = Story.story[0].title; // 선택한 장문 제목
let story = ref('') // 선택한 장문 문장
const answerText = ref('');
const storyLength = Story.story[0].content.length; //선택한 이야기의 문장 총 길이
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
  story.value = Story.story[0].content[nowText.value];
  nowAlphabet.value = 0;
}
const isIncorrect = (index) => {
  return index === nowAlphabet.value;
}
const isCorrect = (index) => {
  return index <= nowAlphabet.value && index < nowAlphabet.value
}

const isNotTyped = (index) => {
  return index >= nowAlphabet.value + answerText.value.length;
};

onMounted(() => {
  const findAnswerElement = () => {
    const answerElement = document.getElementById('answer');
    if (answerElement) {
      answerElement.addEventListener('input', () => {
        answerText.value = answerElement.innerText;
      });
    } else {
      setTimeout(findAnswerElement, 100);
    }
  };

  findAnswerElement();
});

newSentence(); //시작시 새로운 문장 호출
</script>

<template>
  <div>
    <q-page class="story-container flex column flex-center">
      <div class="flex justify-between" style="width: 50%">
        <span class="text-white text-bold q-mb-lg">진행도 : {{ nowText + 1 }} / {{ storyLength }}</span>
        <span class="text-bold text-white">타수 : {{ nowAlphabet + 1 }} / {{ storyLength }}</span>
      </div>
      <div style="width: 50%" class="flex column flex-center">
        <div>
          <span class="text-h4 text-white text-bold q-mb-lg">제목 : {{ title }}</span>
        </div>
      <p id="sentence" class="text-h5 q-mt-lg">
        <span v-for="(char, index) in story" :key="index" :class="{ 'wordFalse': isIncorrect(index), 'wordCorrect': isCorrect(index), 'wordNotTyped': isNotTyped(index) }">{{char}}</span>
      </p>
        <div
          id="answer"
          contenteditable="true"
          class="text-white text-h6 text-bold q-mt-lg"
          @input="myType"
          style="width: 100%; height: 10vh; border: 1px solid white; border-radius: 5px">
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

#sentence
  color: white

.wordCorrect
  color: #69ff24
.wordFalse
  color: red
</style>
