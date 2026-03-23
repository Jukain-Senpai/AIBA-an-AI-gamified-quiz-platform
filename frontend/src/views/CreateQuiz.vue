<template>
  <div class="create-wrapper">
    
    <div class="box">
      <h2>Create Quiz</h2>

      <div class="form-row">
        <label>Quiz Title</label>
        <input class="input-field" v-model="quiz.title" placeholder="Enter your quiz Title"/>
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
  max-width:950px;
  margin:auto;
  padding:40px;

  /* Background gradient */
  background: linear-gradient(135deg, #0f172a, #1e1b4b);
  min-height:100vh;
  color:#e9d5ff;
}

/* ===== CARD / BOX ===== */
.box{
  background:#1e1b4b;
  padding:30px;
  margin-bottom:30px;
  border-radius:16px;

  border:1px solid rgba(139, 92, 246, 0.3);
  box-shadow:0 10px 30px rgba(0,0,0,0.4);
}

/* ===== HEADINGS ===== */
h2, h3{
  margin-bottom:20px;
  color:#d8b4fe;
}

/* ===== FORM LAYOUT ===== */
.form-row{
  margin-bottom:25px;
  display:flex;
  flex-direction:column; /* THIS FIXES YOUR SPACING */
}

label{
  margin-bottom:8px;
  font-size:14px;
  color:rgba(216,180,254,0.7);
}

/* ===== INPUTS ===== */
input,
textarea,
select{
  width:100%;
  padding:14px;
  border-radius:10px;

  background:#0f172a;
  border:1px solid rgba(139, 92, 246, 0.3);

  color:#f3f4f6;
  font-size:15px;

  transition:0.2s;
}

input:focus,
textarea:focus,
select:focus{
  outline:none;
  border:1px solid #22d3ee;
  box-shadow:0 0 0 2px rgba(34,211,238,0.3);
}

/* Make textarea bigger */
textarea{
  min-height:100px;
  resize:vertical;
}

/* ===== GRID ===== */
.grid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:25px;
}

/* ===== QUESTION INPUT ===== */
.box input{
  margin-top:10px;
}

/* ===== ANSWERS ===== */
.answers{
  margin-top:25px;
}

.answer-row{
  display:flex;
  align-items:center;
  gap:12px;
  margin-bottom:15px;
}

/* ===== CHOICE BUTTON ===== */
.choice{
  width:45px;
  height:45px;
  border-radius:12px;

  border:1px solid rgba(139, 92, 246, 0.3);
  background:#0f172a;

  color:#d8b4fe;
  font-weight:bold;

  cursor:pointer;
  transition:0.2s;
}

.choice:hover{
  background:#1e293b;
}

/* ===== CORRECT ANSWER ===== */
.correct{
  background:#10b981;
  color:white;
  border:none;
}

/* ===== BUTTONS ===== */
.add-btn{
  margin-top:20px;
  padding:12px 20px;

  border:none;
  border-radius:10px;

  background:#06b6d4;
  color:white;

  cursor:pointer;
  font-weight:600;

  transition:0.2s;
}

.add-btn:hover{
  background:#0891b2;
}

/* ===== FOOTER ===== */
.footer{
  text-align:right;
}

.draft-btn{
  padding:14px 25px;
  border:none;
  border-radius:12px;

  background:#f59e0b;
  color:#030213;

  font-weight:bold;
  cursor:pointer;

  transition:0.2s;
}

.draft-btn:hover{
  background:#d97706;
}

</style>