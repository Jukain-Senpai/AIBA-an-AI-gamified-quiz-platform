<template>
  <div class="create-wrapper">
    
    <div class="box">
      <h2>Create Quiz</h2>

      <div class="form-row">
        <label>Quiz Title</label>
        <input v-model="quiz.title" placeholder="Enter your quiz Title"/>
      </div>

      <div class="form-row">
        <label>Description</label>
        <textarea v-model="quiz.description" placeholder="Describe your quiz"/>
      </div>

      <div class="grid">
        <div>
          <label>Difficulty</label>
          <select v-model="quiz.difficulty">
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>

        <div>
          <label>Category</label>
          <select v-model="quiz.category">
            <option>General</option>
            <option>Teaching</option>
            <option>Homework</option>
            <option>Self Study</option>
          </select>
        </div>
      </div>
    </div>

    <div
    v-for="(q,index) in questions"
    :key="index"
    class="box"
    >

    <h3>Question {{ index + 1 }}</h3>

    <input
    v-model="q.text"
    placeholder="Enter your question"
    />

    <div class="answers">
      <div
      v-for="(answer,i) in q.answers"
      :key="i"
      class="answer-row"
      >

      <button
      class="choice"
      :class="{correct:q.correctIndex===i}"
      @click="selectCorrect(index,i)"
      >
      {{ letters[i]  }}
      </button>

      <input
      v-model="q.answers[i]"
      :placeholder="'Answer ' + letters[i]"
      />
    
    </div>
    </div>

    <button
    class="add-btn"
    @click="saveQuestion(index)"
    >
    Next Question
  </button>

  </div>

  <div class="footer">
    <button class="draft-btn" @click="saveDraft">
      Save Draft
    </button>

  </div>
  </div>
</template>

<script>
export default {

  data() {
    return {

      letters:["A","B","C","D"],

      quiz:{
        title:"",
        description:"",
        difficulty:"Easy",
        category:"General"
      },

      questions:[
        {
          text:"",
          answers:["","","",""],
          correctIndex:null
        }
      ]

    };
  },

  methods:{
    selectCorrect(questionIndex, answerIndex){
      this.questions[questionIndex].correctIndex = answerIndex;
    },
    saveQuestion(index){
      const q = this.questions[index];

      const filledAnswers = q.answers.filter(a=>a.trim()!=="");

      if(q.text.trim()===""){
        alert("Please enter the question text");
        return;
      }

      if(filledAnswers.length < 2){
        alert("Please fill at least 2 answers");
        return;
      }

      if(q.correctIndex===null){
        alert("Please choose a correct answer");
        return;
      }

      if(q.answers[q.correctIndex].trim()===""){
        alert("Correct answer cannot be empty");
        return;
      }

      this.questions.push({
        text:"",
        answers:["","","",""],
        correctIndex:null
      });

    },
    async saveDraft(){
      try{
        const token= localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/quizzes",{
          method:"POST",
          headers:{
            "Content-Type":"application/json",
            "Authorization":`Bearer ${token}`
          },
          body:JSON.stringify({
            quiz:this.quiz,
            questions:this.questions
          })
        });
        const data = await res.json();

        if(!res.ok){
          alert(data.message || "Failed to saved quiz");
          return
        }
        
        alert("Quiz saved!");
        this.$router.push("/quizzes");
      }
      catch(err){
        console.error(err);
        alert("Failed to save quiz");
      }
    }
  }
};
</script>

<style scoped>

.create-wrapper{
  max-width:900px;
  margin:auto;
  padding:40px;
}

.box{
  background:#1b1333;
  padding:25px;
  margin-bottom:30px;
  border-radius:12px;
}

.grid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:20px;
}

.form-row{
  margin-bottom:15px;
}

.answers{
  margin-top:20px;
}

.answer-row{
  display:flex;
  align-items:center;
  margin-bottom:10px;
}

.choice{
  width:40px;
  height:40px;
  border-radius:10px;
  margin-right:10px;
  border:1px solid #555;
}

.correct{
  background:#2ecc71;
  color:white;
}

.add-btn{
  margin-top:15px;
}

.footer{
  text-align:right;
}

.draft-btn{
  padding:10px 20px;
}

</style>