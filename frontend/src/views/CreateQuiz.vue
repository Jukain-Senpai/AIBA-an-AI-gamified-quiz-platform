<template>
  <div class="create-quiz-container">
    
    <!-- Wizard Progress -->
    <section class="wizard-header">
      <div class="wizard-progress">
        <div class="progress-line-bg"></div>
        <div class="progress-line-active" :style="{ width: progressWidth }"></div>

        <!-- Step 1 -->
        <div class="step-item">
          <div class="step-circle" :class="{ 'active': currentStep >= 1, 'completed': currentStep > 1 }">
            <span v-if="currentStep > 1" class="material-symbols-outlined">check</span>
            <span v-else>1</span>
          </div>
          <span class="step-label" :class="{ 'active-text': currentStep >= 1 }">Setup</span>
        </div>

        <!-- Step 2 -->
        <div class="step-item">
          <div class="step-circle" :class="{ 'active': currentStep >= 2, 'completed': currentStep > 2 }">
            <span v-if="currentStep > 2" class="material-symbols-outlined">check</span>
            <span v-else>2</span>
          </div>
          <span class="step-label" :class="{ 'active-text': currentStep >= 2 }">Questions</span>
        </div>

        <!-- Step 3 -->
        <div class="step-item">
          <div class="step-circle" :class="{ 'active': currentStep >= 3 }">3</div>
          <span class="step-label" :class="{ 'active-text': currentStep >= 3 }">Review</span>
        </div>
      </div>
    </section>

    <!-- STEP 1: SETUP -->
    <main v-show="currentStep === 1" class="step-content">
      <div class="glass-card main-card">
        <div class="decorative-blob blob-1"></div>
        <div class="card-inner">
          <h1 class="headline-lg">Let's Set Up Your Quiz 📝</h1>
          <p class="body-text mb-lg">Tell us about your masterpiece. This will help learners find your quiz.</p>

          <form @submit.prevent class="setup-form">
            <div class="form-group">
              <label>Quiz Title</label>
              <input v-model="quiz.title" class="input-field" placeholder="e.g., Solar System Basics" type="text" />
            </div>

            <div class="form-group">
              <label>Description (Optional)</label>
              <textarea v-model="quiz.description" class="input-field textarea" placeholder="What will people learn in this quiz?" rows="3"></textarea>
            </div>

            <div class="form-group">
              <label>Quiz Thumbnail (Optional)</label>
              <div class="media-upload" @click="$refs.thumbnailInput.click()" style="cursor: pointer; border: 2px dashed var(--border-color); border-radius: 12px; padding: 20px; text-align: center; background: var(--surface-low); transition: all 0.2s;">
                <div v-if="quiz.thumbnail" class="uploaded-image-preview" style="position: relative; display: inline-block;">
                  <img :src="getImageUrl(quiz.thumbnail)" alt="Thumbnail" style="max-height: 150px; border-radius: 8px;" />
                  <span class="remove-img material-symbols-outlined" @click.stop="quiz.thumbnail = null" style="position: absolute; top: -10px; right: -10px; background: #ba1a1a; color: white; border-radius: 50%; padding: 4px; cursor: pointer; font-size: 16px;">close</span>
                </div>
                <div v-else class="upload-placeholder">
                  <span class="material-symbols-outlined" style="font-size: 32px; color: var(--text-outline);">image</span>
                  <p v-if="uploadingThumbnail" style="color: var(--primary); font-weight: bold;">Uploading...</p>
                  <p v-else style="color: var(--text-muted); margin-top: 8px;">Click to upload thumbnail</p>
                </div>
              </div>
              <input ref="thumbnailInput" type="file" accept="image/*" @change="handleThumbnailUpload" style="display: none;" />
            </div>

            <div class="form-group">
              <label class="mb-sm">Category</label>
              <div class="category-grid">
                <button 
                  v-for="cat in ['History', 'Language', 'Pop Culture', 'Tech', 'Teaching', 'Homework', 'Self Study', 'Other']" 
                  :key="cat"
                  @click="quiz.category = cat"
                  type="button" 
                  class="category-btn" 
                  :class="{ 'active-category': quiz.category === cat }"
                >
                  <span class="material-symbols-outlined">{{ getCategoryIcon(cat) }}</span>
                  <span>{{ cat }}</span>
                </button>
              </div>
            </div>

            <div class="two-col-grid">
              <div class="form-group">
                <label>Difficulty Level</label>
                <div class="difficulty-picker" role="radiogroup" aria-label="Difficulty level">
                  <button
                    v-for="n in 3"
                    :key="n"
                    type="button"
                    class="difficulty-star-btn"
                    :class="{ filled: n <= getDifficultyStars(quiz.difficulty) }"
                    :aria-pressed="n <= getDifficultyStars(quiz.difficulty)"
                    :aria-label="difficultyLabel(n)"
                    @click="setDifficulty(n)"
                  >
                    <span class="material-symbols-outlined star-icon">star</span>
                  </button>
                  <span class="difficulty-text">{{ quiz.difficulty }}</span>
                </div>
              </div>

              <div class="form-group">
                <label>Time per Question</label>
                <div class="slider-container">
                  <div class="slider-header">
                    <span class="highlight-text">{{ timeLimit }}s</span>
                    <span class="muted-text">Max: 120s</span>
                  </div>
                  <input v-model="timeLimit" class="range-slider" max="120" min="10" type="range" />
                </div>
              </div>
            </div>

            <div class="form-group">
              <label>Visibility</label>
              <div class="visibility-toggle">
                <button @click="visibility = 'Public'" type="button" class="vis-btn" :class="{'active': visibility === 'Public'}">
                  <span class="material-symbols-outlined">public</span> Public
                </button>
                <button @click="visibility = 'Private'" type="button" class="vis-btn" :class="{'active': visibility === 'Private'}">
                  <span class="material-symbols-outlined">lock</span> Private
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>

    <!-- STEP 2: QUESTIONS -->
    <main v-show="currentStep === 2" class="step-content full-width">
      <div class="questions-header">
        <h2 class="headline-md primary-text">Great! Now add your questions.</h2>
        <p class="body-text">Fill in the details below to craft your learning experience.</p>
      </div>

      <div class="questions-layout">
        <!-- Sidebar -->
        <aside class="sidebar">
          <div class="sidebar-card">
            <h3 class="sidebar-title">Quiz Structure</h3>
            <div class="questions-list custom-scrollbar">
              
              <div 
                v-for="(q, idx) in questions" 
                :key="idx"
                @click="selectedQuestionIndex = idx"
                class="q-item" 
                :class="{ 'active-q': selectedQuestionIndex === idx }"
              >
                <span class="material-symbols-outlined drag-icon">drag_indicator</span>
                <div class="q-info">
                  <span class="q-title">Question {{ idx + 1 }}</span>
                  <span class="q-preview">{{ q.text || 'Empty question...' }}</span>
                </div>
                <button v-if="questions.length > 1" @click.stop="deleteQuestion(idx)" class="material-symbols-outlined delete-icon">delete</button>
              </div>

            </div>
            <button @click="addQuestion" class="add-q-btn">
              <span class="material-symbols-outlined">add_circle</span>
              Add Another Question
            </button>
          </div>
          
          <div class="pro-tip">
            <span class="material-symbols-outlined tip-icon">lightbulb</span>
            <div>
              <p class="tip-title">Pro Tip</p>
              <p class="tip-text">Mix question types to keep learners engaged and challenged!</p>
            </div>
          </div>
        </aside>

        <!-- Editor -->
        <section class="editor-section" v-if="activeQuestion">
          <div class="glass-card editor-card indigo-shadow">
            <div class="form-group">
              <label class="primary-text">Question Text</label>
              <textarea v-model="activeQuestion.text" class="input-field big-textarea" placeholder="Enter your question here..."></textarea>
            </div>

            <div class="form-group">
              <label>Media (Optional)</label>
              <div class="media-upload" @click="$refs.questionImageInput.click()" style="cursor: pointer; border: 2px dashed var(--border-color); border-radius: 12px; padding: 20px; text-align: center; background: var(--surface-low); transition: all 0.2s;">
                <div v-if="activeQuestion.image" class="uploaded-image-preview" style="position: relative; display: inline-block;">
                  <img :src="getImageUrl(activeQuestion.image)" alt="Question Image" style="max-height: 150px; border-radius: 8px;" />
                  <span class="remove-img material-symbols-outlined" @click.stop="activeQuestion.image = null" style="position: absolute; top: -10px; right: -10px; background: #ba1a1a; color: white; border-radius: 50%; padding: 4px; cursor: pointer; font-size: 16px;">close</span>
                </div>
                <div v-else class="upload-placeholder">
                  <div class="upload-icon-wrapper">
                    <span class="material-symbols-outlined" style="font-size: 32px; color: var(--text-outline);">image</span>
                  </div>
                  <div class="upload-text" style="margin-top: 8px;">
                    <p class="upload-title" v-if="uploadingQuestionImage" style="color: var(--primary); font-weight: bold;">Uploading...</p>
                    <p class="upload-title" v-else style="color: var(--text-muted);">Click to upload image</p>
                    <p class="upload-subtitle" style="font-size: 12px; color: var(--text-outline);">Supports PNG, JPG (Max 5MB)</p>
                  </div>
                </div>
              </div>
              <input ref="questionImageInput" type="file" accept="image/*" @change="handleQuestionImageUpload" style="display: none;" />
            </div>

            <div class="form-group">
              <div class="answers-header">
                <label class="primary-text">Answer Choices</label>
                <span class="italic-subtitle">Select the correct answer</span>
              </div>
              
              <div class="answers-grid">
                <div 
                  v-for="(ans, i) in activeQuestion.answers" 
                  :key="i"
                  class="answer-wrapper"
                >
                  <div 
                    class="answer-box" 
                    :class="{'is-correct': activeQuestion.correctIndex === i}"
                    @click="activeQuestion.correctIndex = i"
                  >
                    <div class="answer-letter">{{ ['A','B','C','D'][i] }}</div>
                    <input v-model="activeQuestion.answers[i]" class="answer-input" type="text" placeholder="Enter answer..." @click.stop />
                    <input type="radio" :checked="activeQuestion.correctIndex === i" class="answer-radio" />
                  </div>
                  <div v-if="activeQuestion.correctIndex === i" class="correct-badge">Correct</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>

    <!-- STEP 3: REVIEW -->
    <main v-show="currentStep === 3" class="step-content">
      <div class="space-y-lg">
        <section class="glass-card review-card indigo-shadow">
          <div class="decorative-blob blob-2"></div>
          <div class="decorative-blob blob-3"></div>
          
          <div class="review-inner">
            <div class="quiz-icon-box">
              <span class="material-symbols-outlined giant-icon">rocket_launch</span>
            </div>
            
            <div class="review-details">
              <div class="tags-row">
                <span class="tag primary-tag">{{ quiz.category }}</span>
                <span class="tag subtle-tag">
                  <span class="material-symbols-outlined small-icon">schedule</span>
                  {{ timeLimit }}s / Q
                </span>
              </div>
              
              <h1 class="headline-lg title-text">{{ quiz.title || 'Untitled Quiz' }}</h1>
              <p class="body-text max-width">{{ quiz.description || 'No description provided.' }}</p>
              
              <div class="stats-row">
                <div class="stat-item">
                  <p class="stat-label">Difficulty</p>
                  <div class="stars-display text-secondary">
                    <span v-for="n in 3" :key="n" class="material-symbols-outlined star-icon" :class="{'filled': n <= getDifficultyStars(quiz.difficulty)}">star</span>
                  </div>
                </div>
                <div class="stat-item">
                  <p class="stat-label">Total Questions</p>
                  <p class="stat-value primary-text">{{ questions.length }}</p>
                </div>
                <div class="stat-item">
                  <p class="stat-label">Reward Potential</p>
                  <p class="stat-value tertiary-text">{{ maxXP }} XP</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div class="text-center py-xl">
          <p class="headline-md muted-text">Ready to launch your quest?</p>
          <p class="body-text">Your students are waiting for this cosmic adventure.</p>
        </div>
      </div>
    </main>

    <!-- Wizard Footer -->
    <footer class="wizard-footer">
      <div class="footer-inner">
        <button v-if="currentStep > 1" @click="currentStep--" class="btn-back">
          <span class="material-symbols-outlined">arrow_back</span> Back
        </button>
        <div v-else></div> <!-- Spacer -->

        <div class="footer-actions">
          <span class="auto-save-text">Draft Saved</span>
          
          <button v-if="currentStep < 3" @click="nextStep" class="btn-primary-3d">
            Next <span class="material-symbols-outlined">arrow_forward</span>
          </button>
          
          <button v-if="currentStep === 3" @click="publishQuiz" class="btn-publish-3d" :disabled="isSubmitting">
            <span class="material-symbols-outlined">rocket_launch</span>
            {{ isSubmitting ? 'Publishing...' : 'Publish Quiz' }}
          </button>
        </div>
      </div>
    </footer>

    <!-- AI Generator Modal -->
    <div v-if="showAiModal" class="modal-overlay" @click.self="showAiModal = false">
      <div class="modal-content glass-card">
        <div class="modal-header">
          <h2 class="ai-title"><span class="material-symbols-outlined text-primary">auto_awesome</span> Generate with AI</h2>
          <button @click="showAiModal = false" class="close-btn"><span class="material-symbols-outlined">close</span></button>
        </div>
        <p class="ai-desc">Describe the quiz you want, and our AI will create the title, description, and questions for you instantly.</p>
        
        <textarea v-model="aiPrompt" class="input-field ai-textarea" placeholder="e.g. Create a 5-question quiz about the Solar System, intermediate difficulty..."></textarea>
        
        <p v-if="aiError" class="error-text">{{ aiError }}</p>
        
        <button @click="generateWithAI" class="btn-primary-3d full-w mt-md" :disabled="isGenerating || !aiPrompt.trim()">
          {{ isGenerating ? 'Generating...' : 'Generate Magic Quiz' }}
        </button>
      </div>
    </div>

    <!-- Floating AI Button -->
    <button v-if="currentStep < 3 && !showAiModal" @click="showAiModal = true" class="floating-ai-btn">
      <span class="material-symbols-outlined">auto_awesome</span> Auto-Generate
    </button>

  </div>
