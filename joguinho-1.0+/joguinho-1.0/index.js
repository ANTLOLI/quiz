const $startGameButton = document.querySelector(".start-quiz");
const $nextQuestionButton = document.querySelector(".next-question");
const $questionsContainer = document.querySelector(".questions-container");
const $questionText = document.querySelector(".question");
const $answersContainer = document.querySelector(".answers-container");
const $audio = document.getElementById("audio");


let currentQuestionIndex = 0; // Índice da pergunta atual
let totalCorrect = 0; // Contagem de respostas corretas
let audioPlaying = false; // Flag para controlar a reprodução de áudio

// Adiciona um event listener para o botão "Start Quiz"
$startGameButton.addEventListener("click", startGame);

// Adiciona um event listener para o botão "Next Question"
$nextQuestionButton.addEventListener("click", displayNextQuestion);


function startGame() {
  $startGameButton.classList.add("hide"); // Oculta o botão "Start Quiz"
  $questionsContainer.classList.remove("hide"); // Mostra o contêiner de perguntas
  displayNextQuestion(); // Exibe a primeira pergunta
}

function displayNextQuestion() {
  resetState(); // Redefine o estado para a próxima pergunta

  if (questions.length === currentQuestionIndex) {
    return finishGame(); // Se todas as perguntas foram respondidas, encerra o jogo
  }

  $questionText.textContent = questions[currentQuestionIndex].question; // Exibe o texto da pergunta atual
  questions[currentQuestionIndex].answers.forEach((answer, index) => {
    const newAnswer = document.createElement("button"); // Cria um botão para a resposta
    newAnswer.classList.add("button", "answer");
    newAnswer.textContent = answer.text; // Define o texto da resposta

    newAnswer.addEventListener("click", () => selectAnswer(index)); // Adiciona evento de clique à resposta

    if (answer.audio) {
      const audioButton = document.createElement("button"); // Cria um botão de áudio, se estiver disponível
      audioButton.classList.add("audio-button");
      audioButton.innerHTML = '<i class="fas fa-volume-up"></i>';
      audioButton.addEventListener("click", (event) => playAudio(event, answer.audio));
      newAnswer.appendChild(audioButton);
    }

    $answersContainer.appendChild(newAnswer); // Adiciona a resposta ao contêiner
  });
}

function playAcerto() {
  const acertoAudio = document.getElementById("acerto");
  if (!acertoAudio.paused) {
    acertoAudio.currentTime = 0; // Reinicia o áudio de acerto se já estiver em execução
  }
  acertoAudio.play();
}

function playErro() {
  const erroAudio = document.getElementById("erro");
  if (!erroAudio.paused) {
    erroAudio.currentTime = 0; // Reinicia o áudio de erro se já estiver em execução
  }
  erroAudio.play();
}

function resetState() {
  while ($answersContainer.firstChild) {
    $answersContainer.removeChild($answersContainer.firstChild); // Remove respostas anteriores
  }

  document.body.removeAttribute("class"); // Remove classes do corpo do documento
  $nextQuestionButton.classList.add("hide"); // Oculta o botão "Next Question"
}

function selectAnswer(answerIndex) {
  const answer = questions[currentQuestionIndex].answers[answerIndex]; // Obtém a resposta selecionada


  if (answer.correct) {
    document.body.classList.add("correct");  //Adiciona classe para resposta correta
    totalCorrect++; // Incrementa a contagem de respostas corretas
   playAcerto()
  } else {
    playErro();
  document.body.classList.add("incorrect") ;
  
  // Adiciona classe para resposta incorreta
  }

  questions[currentQuestionIndex].answers.forEach((_, index) => {
    const button = $answersContainer.children[index];
    button.disabled = true; // Desabilita todas as respostas
    if (questions[currentQuestionIndex].answers[index].correct) {
      button.classList.add("correct"); // Adiciona classe para respostas corretas
    
    } else {
      button.classList.add("incorrect"); // Adiciona classe para respostas incorretas
    }
  });

  $nextQuestionButton.classList.remove("hide"); // Mostra o botão "Next Question"
  currentQuestionIndex++; // Move para a próxima pergunta
}

function finishGame() {
  const totalQuestions = questions.length;
  const performance = Math.floor((totalCorrect * 100) / totalQuestions); // Calcula o desempenho do jogador
  let message = "";

  // Determina a mensagem com base no desempenho
  switch (true) {
    case performance >= 90:
      message = "Excelente :)";
      break;
    case performance >= 70:
      message = "Bom :)";
      break;
    case performance >= 50:
      message = "Você pode se esforçar mais!!";
      break;
    default:
      message = "Frequente mais os atendimentos :(";
  }

  // Exibe a mensagem de desempenho e um botão para reiniciar o jogo
  $questionsContainer.innerHTML = `
    <p class="final-message">
      Você acertou ${totalCorrect} de ${totalQuestions} questões!
      <span>Resultado: ${message}</span>
    </p>
    <button 
      onclick=window.location.reload() 
      class="button"
    >
      refazer
    </button>
  `;
}

function playAudio(event, audioSrc) {
  if (!audioPlaying) {
    audioPlaying = true;
    $audio.src = audioSrc; // Define a fonte de áudio
    $audio.play(); // Inicia a reprodução de áudio

    $audio.addEventListener("ended", () => {
      audioPlaying = false; // Define a flag como falso quando a reprodução terminar
    });

    event.stopPropagation(); // Evita que o clique no botão de áudio se propague para a resposta
  }
}

