const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// In-memory storage for quizzes
const quizzes = new Map();

// Configure CORS for both development and production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://forms-client.vercel.app']
    : ['http://localhost:3000'],
  methods: ['GET', 'POST'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Create a new quiz
app.post('/api/quizzes', (req, res) => {
  const { title, questions } = req.body;
  const quizId = uuidv4();
  
  const quiz = {
    id: quizId,
    title,
    questions,
    createdAt: new Date()
  };

  quizzes.set(quizId, quiz);
  res.status(201).json({ quizId, quiz });
});

// Get a quiz by ID
app.get('/api/quizzes/:id', (req, res) => {
  const quiz = quizzes.get(req.params.id);
  if (!quiz) {
    return res.status(404).json({ error: 'Quiz not found' });
  }
  res.json(quiz);
});

// Submit quiz answers and get score
app.post('/api/quizzes/:id/submit', (req, res) => {
  const quiz = quizzes.get(req.params.id);
  if (!quiz) {
    return res.status(404).json({ error: 'Quiz not found' });
  }

  const { answers } = req.body;
  let score = 0;
  const totalQuestions = quiz.questions.length;

  quiz.questions.forEach((question, index) => {
    if (answers[index] === question.correctAnswer) {
      score++;
    }
  });

  const result = {
    score,
    totalQuestions,
    percentage: (score / totalQuestions) * 100
  };

  res.json(result);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});