</template>

<script>
import api, { getImageUrl, uploadImage } from '../services/api';

export default {
  data() {
    return {
      currentStep: 1,
      mode: "create",
      sourceQuizId: null,
      showAiModal: false,
      aiPrompt: "",
      isGenerating: false,
      aiError: "",
      isSubmitting: false,
      uploadingThumbnail: false,
      uploadingQuestionImage: false,
      
      quiz: {
        title: "",
        description: "",
        category: "History",
        difficulty: "Intermediate",
      },
      
      timeLimit: 30,
      visibility: "Public",

      questions: [
        {
          text: "",
          answers: ["", "", "", ""],
          correctIndex: 0
        }
      ],
      selectedQuestionIndex: 0
    };
  },
  computed: {
    progressWidth() {
      if (this.currentStep === 1) return '25%';
      if (this.currentStep === 2) return '66%';
      return '100%';
    },
    activeQuestion() {
      return this.questions[this.selectedQuestionIndex];
    },
    maxXP() {
      // rough estimate of potential XP
      return this.questions.length * 10 + 20 + 10;
    }
  },
  methods: {
    getImageUrl,
    cloneQuestions(questions) {
      const source = Array.isArray(questions) && questions.length > 0 ? questions : [{
        text: "",
        answers: ["", "", "", ""],
        correctIndex: 0,
        image: null,
      }];

      return source.map((question) => ({
        text: question.text || "",
        answers: Array.isArray(question.answers) && question.answers.length > 0
          ? [...question.answers, "", "", "", ""].slice(0, 4)
          : ["", "", "", ""],
        correctIndex: typeof question.correctIndex === "number" ? question.correctIndex : 0,
        image: question.image || null,
      }));
    },
    applyQuizData(quiz, questions) {
      this.quiz.title = quiz?.title || "";
      this.quiz.description = quiz?.description || "";
      this.quiz.category = quiz?.category || "History";
      this.quiz.difficulty = quiz?.difficulty || "Intermediate";
      this.quiz.thumbnail = quiz?.thumbnail || null;
      this.timeLimit = quiz?.timeLimit || 30;
      this.visibility = quiz?.isPublished === false ? "Private" : "Public";
      this.questions = this.cloneQuestions(questions);
      this.selectedQuestionIndex = 0;
    },
    async loadSourceQuiz() {
      const quizId = this.$route.query.quizId || this.$route.query.copyFrom;
      if (!quizId) return;

      this.sourceQuizId = quizId;
      this.mode = this.$route.query.mode === "edit" ? "edit" : "copy";

      try {
        const res = await api.get(`/quizzes/${quizId}`);
        const quiz = res.data;
        const questions = (quiz.questions || []).map((question) => ({
          text: question.text,
          image: question.image || null,
          answers: (question.options || []).map((option) => option.text),
          correctIndex: 0,
        }));
        this.applyQuizData(quiz, questions);
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || "Failed to load quiz data.");
        this.$router.push("/quizzes");
      }
    },
    async handleThumbnailUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      this.uploadingThumbnail = true;
      try {
        const data = await uploadImage(file, 'quiz-thumbnail');
        this.quiz.thumbnail = data.url;
      } catch (err) {
        alert(err.response?.data?.message || "Failed to upload thumbnail.");
      } finally {
        this.uploadingThumbnail = false;
        event.target.value = null;
      }
    },
    async handleQuestionImageUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      this.uploadingQuestionImage = true;
      try {
        const data = await uploadImage(file, 'quiz-question');
        this.activeQuestion.image = data.url;
      } catch (err) {
        alert(err.response?.data?.message || "Failed to upload question image.");
      } finally {
        this.uploadingQuestionImage = false;
        event.target.value = null;
      }
    },
    getCategoryIcon(cat) {
      const map = {
        'History': 'history',
        'Language': 'translate',
        'Pop Culture': 'theater_comedy',
        'Tech': 'computer',
        'Teaching': 'school',
        'Homework': 'menu_book',
        'Self Study': 'local_library',
        'Other': 'category'
      };
      return map[cat] || 'quiz';
    },
    getDifficultyStars(diff) {
      if (diff === 'Beginner') return 1;
      if (diff === 'Intermediate') return 2;
      if (diff === 'Advanced') return 3;
      return 1;
    },
    difficultyLabel(level) {
      if (level === 1) return 'Beginner';
      if (level === 2) return 'Intermediate';
      return 'Advanced';
    },
    setDifficulty(level) {
      this.quiz.difficulty = this.difficultyLabel(level);
    },
    addQuestion() {
      this.questions.push({
        text: "",
        answers: ["", "", "", ""],
        correctIndex: 0
      });
      this.selectedQuestionIndex = this.questions.length - 1;
    },
    deleteQuestion(idx) {
      this.questions.splice(idx, 1);
      if (this.selectedQuestionIndex >= this.questions.length) {
        this.selectedQuestionIndex = this.questions.length - 1;
      }
    },
    nextStep() {
      if (this.currentStep === 1) {
        if (!this.quiz.title.trim()) {
          alert("Please enter a Quiz Title");
          return;
        }
        this.currentStep = 2;
      } else if (this.currentStep === 2) {
        // Validate questions
        for (let i=0; i<this.questions.length; i++) {
          const q = this.questions[i];
          if (!q.text.trim()) {
            alert(`Question ${i+1} is missing text.`);
            this.selectedQuestionIndex = i;
            return;
          }
          const filledAnswers = q.answers.filter(a => a.trim() !== "");
          if (filledAnswers.length < 2) {
            alert(`Question ${i+1} needs at least 2 answers.`);
            this.selectedQuestionIndex = i;
            return;
          }
          if (q.answers[q.correctIndex].trim() === "") {
            alert(`Question ${i+1} has an empty correct answer.`);
            this.selectedQuestionIndex = i;
            return;
          }
        }
        this.currentStep = 3;
      }
    },
    async publishQuiz() {
      if (this.isSubmitting) return;
      this.isSubmitting = true;
      try {
        const token = localStorage.getItem("token");
        const isEdit = this.mode === "edit" && this.sourceQuizId;
        const res = await fetch(
          isEdit ? `http://localhost:5000/api/quizzes/${this.sourceQuizId}` : "http://localhost:5000/api/quizzes",
          {
          method: isEdit ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            quiz: {
              ...this.quiz,
              timeLimit: this.timeLimit,
              isPublished: this.visibility === "Public"
            },
            questions: this.questions
          })
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to save quiz");
        }
        const isPending = data.moderationStatus === "PENDING";
        alert(isEdit
          ? (isPending ? "Quiz updated and sent to moderation review." : "Quiz updated successfully.")
          : (isPending
            ? "Your quiz is pending moderation review."
            : (this.visibility === "Public"
              ? "Congratulations! Your quiz is now live!"
              : "Your quiz has been saved as private.")));
        this.$router.push("/quizzes");
      } catch (err) {
        console.error(err);
        alert(err.message || "Failed to publish quiz");
      } finally {
        this.isSubmitting = false;
      }
    },
    async generateWithAI() {
      if (!this.aiPrompt.trim()) return;
      this.isGenerating = true;
      this.aiError = "";
      
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/ai/generate-quiz", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ prompt: this.aiPrompt })
        });
        
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to generate quiz");
        
        // Auto-fill
        if (data.title) this.quiz.title = data.title;
        if (data.description) this.quiz.description = data.description;
        
        // Standardize difficulty if it matches our enum
        if (data.difficulty) {
          const d = data.difficulty.toLowerCase();
          if (d.includes('easy') || d.includes('beginner')) this.quiz.difficulty = 'Beginner';
          else if (d.includes('hard') || d.includes('advanced')) this.quiz.difficulty = 'Advanced';
          else this.quiz.difficulty = 'Intermediate';
        }
        
        if (data.questions && data.questions.length > 0) {
          this.questions = data.questions;
        }
        
        this.showAiModal = false;
        this.currentStep = 2; // Jump to questions to review
        this.selectedQuestionIndex = 0;
        
      } catch (err) {
        console.error(err);
        this.aiError = err.message || "Something went wrong. Please try again.";
      } finally {
        this.isGenerating = false;
      }
    }
  },
  mounted() {
    this.loadSourceQuiz();
  }
};
</script>

