// frontend/src/components/QuizManagement.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/styles.css';

function QuizManagement() {
  const [quizzes, setQuizzes] = useState([]);
  const [modules, setModules] = useState([]);
  
  // State for creating a new quiz including title
  const [newQuiz, setNewQuiz] = useState({ title: '', moduleId: '', questions: [], passingScore: '' });
  const [newQuestion, setNewQuestion] = useState({ text: '', options: ['', '', '', ''], correctAnswer: '' });
  
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', moduleId: '', questions: [], passingScore: '' });
  const [editQuestion, setEditQuestion] = useState({ text: '', options: ['', '', '', ''], correctAnswer: '' });
  
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchQuizzes();
    fetchModules();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get('/api/admin/quizzes', { withCredentials: true });
      setQuizzes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchModules = async () => {
    try {
      const res = await axios.get('/api/admin/modules', { withCredentials: true });
      setModules(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/admin/quizzes', newQuiz, { withCredentials: true });
      setNewQuiz({ title: '', moduleId: '', questions: [], passingScore: '' });
      setNewQuestion({ text: '', options: ['', '', '', ''], correctAnswer: '' });
      setMessage('Quiz created successfully!');
      fetchQuizzes();
    } catch (err) {
      console.error(err);
      setMessage('Error creating quiz');
    }
  };

  const addNewQuestion = () => {
    if (
      newQuestion.text.trim() &&
      newQuestion.options.every(opt => opt.trim()) &&
      newQuestion.correctAnswer.trim()
    ) {
      setNewQuiz({ ...newQuiz, questions: [...newQuiz.questions, newQuestion] });
      setNewQuestion({ text: '', options: ['', '', '', ''], correctAnswer: '' });
    }
  };

  const handleEditClick = (quiz) => {
    setEditingQuiz(quiz._id);
    setEditForm({ 
      title: quiz.title,
      moduleId: quiz.moduleId,
      questions: quiz.questions || [],
      passingScore: quiz.passingScore 
    });
  };

  const handleUpdateQuiz = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/admin/quizzes/${editingQuiz}`, editForm, { withCredentials: true });
      setMessage('Quiz updated successfully!');
      setEditingQuiz(null);
      fetchQuizzes();
    } catch (err) {
      console.error(err);
      setMessage('Error updating quiz');
    }
  };

  const handleDeleteQuiz = async (id) => {
    try {
      await axios.delete(`/api/admin/quizzes/${id}`, { withCredentials: true });
      setMessage('Quiz deleted successfully!');
      fetchQuizzes();
    } catch (err) {
      console.error(err);
      setMessage('Error deleting quiz');
    }
  };

  const deleteQuestion = (index) => {
    const updatedQuestions = editForm.questions.filter((_, i) => i !== index);
    setEditForm({ ...editForm, questions: updatedQuestions });
  };

  const updateQuestionField = (index, field, value) => {
    const updatedQuestions = editForm.questions.map((q, i) => {
      if (i === index) {
        return { ...q, [field]: value };
      }
      return q;
    });
    setEditForm({ ...editForm, questions: updatedQuestions });
  };

  const addEditQuestion = () => {
    if (
      editQuestion.text.trim() &&
      editQuestion.options.every(opt => opt.trim()) &&
      editQuestion.correctAnswer.trim()
    ) {
      setEditForm({ ...editForm, questions: [...editForm.questions, editQuestion] });
      setEditQuestion({ text: '', options: ['', '', '', ''], correctAnswer: '' });
    }
  };

  return (
    <div>
      <h3>Create New Quiz</h3>
      {message && <p>{message}</p>}
      <form onSubmit={handleCreateQuiz}>
        <input
          type="text"
          placeholder="Quiz Title"
          value={newQuiz.title}
          onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
          required
        />
        <select
          value={newQuiz.moduleId}
          onChange={(e) => setNewQuiz({ ...newQuiz, moduleId: e.target.value })}
          required
        >
          <option value="">Select Module</option>
          {modules.map(mod => (
            <option key={mod._id} value={mod._id}>{mod.title}</option>
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
            />
          ))}
          <input
            type="text"
            placeholder="Correct Answer"
            value={newQuestion.correctAnswer}
            onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
          />
          <button type="button" onClick={addNewQuestion}>Add Question</button>
        </div>
        <button type="submit">Create Quiz</button>
        {newQuiz.questions.length > 0 && (
          <div>
            <h5>Questions Added:</h5>
            <ul>
              {newQuiz.questions.map((q, index) => (
                <li key={index}>
                  <strong>{q.text}</strong> | Options: {q.options.join(', ')} | Correct: {q.correctAnswer}
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>

      <h3>Existing Quizzes</h3>
      <ul>
        {quizzes.map(quiz => (
          <li key={quiz._id} style={{ marginBottom: '10px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
            <strong>{quiz.title || 'Untitled Quiz'}</strong> - Module: {quiz.moduleId?.title || 'N/A'} - Passing Score: {quiz.passingScore}
            <button onClick={() => handleEditClick(quiz)} style={{ marginLeft: '10px' }}>Edit</button>
            <button onClick={() => handleDeleteQuiz(quiz._id)} style={{ marginLeft: '10px' }}>Delete</button>
          </li>
        ))}
      </ul>

      {editingQuiz && (
        <div>
          <h3>Edit Quiz</h3>
          <form onSubmit={handleUpdateQuiz}>
            <input
              type="text"
              placeholder="Quiz Title"
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              required
            />
            <select
              value={editForm.moduleId}
              onChange={(e) => setEditForm({ ...editForm, moduleId: e.target.value })}
              required
            >
              <option value="">Select Module</option>
              {modules.map(mod => (
                <option key={mod._id} value={mod._id}>{mod.title}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Passing Score"
              value={editForm.passingScore}
              onChange={(e) => setEditForm({ ...editForm, passingScore: e.target.value })}
              required
            />
            <div>
              <h4>Edit Questions</h4>
              {editForm.questions.map((q, index) => (
                <div key={index} style={{ border: '1px solid #ccc', padding: '5px', marginBottom: '5px' }}>
                  <input
                    type="text"
                    value={q.text}
                    onChange={(e) => updateQuestionField(index, 'text', e.target.value)}
                    required
                  />
                  {q.options.map((opt, idx) => (
                    <input
                      key={idx}
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const updatedOptions = [...q.options];
                        updatedOptions[idx] = e.target.value;
                        updateQuestionField(index, 'options', updatedOptions);
                      }}
                      required
                    />
                  ))}
                  <input
                    type="text"
                    value={q.correctAnswer}
                    onChange={(e) => updateQuestionField(index, 'correctAnswer', e.target.value)}
                    required
                  />
                  <button type="button" onClick={() => deleteQuestion(index)}>Delete Question</button>
                </div>
              ))}
              <h5>Add New Question</h5>
              <input
                type="text"
                placeholder="Question Text"
                value={editQuestion.text}
                onChange={(e) => setEditQuestion({ ...editQuestion, text: e.target.value })}
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
                />
              ))}
              <input
                type="text"
                placeholder="Correct Answer"
                value={editQuestion.correctAnswer}
                onChange={(e) => setEditQuestion({ ...editQuestion, correctAnswer: e.target.value })}
              />
              <button type="button" onClick={addEditQuestion}>Add New Question</button>
            </div>
            <button type="submit">Save</button>
            <button type="button" onClick={() => setEditingQuiz(null)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default QuizManagement;
