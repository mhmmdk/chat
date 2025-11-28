async function generateLessonForUser(userId) {
  const user = await User.findById(userId);
  const coreWords = await Word.find({}).sort({ rank: 1 }).limit(3000); // cache in memory
  // pick new words
  const learnedSet = new Set(
    user.learnedWords.map((x) => x.word.toLowerCase())
  );
  const candidate = coreWords
    .map((w) => w.word)
    .filter((w) => !learnedSet.has(w));
  const N = user.settings?.dailyNew || 5;
  const newWords = candidate.slice(0, N); // highest frequency first

  // pick due reviews
  const due = user.learnedWords
    .filter((w) => w.reviewDueAt && new Date(w.reviewDueAt) <= new Date())
    .map((w) => w.word)
    .slice(0, 10);

  // sample extras
  const extras = user.learnedWords.map((x) => x.word).slice(0, 5);

  const lessonWords = [...newWords, ...due, ...extras];

  // call AI to generate sentences using only allowed vocab:
  const allowedVocab = [
    ...user.learnedWords.map((x) => x.word),
    ...user.userVocab.map((x) => x.word),
    ...newWords,
  ];
  const sentences = await callAI_generateSentences(lessonWords, allowedVocab);

  // generate quizzes (MCQ/T-F)
  const quiz = await callAI_generateQuiz(lessonWords, allowedVocab);

  // Save lesson
  const lesson = await new Lesson({
    userId,
    date: new Date(),
    words: lessonWords,
    newWords,
    generatedSentences: sentences,
    quiz,
    status: "ready",
  }).save();

  // Optionally push a quiz message into the messages stream so chat UI sees it:
  // pushMessage({ user:'bot', text: 'Lesson ready', choices: quiz[0].options })
  return lesson;
}