<style scoped>
/* CSS Reset and Variables */
.create-quiz-container {
  --primary: #4231cf;
  --primary-container: #5b4fe8;
  --primary-light: #e3dfff;
  --secondary: #ffb702;
  --surface: #fcf8ff;
  --surface-low: #f5f2ff;
  --surface-high: #e2e0fc;
  --text-main: #1a1a2e;
  --text-muted: #464555;
  --text-outline: #777586;
  --border-color: #e2e0fc;

  min-height: 100vh;
  background-color: var(--surface);
  color: var(--text-main);
  font-family: 'Inter', sans-serif;
  padding-top: 80px;
  padding-bottom: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Typography Utilities */
.headline-lg { font-family: 'Nunito Sans', sans-serif; font-size: 32px; font-weight: 800; line-height: 1.3; margin: 0 0 8px; }
.headline-md { font-family: 'Nunito Sans', sans-serif; font-size: 24px; font-weight: 700; line-height: 1.4; margin: 0 0 8px; }
.body-text { font-size: 16px; color: var(--text-muted); line-height: 1.6; }
.primary-text { color: var(--primary); }
.muted-text { color: var(--text-outline); }
.mb-lg { margin-bottom: 32px; }
.mb-sm { margin-bottom: 12px; }

/* Wizard Header */
.wizard-header {
  width: 100%;
  max-width: 600px;
  margin-bottom: 48px;
}
.wizard-progress {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}
.progress-line-bg {
  position: absolute;
  top: 20px;
  left: 0;
  width: 100%;
  height: 4px;
  background-color: var(--surface-high);
  transform: translateY(-50%);
  z-index: 0;
  border-radius: 2px;
}
.progress-line-active {
  position: absolute;
  top: 20px;
  left: 0;
  height: 4px;
  background-color: var(--primary);
  transform: translateY(-50%);
  z-index: 0;
  border-radius: 2px;
  transition: width 0.3s ease;
}
.step-item {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.step-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--surface-high);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-family: 'Nunito Sans', sans-serif;
  transition: all 0.3s;
}
.step-circle.active {
  background-color: var(--primary);
  color: white;
  box-shadow: 0 0 0 4px rgba(91, 79, 232, 0.15);
}
.step-circle.completed {
  background-color: var(--primary);
  color: white;
}
.step-label {
  font-family: 'Nunito Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-muted);
}
.step-label.active-text {
  color: var(--primary);
}

