const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"))
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull")
const loader = document.getElementById("loader");
const game = document.getElementById("game");


let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];


fetch("https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple")
.then(res =>{
    return res.json();
})
.then(loadedQuestions =>{
    console.log(loadedQuestions.results);
    // we format the questions from the db to match that we used
   questions = loadedQuestions.results.map(loadedQuestion =>{
        const formattedQuestion = {
            question: loadedQuestion.question
        };
        // store incorrect choices in an array and assign the correct 
        // answer to a random position. 
        const answerChoices = [...loadedQuestion.incorrect_answers];
        formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
        answerChoices.splice(formattedQuestion.answer -1, 0,
            loadedQuestion.correct_answer
            );
// Iterate thru the answer choices and get the index for each choice
// and assign it as choice reference
            answerChoices.forEach((choice, index)=>{
                formattedQuestion["choice" + (index+1)] = choice;
            })
            return formattedQuestion;
    });
    
    startGame();
})

// CONSTANTS

const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 6;

startGame = () =>{
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    // console.log(availableQuestions)
   
getNewQuestion();
    game.classList.remove("hidden");
    loader.classList.add("hidden");

};

getNewQuestion = ()=>{
    if(availableQuestions.length == 0|| questionCounter == MAX_QUESTIONS ){
 // save player score to display in the end page
         localStorage.setItem('mostRecentScore', score);
        // go to the end page
        return window.location.assign("/end.html");
    
    }

    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`

    // UPDATE PROGRESS BAR
    progressBarFull.style.width = `${(questionCounter/MAX_QUESTIONS) * 100}%`;

 const questionIndex = Math.floor(Math.random() * availableQuestions.length);
 currentQuestion = availableQuestions[questionIndex];
 question.innerText = currentQuestion.question;

 choices.forEach( choice =>{
    const number = choice.dataset["number"];
    choice.innerText = currentQuestion['choice' + number];
 });

   availableQuestions.splice(questionIndex, 1);

   acceptingAnswers = true;

};

choices.forEach( choice =>{
    choice.addEventListener('click', e =>{
       if(!acceptingAnswers) return;
       acceptingAnswers = false;
       const selectedChoice = e.target;
       const selectedAnswer = selectedChoice.dataset["number"];

const classToApply = selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";
// OR
// const classToApply = 'incorrect';
// if(selectedAnswer == currentQuestion.answer){
//     classToApply = 'correct'
// }

if(classToApply === 'correct'){
    incrementScore(CORRECT_BONUS);
}

selectedChoice.parentElement.classList.add(classToApply);

setTimeout( () =>{
selectedChoice.parentElement.classList.remove(classToApply);
 getNewQuestion();

}, 1000);   
    });
});

incrementScore = num => {
  score += num;
  scoreText.innerText = score;
}

