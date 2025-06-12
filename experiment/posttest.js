/////////////////////////////////////////////////////////////////////////////

/////////////////////// Do not modify the below code ////////////////////////

/////////////////////////////////////////////////////////////////////////////

(function() {
  function buildQuiz() {
    // we'll need a place to store the HTML output
    const output = [];

    // for each question...
    myQuestions.forEach((currentQuestion, questionNumber) => {
      // we'll want to store the list of answer choices
      const answers = [];

      // and for each available answer...
      for (letter in currentQuestion.answers) {
        // ...add an HTML radio button
        answers.push(
          `<label>
            <input type="radio" name="question${questionNumber}" value="${letter}">
            ${letter} :
            ${currentQuestion.answers[letter]}
          </label>`
        );
      }

      // add this question and its answers to the output
      output.push(
        `<div class=question> ${currentQuestion.question} </div>
        <div class="answers"> ${answers.join("")} </div>`
      );
    });

    // finally combine our output list into one string of HTML and put it on the page
    quizContainer.innerHTML = output.join("");
  }

  function showResults() {
    // gather answer containers from our quiz
    const answerContainers = quizContainer.querySelectorAll(".answers");

    // keep track of user's answers
    let numCorrect = 0;

    // for each question...
    myQuestions.forEach((currentQuestion, questionNumber) => {
      // find selected answer
      const answerContainer = answerContainers[questionNumber];
      const selector = input[name=question${questionNumber}]:checked;
      const userAnswer = (answerContainer.querySelector(selector) || {}).value;

      // if answer is correct
      if (userAnswer === currentQuestion.correctAnswer) {
        // add to the number of correct answers
        numCorrect++;

        // color the answers green
        //answerContainers[questionNumber].style.color = "lightgreen";
      } else {
        // if answer is wrong or blank
        // color the answers red
        answerContainers[questionNumber].style.color = "red";
      }
    });

    // show number of correct answers out of total
    resultsContainer.innerHTML = ${numCorrect} out of ${myQuestions.length};
  }

  const quizContainer = document.getElementById("quiz");
  const resultsContainer = document.getElementById("results");
  const submitButton = document.getElementById("submit");
 

/////////////////////////////////////////////////////////////////////////////

/////////////////////// Do not modify the above code ////////////////////////

/////////////////////////////////////////////////////////////////////////////
const myQuestions = [
    {
      question: "What happens to the voltage of a lithium-ion cell as it discharges?",
      answers: {
        a: "It increases steadily",
        b: "It remains constant",
        c: "It decreases gradually",
        d: "It decreases gradually"
      },
      correctAnswer: "c",
      difficulty: "beginner"
    },
    {
      question: "Which parameter did you observe had the greatest effect on battery performance during the simulation?",
      answers: {
        a: "Color of the battery",
        b: "Temperature",
        c: "Label on the battery",
        d: "Time of day"
      },
      correctAnswer: "b",
      difficulty: "beginner"
    },
    {
      question: "During charging, lithium ions move from:",
      answers: {
        a: "Cathode to anode",
        b: "Anode to cathode",
        c: "Separator to electrolyte",
        d: "Electrolyte to separator"
      },
      correctAnswer: "a",
      difficulty: "beginner"
    },
    {
      question: "What is the purpose of monitoring the state of charge in the experiment?",
      answers: {
        a: "To measure battery color",
        b: "To track how much energy is stored",
        c: "To increase battery size",
        d: "To cool the battery"
      },
      correctAnswer: "b",
      difficulty: "beginner"
    },
    {
      question: "If the external load resistance is increased, what happens to the discharge current?",
      answers: {
        a: "It increases",
        b: "It decreases",
        c: "It stays the same",
        d: "It becomes zero"
      },
      correctAnswer: "b",
      difficulty: "beginner"
    },
    {
      question: "Which safety precaution is most important when handling real lithium-ion batteries?",
      answers: {
        a: "Overcharging them",
        b: "Short-circuiting the terminals",
        c: "Avoiding physical damage",
        d: "Placing them in water"
      },
      correctAnswer: "c",
      difficulty: "beginner"
    },
    {
      question: "What was the effect of higher temperature on battery performance in your simulation?",
      answers: {
        a: "No effect",
        b: "Improved performance up to a limit",
        c: "Always reduced performance",
        d: "Made the battery explode"
      },
      correctAnswer: "b",
      difficulty: "beginner"
    },
    {
      question: "Why is it important to avoid over-discharging a lithium-ion battery?",
      answers: {
        a: "It increases capacity",
        b: "It can damage the battery",
        c: "It makes the battery lighter",
        d: "It changes the color"
      },
      correctAnswer: "b",
      difficulty: "beginner"
    },
    {
      question: "Which graph did you use to analyze the battery’s performance during the experiment?",
      answers: {
        a: "Voltage vs. time",
        b: "Mass vs. volume",
        c: "Temperature vs. pressure",
        d: "Color vs. brightness"
      },
      correctAnswer: "a",
      difficulty: "beginner"
    },
    {
      question: "After the experiment, what conclusion can you draw about the relationship between current and battery life?",
      answers: {
        a: "Higher current increases battery life",
        b: "Higher current decreases battery life",
        c: "Current has no effect",
        d: "Battery life is infinite"
      },
      correctAnswer: "b",
      difficulty: "beginner"
    }






/////////////// Write the MCQ below in the exactly same described format ///////////////


             ///// To add more questions, copy the section below 
    									                  ///// this line


    /* To add more MCQ's, copy the below section, starting from open curly braces ( { )
        till closing curly braces comma ( }, )

        and paste it below the curly braces comma ( below correct answer }, ) of above 
        question

    Copy below section

    {
      question: "This is question n?",
      answers: {
        a: "Option 1",
        b: "Option 2",
        c: "Option 3",
        d: "Option 4"
      },
      correctAnswer: c
    },

    Copy above section

    */




  ];




/////////////////////////////////////////////////////////////////////////////

/////////////////////// Do not modify the below code ////////////////////////

/////////////////////////////////////////////////////////////////////////////


  // display quiz right away
  buildQuiz();

  // on submit, show results
  submitButton.addEventListener("click", showResults);
})();


/////////////////////////////////////////////////////////////////////////////

/////////////////////// Do not modify the above code ////////////////////////

/////////////////////////////////////////////////////////////////////////////
