<template>
  <nav>
    <router-link to="/quizzes">Quizzes</router-link> |
    <router-link to="/create-quiz">Create Quiz</router-link> |
    <router-link to="/login">Login</router-link> |
  </nav>

  <router-view />
</template>


<style>
nav {
  padding: 1rem;
}
nav a {
  margin-right: 1rem;
}
</style>