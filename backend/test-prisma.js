const prisma = require('./utils/prisma');
async function test() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: { select: { id: true, username: true, avatar: true, title: true } },
        _count: { select: { comments: true } }
      }
    });
    console.log('Success, posts count:', posts.length);
  } catch (err) {
    console.error('Prisma Error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}
test();