const questions = [
  {
    question: "4",
    answers: [
      { text: "One", correct: false , audio: "audio/one.mp3"},
      { text: "Six", correct: false , audio: "audio/six.mp3" },
      { text: "Four", correct: true , audio: "audio/four.mp3" },
      { text: "Ten", correct: false , audio: "audio/ten.mp3"},
    ],
  },
  {
    question: "2",
    answers: [
      { text: "Two", correct: true, audio: "audio/two.mp3" },
      { text: "Five", correct: false , audio: "audio/five.mp3"},
      { text: "Seven", correct: false , audio: "audio/seven.mp3" },
      { text: "Eleven", correct: false , audio: "audio/eleven.mp3" },
    ],
  },
  {
    question: "5",
    answers: [
      { text: "Five", correct: true, audio: "audio/five.mp3" },
      { text: "Two", correct: false, audio: "audio/two.mp3" },
      { text: "Eight", correct: false, audio: "audio/eight.mp3" },
      { text: "Three", correct: false, audio: "audio/three.mp3" },
    ],
  },
  {
    question: "3",
    answers: [
      { text: "Three", correct: true, audio: "audio/three.mp3" },
      { text: "Twelve", correct: false, audio: "audio/twelve.mp3" },
      { text: "Six", correct: false , audio: "audio/six.mp3"},
      { text: "One", correct: false , audio: "audio/one.mp3" },
    ],
  },
  {
    question: "9",
    answers: [
      { text: "Eight", correct: false, audio: "audio/eight.mp3" },
      { text: "Nine", correct: true, audio: "audio/nine.mp3" },
      { text: "Five", correct: false , audio: "audio/five.mp3"},
      { text: "Seven", correct: false , audio: "audio/seven.mp3" },
    ],
  },
  {
    question: "6+2x3=?",
    answers: [
      { text: "Fifteen", correct: false, audio: "audio/fifteen.mp3" },
      { text: "Twenty-four", correct: false , audio: "audio/twenty-four.mp3"},
      { text: "Ten", correct: false , audio: "audio/ten.mp3" },
      { text: "Twelve", correct: true, audio: "audio/twelve.mp3" },
    ],
  },
  {
    question: "24-12+4=",
    answers: [
      { text: "Two", correct: false , audio: "audio/two.mp3" },
      { text: "One hundred", correct: false , audio: "audio/one hundred.mp3"},
      { text: "Forty", correct: false , audio: "audio/forty.mp3"},
      { text: "Sixteen", correct: true, audio: "audio/sixteen.mp3" },
    ],
  },
  {
    question: "60-10x2=",
    answers: [
      { text: "One hundred", correct: false , audio: "audio/one hundred.mp3"},
      { text: "Eighty", correct: false,  audio: "audio/eighty.mp3"  },
      { text: "Forty", correct: true, audio: "audio/forty.mp3" },
      { text: "Eight", correct: false,  audio: "audio/eight.mp3"  },
    ],
  },
  {
    question: "378÷3=",
    answers: [
      { text: "One hundred twenty-six", correct: true, audio: "audio/onehundredtwentysix.mp3" },
      { text: "Two hundred forty-two", correct: false, audio: "audio/Two hundred forty-two.mp3" },
      { text: "Two hundred", correct: false , audio:"audio/Two hundred.mp3"},
      { text: "One cent twenty-six ", correct: false, audio:"audio/One cent twenty-six.mp3" },
    ],
  },
  {
    question: "4046-2023=",
    answers: [
      { text: "Two million twenty-three", correct: false , audio:"audio/Two million twenty-three.mp3"},
      { text: "Two thousand twenty-three", correct: true, audio: "audio/twothousandtwentythree.mp3" },
      { text: "Two million fourteen", correct: false  , audio:"audio/Two million fourteen.mp3"},
      { text: "Two thousand fourteen", correct: false , audio:"audio/Two thousand fourteen.mp3" },
    ],
  },
  {
    question: "50",
    answers: [
      { text: "   ", correct: false , audio:"audio/Two hundred.mp3"},
      { text: "   ", correct: true, audio: "audio/fifity.mp3" },
      { text: "   ", correct: false  , audio:"audio/sixtysix.mp3"},
      { text: "   ", correct: false , audio:"audio/fifteen.mp3" },
    ],
  },
  {
    question: "673",
    answers: [
      { text: "   ", correct: false , audio: "audio/Six thousand and seventy-three.mp3" },
      { text: "   ", correct: false , audio: "audio/six million and seventy-three.mp3"},
      { text: "   ", correct: false , audio: "audio/six hundred and sixty-three.mp3"},
      { text: "   ", correct: true, audio: "audio/six hundred and seventy-three.mp3" },
    ],
  },
  {
    question: "515",
    answers: [
      { text: "   ", correct: false, audio: "audio/fifteen.mp3" },
      { text: "   ", correct: false , audio: "audio/Five hundred and fifty-five.mp3"},
      { text: "   ", correct: true, audio: "audio/Five hundred and fifteen.mp3"},
      { text: "   ", correct: false , audio: "audio/Five hundred and fifty.mp3" },
    ],
  },
  {
    question: "15",
    answers: [
      { text: "   ", correct: false , audio: "audio/fifity.mp3" },
      { text: "   ", correct: false , audio: "audio/fifty-five.mp3"},
      { text: "   ", correct: false , audio: "audio/forty.mp3"},
      { text: "   ", correct: true, audio: "audio/fifteen.mp3" },
    ],
  },
  {
    question: "9999",
    answers: [
      { text: "   ", correct: false , audio:"audio/forty-nine.mp3"},
      { text: "   ", correct: true, audio: "audio/ninethousandninehundredandninety-nine.mp3" },
      { text: "   ", correct: false  , audio:"audio/9990.mp3"},
      { text: "   ", correct: false , audio:"audio/ninethousandninehundredandnine.mp3" },
    ],
  },
];
