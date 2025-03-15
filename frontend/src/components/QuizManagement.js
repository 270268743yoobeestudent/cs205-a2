// frontend/src/components/QuizManagement.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function QuizManagement() {
  // State for list of quizzes
  const [quizzes, setQuizzes] = useState([]);
  // State for list of modules
  const [modules, setModules] = useState([]);
  // State for creating a new quiz; moduleId will come from dropdown selection
  const [newQuiz, setNewQuiz] = useState({ moduleId: '', questions: [], passingScore: '' });
  // Temporary state for a new question in the new quiz
  const [newQuestion, setNewQuestion] = useState({ text: '', options: ['', '', '', ''], correctAnswer: '' });
  // State for editing an existing quiz
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [editForm, setEditForm] = useState({ moduleId: '', questions: [], passingScore: '' });
  // Temporary state for adding a new question in edit mode
  const [editQuestion, setEditQuestion] = useState({ text: '', options: ['', '', '', ''], correctAnswer: '' });
  // Message for feedback
  const [message, setMessage] = useState('');

  // Fetch quizzes and modules on component mount
  useEffect(() => {
    fetchQuizzes();
    fetchModules();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get('/api/admin/quizzes');
      setQuizzes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchModules = async () => {
    try {
      const res = await axios.get('/api/admin/modules');
      setModules(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // --- Create New Quiz Functions ---

  const addNewQuestion = () => {
    setNewQuiz({ ...newQuiz, questions: [...newQuiz.questions, newQuestion] });
    setNewQuestion({ text: '', options: ['', '', '', ''], correctAnswer: '' });
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/admin/quizzes', newQuiz);
      setNewQuiz({ moduleId: '', questions: [], passingScore: '' });
      setMessage('Quiz created successfully!');
      fetchQuizzes();
    } catch (err) {
      console.error(err);
      setMessage('Error creating quiz');
    }
  };

  // --- Edit Existing Quiz Functions ---

  const handleEditClick = (quiz) => {
    setEditingQuiz(quiz._id);
    setEditForm({ 
      moduleId: quiz.moduleId, 
      questions: quiz.questions, 
      passingScore: quiz.passingScore 
    });
  };

  const addEditQuestion = () => {
    setEditForm({ ...editForm, questions: [...editForm.questions, editQuestion] });
    setEditQuestion({ text: '', options: ['', '', '', ''], correctAnswer: '' });
  };

  const handleUpdateQuiz = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/admin/quizzes/${editingQuiz}`, editForm);
      setMessage('Quiz updated successfully!');
      setEditingQuiz(null);
      fetchQuizzes();
    } catch (err) {
      console.error(err);
      setMessage('Error updating quiz');
    }
  };

  // --- Delete Quiz Function ---

  const handleDeleteQuiz = async (id) => {
    try {
      await axios.delete(`/api/admin/quizzes/${id}`);
      setMessage('Quiz deleted successfully!');
      fetchQuizzes();
    } catch (err) {
      console.error(err);
      setMessage('Error deleting quiz');
    }
  };

  // Helper function to get module title from module id (compares as strings)
  const getModuleTitle = (moduleId) => {
    const mod = modules.find(m => String(m._id) === String(moduleId));
    return mod ? mod.title : moduleId;
  };

  return (
    <div>
      <h3>Create New Quiz</h3>
      {message && <p>{message}</p>}
      <form onSubmit={handleCreateQuiz}>
        {/* Dropdown to select module by title; value is the module's _id */}
        <select
          value={newQuiz.moduleId}
          onChange={(e) => setNewQuiz({ ...newQuiz, moduleId: e.target.value })}
          required
        >
          <option value="">Select Module</option>
          {modules.map((mod) => (
            <option key={mod._id} value={mod._id}>
              {mod.title}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Passing Score"
          value={newQuiz.passingScore}
          onChange={(e) => setNewQuiz({ ...newQuiz, passingScore: e.target.value })}
          required
        />
        <div>
          <h4>Add Question</h4>
          <input
            type="text"
            placeholder="Question Text"
            value={newQuestion.text}
            onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
            required
          />
          {newQuestion.options.map((opt, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Option ${index + 1}`}
              value={opt}
              onChange={(e) => {
                const newOptions = [...newQuestion.options];
                newOptions[index] = e.target.value;
                setNewQuestion({ ...newQuestion, options: newOptions });
              }}
              required
            />
          ))}
          <input
            type="text"
            placeholder="Correct Answer"
            value={newQuestion.correctAnswer}
            onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
            required
          />
          <button type="button" onClick={addNewQuestion}>Add Question</button>
        </div>
        <button type="submit">Create Quiz</button>
      </form>

      <h3>Existing Quizzes</h3>
      <ul>
        {quizzes.map((quiz) => (
          <li key={quiz._id}>
            {editingQuiz === quiz._id ? (
              <form onSubmit={handleUpdateQuiz}>
                {/* Use dropdown for module selection */}
                <select
                  value={editForm.moduleId}
                  onChange={(e) => setEditForm({ ...editForm, moduleId: e.target.value })}
                  required
                >
                  <option value="">Select Module</option>
                  {modules.map((mod) => (
                    <option key={mod._id} value={mod._id}>
                      {mod.title}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={editForm.passingScore}
                  onChange={(e) => setEditForm({ ...editForm, passingScore: e.target.value })}
                  required
                />
                <div>
                  <h4>Edit Questions</h4>
                  {editForm.questions.map((q, qIndex) => (
                    <div key={qIndex}>
                      <p><strong>Question:</strong> {q.text}</p>
                      <p><strong>Options:</strong> {q.options.join(', ')}</p>
                      <p><strong>Correct Answer:</strong> {q.correctAnswer}</p>
                    </div>
                  ))}
                  <h5>Add New Question</h5>
                  <input
                    type="text"
                    placeholder="Question Text"
                    value={editQuestion.text}
                    onChange={(e) => setEditQuestion({ ...editQuestion, text: e.target.value })}
                    required
                  />
                  {editQuestion.options.map((opt, index) => (
                    <input
                      key={index}
                      type="text"
                      placeholder={`Option ${index + 1}`}
                      value={opt}
                      onChange={(e) => {
                        const newOptions = [...editQuestion.options];
                        newOptions[index] = e.target.value;
                        setEditQuestion({ ...editQuestion, options: newOptions });
                      }}
                      required
                    />
                  ))}
                  <input
                    type="text"
                    placeholder="Correct Answer"
                    value={editQuestion.correctAnswer}
                    onChange={(e) => setEditQuestion({ ...editQuestion, correctAnswer: e.target.value })}
                    required
                  />
                  <button type="button" onClick={addEditQuestion}>Add Question</button>
                </div>
                <button type="submit">Save</button>
                <button type="button" onClick={() => setEditingQuiz(null)}>Cancel</button>
              </form>
            ) : (
              <div>
                <p>
                  <strong>Module:</strong> {getModuleTitle(quiz.moduleId)} | <strong>Passing Score:</strong> {quiz.passingScore} |{' '}
                  <strong>Questions:</strong> {quiz.questions.length}
                </p>
                <button onClick={() => handleEditClick(quiz)}>Edit</button>
                <button onClick={() => handleDeleteQuiz(quiz._id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default QuizManagement;
