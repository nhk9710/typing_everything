<script setup>
import Story from '../../word_data/story.json'
import {ref, watch, onMounted} from 'vue';

let nowText = ref(0); //현재 문장 번호
let nowAlphabet = ref(0); // 현재 입력한 단어 번호
let title = ref('이야기를 선택해 주세요'); // 선택한 장문 제목
let story = ref('') // 선택한 장문 문장
const answerText = ref('');
const storyLength = ref(0); //선택한 이야기의 문장 총 길이

let isStory = ref(true); // 선택한 이야기 유무
let storyIndex = ref(0); //선택한 이야기 index

let combo = ref(0); // 연속적으로 정확히 입력하면 증가

let startTime = ref(0); // 타이핑 시작 시간을 저장하는 변수
let lastTypedTime = ref(0); // 마지막 타이핑 발생 시간을 저장하는 변수
let typedCharacters = ref(0); // 현재 문장에서 사용자가 타이핑한 총 문자수를 저장하는 변수
let viewWpm = ref(0); // 화면에 보여지는 wpm 값
const myType = () => {
  let text = document.getElementById('answer');

  if(text.innerText[nowAlphabet.value] !== story.value[nowAlphabet.value]){
    if(nowText.value !== 0 && nowAlphabet.value === 0){
      text.innerHTML = '';
    }
    // nowAlphabet.value = text.innerText.length;
  }else{
    combo.value += 1;
    nowAlphabet.value += 1;
    if (text.innerText === story.value) {
      nowText.value += 1;
      newSentence();
    }

    lastTypedTime.value = Date.now();
    if (nowAlphabet.value === 1) {
      startTime.value = lastTypedTime.value;
    }
    typedCharacters.value += 1;
    animation();
  }
}

const countBackSpace = (e) => {
  console.log(e.code)
  if(e.code === 'Backspace'){
    combo.value = 0;
  }
}

const newSentence = () => { //새로운 문장 호출 함수
  let text = document.getElementById('answer')
  const { content } = Story.story[storyIndex.value];
  text.innerHTML = '';
  story.value = content[nowText.value];
  startTime.value = Date.now();
  nowAlphabet.value = 0;
  typedCharacters.value = 0;
}

const calculateWpm = () => { //wpm 계산 함수
  const elapsedTime = (Date.now() - startTime.value) / 1000;
  if(elapsedTime !== 0) {
    viewWpm.value = (typedCharacters.value / elapsedTime) * 60;
  }
}

const animation = () => { // 계산 성능 처리 관련 함수
  requestAnimationFrame(animation);
  calculateWpm();
}

const isIncorrect = (index) => { // 오타 일 때 처리 로직
  if(story.value[index] === ' ') {
    return false;
  }
  return index < nowAlphabet.value &&
    story.value.split('')[index] !== answerText.value[index];
}
const isCorrect = (index) => { //정답일때 처리 로직
  return index < nowAlphabet.value &&
    story.value.split('')[index] === answerText.value[index];
}

const isNotTyped = (index) => { //입력이 안된 상태일때
  return index >= nowAlphabet.value &&
    story.value.split('')[index] !== ' ';
}

onMounted(() => {
  const findAnswerElement = () => {
    const answerElement = document.getElementById('answer');
    if (answerElement) {
      answerElement.addEventListener('input', () => {
        answerText.value = answerElement.innerText;
      });
    } else {
      requestAnimationFrame(findAnswerElement);
    }
  };

  findAnswerElement();
});

const selectStory = (index) => { // Select story function
  const selectedStory = Story.story[index];
  storyIndex.value = index;
  title.value = selectedStory.title;
  storyLength.value = selectedStory.content.length;
  isStory.value = false;
  newSentence();
}
</script>

<template>
  <div>
    <q-page class="story-container flex column flex-center">
      <div class="flex justify-between" style="width: 50%">
        <span class="text-white text-bold q-mb-lg">진행도 : {{ nowText + 1 }} / {{ storyLength }}</span>
        <span class="text-bold text-white">타수 : {{ Math.round(viewWpm) }}</span>
      </div>
      <div style="width: 50%" class="flex column flex-center">
        <div>
          <span class="text-h5 text-white text-bold q-mb-lg">제목 : {{ title }}</span>
        </div>
      <p id="sentence" class="text-h5 text-weight-bolder q-mt-lg">
        <span v-for="(char, index) in story" :key="index" :class="{ 'wordFalse': isIncorrect(index), 'wordCorrect': isCorrect(index), 'wordNotTyped': isNotTyped(index) }">{{char}}</span>
      </p>
        <div
          id="answer"
          contenteditable="true"
          class="text-h6 text-bold q-mt-lg"
          @input="myType"
          @keydown.enter="(e) => e.preventDefault()"
          @keydown="countBackSpace($event)"
          style="width: 100%; height: 10vh; border: 1px solid white; background-color: #F4F4F4; border-radius: 5px">
        </div>
        <span class="text-white text-bold text-h6 q-mt-lg">콤보 : {{ combo }}</span>
      </div>

      <q-dialog v-model="isStory">
        <q-card>
          <q-card-section>
            <div class="text-h6">이야기를 선택해 주세요.</div>
          </q-card-section>

          <q-card-section>
            <q-item
              v-for="(item, index) in Story.story"
              :key="index"
              clickable
              style="border-radius: 10px"
            >
              <q-item-section @click="selectStory(index)">
                <p class="text-bold">{{ item.title }}</p>
              </q-item-section>
            </q-item>
          </q-card-section>
        </q-card>
      </q-dialog>
    </q-page>
  </div>
</template>


<style scoped lang="sass">

.story-container
  width: 100%
  height: 100vh
  background-color: #2d2c2f


#sentence
  color: white
  transition: 0.5s

#answer:focus
    outline: none

.wordNotTyped
  color: white
.wordCorrect
  color: #69ff24
  transition: 0.5s
.wordFalse
  color: red
  transition: 0.5s
</style>