/* Common Layouts */
.step-content {
  width: 100%;
  max-width: 800px;
  padding: 0 24px;
}
.step-content.full-width {
  max-width: 1200px;
}
.glass-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid var(--border-color);
  border-radius: 32px;
  padding: 40px;
  position: relative;
  overflow: hidden;
}
.indigo-shadow {
  box-shadow: 0 10px 25px -5px rgba(91, 79, 232, 0.1), 0 8px 10px -6px rgba(91, 79, 232, 0.1);
}
.card-inner {
  position: relative;
  z-index: 10;
}
.decorative-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
}
.blob-1 { top: -80px; right: -80px; width: 200px; height: 200px; background: rgba(255, 183, 2, 0.1); }
.blob-2 { top: -50px; right: -50px; width: 150px; height: 150px; background: rgba(255, 183, 2, 0.2); }
.blob-3 { bottom: -50px; left: -50px; width: 150px; height: 150px; background: rgba(66, 49, 207, 0.1); }

/* Forms */
.form-group {
  margin-bottom: 24px;
}
.form-group label {
  display: block;
  font-family: 'Nunito Sans', sans-serif;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 8px;
}
.input-field {
  width: 100%;
  padding: 16px 24px;
  background: var(--surface-low);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  font-size: 16px;
  color: var(--text-main);
  transition: all 0.2s;
}
.input-field:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 4px rgba(91, 79, 232, 0.1);
}
.textarea { min-height: 100px; resize: vertical; }

