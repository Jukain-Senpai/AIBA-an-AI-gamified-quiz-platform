// backend/scripts/seedMockData.js
// ------------------------------------------------------------
// Mock‑data seeder for the AIBA project.
// Run with:   node backend/scripts/seedMockData.js
// ------------------------------------------------------------

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const { faker } = require("@faker-js/faker"); // npm i @faker-js/faker --save-dev
const bcrypt = require("bcryptjs");
const prisma = require("../utils/prisma");

// ---------- Helpers ----------
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// ------------------------------------------------------------
// 1️⃣ Create Users (≈ 30)
// ------------------------------------------------------------
async function createUsers(count = 30) {
  const users = [];

  for (let i = 0; i < count; i++) {
    const email = faker.internet.email().toLowerCase();
    const username = faker.internet.username().toLowerCase();
    const passwordHash = await bcrypt.hash("password123", 10); // same password for all mock users

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: passwordHash,
        avatar: `https://i.pravatar.cc/150?img=${randomInt(1, 70)}`, // random avatar image
        // other default fields (role, status, etc.) are auto‑filled by Prisma defaults
      },
    });
    users.push(user);
  }
  console.log(`✅ Created ${users.length} users`);
  return users;
}

// ------------------------------------------------------------
// 2️⃣ Create Quizzes (≈ 20) – each belongs to a random user
// ------------------------------------------------------------
async function createQuizzes(users, count = 20) {
  const quizzes = [];

  for (let i = 0; i < count; i++) {
    const creator = users[randomInt(0, users.length - 1)];
    const quiz = await prisma.quiz.create({
      data: {
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        thumbnail: `https://picsum.photos/seed/quiz${i}/400/200`,
        difficulty: faker.helpers.arrayElement(["Easy", "Medium", "Hard"]),
        category: faker.helpers.arrayElement(["General", "Science", "History", "Sports"]),
        timeLimit: randomInt(20, 60),
        creatorId: creator.id,
        // create a few questions per quiz
        questions: {
          create: Array.from({ length: randomInt(3, 6) }, () => ({
            text: faker.lorem.sentence(),
            order: randomInt(1, 10),
            image: faker.datatype.boolean()
              ? `https://picsum.photos/seed/q${faker.string.uuid()}/300/200`
              : null,
            options: {
              create: [
                { text: faker.lorem.words(2), isCorrect: true },
                { text: faker.lorem.words(2), isCorrect: false },
                { text: faker.lorem.words(2), isCorrect: false },
                { text: faker.lorem.words(2), isCorrect: false },
              ],
            },
          })),
        },
      },
    });
    quizzes.push(quiz);
  }
  console.log(`✅ Created ${quizzes.length} quizzes`);
  return quizzes;
}

// ------------------------------------------------------------
// 3️⃣ Create Posts (≈ 30) – random author, optional image
// ------------------------------------------------------------
async function createPosts(users, count = 30) {
  const posts = [];

  for (let i = 0; i < count; i++) {
    const author = users[randomInt(0, users.length - 1)];
    const post = await prisma.post.create({
      data: {
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraphs(randomInt(2, 5), "\n\n"),
        category: faker.helpers.arrayElement(["News", "Tips", "Story", "Announcement"]),
        tags: faker.helpers.arrayElements(
          ["AI", "Quiz", "Gaming", "Education", "Fun", "Challenge"],
          randomInt(1, 3)
        ),
        image: faker.datatype.boolean()
          ? `https://picsum.photos/seed/post${i}/800/400`
          : null,
        authorId: author.id,
      },
    });
    posts.push(post);
  }
  console.log(`✅ Created ${posts.length} posts`);
  return posts;
}

// ------------------------------------------------------------
// 4️⃣ Create Comments (≈ 80) – only on posts for simplicity
// ------------------------------------------------------------
async function createComments(users, posts, count = 80) {
  const comments = [];

  for (let i = 0; i < count; i++) {
    const author = users[randomInt(0, users.length - 1)];
    const post = posts[randomInt(0, posts.length - 1)];
    const comment = await prisma.comment.create({
      data: {
        content: faker.lorem.sentences(randomInt(1, 3)),
        authorId: author.id,
        postId: post.id,
      },
    });
    comments.push(comment);
  }
  console.log(`✅ Created ${comments.length} comments`);
  return comments;
}

// ------------------------------------------------------------
// Main entry point
// ------------------------------------------------------------
async function main() {
  try {
    // 1️⃣ Users
    const users = await createUsers(30);

    // 2️⃣ Quizzes (needs users)
    const quizzes = await createQuizzes(users, 20);

    // 3️⃣ Posts (needs users)
    const posts = await createPosts(users, 30);

    // 4️⃣ Comments (needs users, posts)
    await createComments(users, posts, 80);

    console.log("\n🎉 Mock data seeding complete!");
  } catch (err) {
    console.error("❌ Seeding error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
