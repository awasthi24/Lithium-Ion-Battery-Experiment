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
        `<div class="question"> ${currentQuestion.question} </div>
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
      const selector = `input[name=question${questionNumber}]:checked`;
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
    resultsContainer.innerHTML = `${numCorrect} out of ${myQuestions.length}`;
  }

  const quizContainer = document.getElementById("quiz");
  const resultsContainer = document.getElementById("results");
  const submitButton = document.getElementById("submit");
 

/////////////////////////////////////////////////////////////////////////////

/////////////////////// Do not modify the above code ////////////////////////

/////////////////////////////////////////////////////////////////////////////
{
  "version": 2.0,
  "questions": [
    {
      "question": "Which material is commonly used as the anode in a lithium-ion battery?",
      "answers": {
        "a": "Zinc",
        "b": "Graphite",
        "c": "Lead",
        "d": "Nickel"
      },
      "correctAnswer": "b",
      "difficulty": "beginner"
    },
    {
      "question": "What is the main function of the separator in a lithium-ion battery?",
      "answers": {
        "a": "Conduct electricity",
        "b": "Store energy",
        "c": "Prevent direct contact between electrodes",
        "d": "Provide mechanical strength"
      },
      "correctAnswer": "c",
      "difficulty": "beginner"
    },
    {
      "question": "Which of the following is the electrolyte in most lithium-ion batteries?",
      "answers": {
        "a": "Sulfuric acid",
        "b": "Potassium hydroxide",
        "c": "Lithium salt in organic solvent",
        "d": "Water"
      },
      "correctAnswer": "c",
      "difficulty": "beginner"
    },
    {
      "question": "During discharge, lithium ions move from:",
      "answers": {
        "a": "Cathode to anode",
        "b": "Anode to cathode",
        "c": "Separator to electrolyte",
        "d": "Electrolyte to separator"
      },
      "correctAnswer": "b",
      "difficulty": "beginner"
    },
    {
      "question": "Which of these is NOT a rechargeable battery?",
      "answers": {
        "a": "Lithium-ion",
        "b": "Lead-acid",
        "c": "Nickel-cadmium",
        "d": "Alkaline"
      },
      "correctAnswer": "d",
      "difficulty": "beginner"
    },
    {
      "question": "The positive terminal of a lithium-ion battery is called:",
      "answers": {
        "a": "Anode",
        "b": "Cathode",
        "c": "Electrolyte",
        "d": "Separator"
      },
      "correctAnswer": "b",
      "difficulty": "beginner"
    },
    {
      "question": "What is the typical voltage of a single lithium-ion cell?",
      "answers": {
        "a": "1.2 V",
        "b": "1.5 V",
        "c": "3.7 V",
        "d": "6 V"
      },
      "correctAnswer": "c",
      "difficulty": "beginner"
    },
    {
      "question": "Which statement is true about the movement of electrons in a lithium-ion battery during discharge?",
      "answers": {
        "a": "Electrons move from anode to cathode through external circuit",
        "b": "Electrons move from cathode to anode through external circuit",
        "c": "Electrons do not move",
        "d": "Electrons move through the electrolyte"
      },
      "correctAnswer": "a",
      "difficulty": "beginner"
    },
    {
      "question": "Lithium-ion batteries are called ‘secondary batteries’ because:",
     
      "answers": {
        "a": "They are used as backup",
        "b": "They can be recharged",
        "c": "They are smaller in size",
        "d": "They are less powerful"
      },
      "correctAnswer": "b",
      "difficulty": "beginner"
    },
    {
      "question": "Which of the following is an application of lithium-ion batteries?",
      "answers": {
        "a": "Car batteries",
        "b": "Mobile phones",
        "c": "Remote controls",
        "d": "All of the above"
      },
      "correctAnswer": "d",
      "difficulty": "beginner"
    }
  ]
}





/////////////// Write the MCQ below in the exactly same described format ///////////////


                  ///// Write the correct option inside double quote
                  //                              ///// To add more questions, copy the section below 
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
      correctAnswer: "c"
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