.two-col-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

/* Category Grid */
.category-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
.category-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  border-radius: 99px;
  border: 1px solid var(--border-color);
  background: white;
  color: var(--text-muted);
  font-family: 'Nunito Sans', sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.category-btn:hover { background: var(--surface-low); border-color: var(--primary); }
.category-btn.active-category {
  background: var(--surface-low);
  border: 2px solid var(--primary);
  color: var(--primary);
}

/* Faux Select & Slider (Placeholders) */
.difficulty-picker {
  background: var(--surface-low);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.difficulty-star-btn {
  border: 0;
  background: transparent;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-outline);
  transition: transform 0.15s ease, color 0.15s ease;
}
.difficulty-star-btn:hover {
  transform: translateY(-1px);
}
.difficulty-star-btn .star-icon {
  font-variation-settings: 'FILL' 0;
  font-size: 28px;
}
.difficulty-star-btn.filled {
  color: var(--secondary);
}
.difficulty-star-btn.filled .star-icon {
  font-variation-settings: 'FILL' 1;
}
.difficulty-text {
  margin-left: auto;
  font-family: 'Nunito Sans', sans-serif;
  font-weight: 600;
  color: var(--text-muted);
}

.slider-container {
  background: var(--surface-low); border: 1px solid var(--border-color);
  border-radius: 12px; padding: 16px;
}
.slider-header { display: flex; justify-content: space-between; font-family: 'Nunito Sans', sans-serif; font-weight: 600; margin-bottom: 12px; }
.highlight-text { color: var(--primary); }
.range-slider { width: 100%; accent-color: var(--primary); }

/* Visibility */
.visibility-toggle {
  display: flex;
  background: var(--surface-low);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 4px;
}
.vis-btn {
  flex: 1; padding: 12px; border-radius: 12px; border: none; background: transparent;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  font-family: 'Nunito Sans', sans-serif; font-weight: 600; color: var(--text-muted);
  cursor: pointer; transition: all 0.2s;
}
.vis-btn.active {
  background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.05); color: var(--text-main);
}

/* STEP 2: QUESTIONS LAYOUT */
.questions-header { margin-bottom: 32px; }
.questions-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}
@media (min-width: 1024px) {
  .questions-layout { grid-template-columns: 350px 1fr; }
}

/* Sidebar */
.sidebar { display: flex; flex-direction: column; gap: 16px; }
.sidebar-card {
  background: var(--surface-low); border: 1px solid var(--border-color);
  border-radius: 16px; padding: 24px;
}
.sidebar-title { font-family: 'Nunito Sans', sans-serif; font-size: 14px; text-transform: uppercase; color: var(--text-main); margin: 0 0 16px; }
.questions-list { max-height: 400px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; padding-right: 8px; }
.q-item {
  display: flex; align-items: center; gap: 12px; padding: 16px;
  background: white; border: 1px solid var(--border-color); border-radius: 12px;
  cursor: pointer; transition: all 0.2s;
}
.q-item:hover { background: var(--surface-low); }
.q-item.active-q {
  background: rgba(91, 79, 232, 0.05);
  border: 2px solid var(--primary);
}
.drag-icon { color: var(--text-outline); font-size: 20px; }
.active-q .drag-icon { color: var(--primary); opacity: 0.5; }
.q-info { flex: 1; overflow: hidden; }
.q-title { display: block; font-weight: bold; color: var(--text-muted); font-size: 14px; }
.active-q .q-title { color: var(--primary); }
.q-preview { display: block; font-size: 12px; color: var(--text-outline); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.delete-icon { color: var(--text-outline); background: transparent; border: none; cursor: pointer; font-size: 20px; }
.delete-icon:hover { color: #ef4444; }

.add-q-btn {
  width: 100%; margin-top: 24px; padding: 16px; border-radius: 12px;
  border: 2px solid var(--primary); background: transparent; color: var(--primary);
  font-family: 'Nunito Sans', sans-serif; font-weight: bold; font-size: 16px;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  cursor: pointer; transition: all 0.2s;
}
.add-q-btn:hover { background: rgba(91, 79, 232, 0.05); }

.pro-tip {
  background: rgba(255, 183, 2, 0.1); border: 1px solid var(--secondary);
  border-radius: 16px; padding: 24px; display: flex; gap: 16px; align-items: center;
}
.tip-icon { font-size: 32px; color: var(--secondary); }
.tip-title { font-family: 'Nunito Sans', sans-serif; font-weight: bold; color: #6b4b00; margin: 0; }
.tip-text { font-size: 12px; color: #6b4b00; margin: 0; }

/* Editor */
.editor-card { padding: 32px; border-radius: 16px; background: white; }
.big-textarea { font-family: 'Nunito Sans', sans-serif; font-size: 24px; font-weight: 700; background: #F5F3FF; border: none; min-height: 120px; }

.media-upload {
  width: 100%; height: 160px; border: 2px dashed var(--border-color); border-radius: 12px;
  background: white; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px;
  cursor: not-allowed; opacity: 0.7; /* Placeholder */
}
.upload-icon-wrapper { width: 48px; height: 48px; border-radius: 50%; background: var(--surface-low); display: flex; align-items: center; justify-content: center; }
.upload-icon-wrapper span { color: var(--primary); font-size: 24px; }
.upload-title { font-family: 'Nunito Sans', sans-serif; font-weight: bold; margin: 0; }
.upload-subtitle { font-size: 12px; color: var(--text-outline); margin: 0; }

.answers-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.italic-subtitle { font-size: 12px; font-style: italic; color: var(--text-outline); }
.answers-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
@media (min-width: 640px) { .answers-grid { grid-template-columns: 1fr 1fr; } }
.answer-wrapper { position: relative; }
.answer-box {
  display: flex; align-items: center; gap: 16px; padding: 20px; border-radius: 12px;
  border: 1px solid var(--border-color); background: #F5F3FF; cursor: pointer; transition: all 0.2s;
}
.answer-box:hover { border-color: rgba(91, 79, 232, 0.5); }
.answer-box.is-correct { border: 3px solid var(--primary); background: rgba(91, 79, 232, 0.05); }
.answer-letter { width: 32px; height: 32px; border-radius: 8px; background: var(--border-color); color: var(--text-muted); display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0; }
.is-correct .answer-letter { background: var(--primary); color: white; }
.answer-input { flex: 1; border: none; background: transparent; font-size: 16px; font-weight: 600; color: var(--text-main); }
.answer-input:focus { outline: none; }
.answer-radio { width: 24px; height: 24px; accent-color: var(--primary); pointer-events: none; }
.correct-badge { position: absolute; top: -10px; right: -10px; background: #005b42; color: white; padding: 4px 12px; border-radius: 99px; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }

/* STEP 3: REVIEW */
.space-y-lg { display: flex; flex-direction: column; gap: 32px; }
.review-card { padding: 48px; border-radius: 24px; }
.review-inner { display: flex; flex-direction: column; gap: 32px; align-items: center; text-align: center; }
@media (min-width: 768px) {
  .review-inner { flex-direction: row; text-align: left; }
}
.quiz-icon-box { width: 140px; height: 140px; border-radius: 24px; background: var(--surface-low); border: 2px dashed rgba(91, 79, 232, 0.3); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.giant-icon { font-size: 64px; color: var(--primary); }
.review-details { flex: 1; display: flex; flex-direction: column; gap: 12px; }
.tags-row { display: flex; gap: 8px; justify-content: center; }
@media (min-width: 768px) { .tags-row { justify-content: flex-start; } }
.tag { padding: 4px 12px; border-radius: 99px; font-family: 'Nunito Sans', sans-serif; font-size: 14px; font-weight: bold; }
.primary-tag { background: var(--primary-container); color: white; }
.subtle-tag { background: var(--surface-high); color: var(--text-muted); display: flex; align-items: center; gap: 4px; }
.small-icon { font-size: 16px; }
.title-text { margin: 0; }
.max-width { max-width: 600px; }
.stats-row { display: flex; gap: 32px; margin-top: 24px; padding-top: 24px; border-top: 1px solid var(--border-color); justify-content: center; }
@media (min-width: 768px) { .stats-row { justify-content: flex-start; } }
.stat-item { display: flex; flex-direction: column; gap: 4px; }
.stat-label { font-size: 12px; text-transform: uppercase; color: var(--text-outline); letter-spacing: 1px; margin: 0; }
.stat-value { font-family: 'Nunito Sans', sans-serif; font-size: 24px; font-weight: bold; margin: 0; }
.text-secondary { color: var(--secondary); }
.tertiary-text { color: #007657; }
.py-xl { padding: 40px 0; }

/* FOOTER */
.wizard-footer {
  position: fixed; bottom: 0; left: 0; width: 100%; background: var(--surface-low);
  border-top: 1px solid var(--border-color); padding: 24px 0; z-index: 50;
}
.footer-inner {
  max-width: 1200px; margin: 0 auto; padding: 0 24px;
  display: flex; justify-content: space-between; align-items: center;
}
.btn-back { display: flex; align-items: center; gap: 8px; font-family: 'Nunito Sans', sans-serif; font-weight: bold; color: var(--text-muted); background: transparent; border: none; cursor: pointer; transition: color 0.2s; }
.btn-back:hover { color: var(--primary); }
.footer-actions { display: flex; align-items: center; gap: 24px; }
.auto-save-text { font-size: 12px; color: var(--text-outline); font-weight: 500; display: none; }
@media (min-width: 640px) { .auto-save-text { display: block; } }

.btn-primary-3d, .btn-publish-3d {
  display: flex; align-items: center; gap: 8px; padding: 16px 32px; border-radius: 99px;
  font-family: 'Nunito Sans', sans-serif; font-weight: 800; font-size: 16px; border: none;
  cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 0 rgba(0,0,0,0.1);
}
.btn-primary-3d { background: var(--secondary); color: #6b4b00; }
.btn-primary-3d:active { transform: translateY(2px); box-shadow: 0 2px 0 rgba(0,0,0,0.1); }
.btn-primary-3d:hover { filter: brightness(1.05); }

.btn-publish-3d { background: var(--primary); color: white; box-shadow: 0 4px 0 #281a8c, 0 8px 16px rgba(91, 79, 232, 0.3); }
.btn-publish-3d:active { transform: translateY(4px); box-shadow: 0 0 0 #281a8c; }
.btn-publish-3d:hover { filter: brightness(1.1); }
.btn-publish-3d:disabled { opacity: 0.7; cursor: not-allowed; }

/* AI Modal & Button */
.floating-ai-btn {
  position: fixed; bottom: 130px; right: 32px; background: linear-gradient(135deg, #00e5ff, #5b4fe8);
  color: white; padding: 16px 24px; border-radius: 99px; font-family: 'Nunito Sans', sans-serif; font-weight: bold;
  border: none; cursor: pointer; box-shadow: 0 8px 24px rgba(91, 79, 232, 0.4); z-index: 40;
  display: flex; align-items: center; gap: 8px; transition: transform 0.2s;
}
.floating-ai-btn:hover { transform: translateY(-4px) scale(1.02); }

.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(26, 26, 46, 0.5); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; z-index: 100;
}
.modal-content {
  width: 90%; max-width: 500px; background: white; padding: 32px;
}
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.ai-title { display: flex; align-items: center; gap: 8px; font-family: 'Nunito Sans', sans-serif; font-size: 24px; font-weight: 800; margin: 0; }
.text-primary { color: var(--primary); }
.close-btn { background: transparent; border: none; font-size: 24px; color: var(--text-outline); cursor: pointer; }
.close-btn:hover { color: var(--text-main); }
.ai-desc { font-size: 14px; color: var(--text-muted); margin-bottom: 24px; }
.ai-textarea { border: 2px solid #00e5ff; background: rgba(0, 229, 255, 0.05); }
.ai-textarea:focus { box-shadow: 0 0 15px rgba(0, 229, 255, 0.2); }
.error-text { color: #ef4444; font-size: 14px; margin-top: 12px; }
.full-w { width: 100%; justify-content: center; }
.mt-md { margin-top: 16px; }
</style>
