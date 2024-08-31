import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/editQuizModal.css";

const EditQuizModal = ({ quiz, onClose, onSave }) => {
  const [questions, setQuestions] = useState(quiz?.questions || []);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  useEffect(() => {
    if (quiz && quiz.questions) {
      setQuestions(quiz.questions);
    }
  }, [quiz]);

  const handleQuestionChange = (index, e) => {
    const newQuestions = [...questions];
    newQuestions[index].text = e.target.value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, e) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = e.target.value;
    setQuestions(newQuestions);
  };

  const handleTimerChange = (index, e) => {
    const newQuestions = [...questions];
    newQuestions[index].timer = e.target.value === "off" ? 0 : e.target.value;
    setQuestions(newQuestions);
  };

  const handleSave = async () => {
    const updatedQuiz = {
      ...quiz,
      questions,
    };

    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `http://localhost:5000/api/quizzes/${quiz._id}`,
        updatedQuiz,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onSave(response.data);
      onClose();
    } catch (error) {
      console.error("Error saving edited quiz:", error);
      alert("Failed to save quiz. Please try again.");
    }
  };

  if (!quiz) {
    return null; // Prevent rendering if quiz prop is missing
  }

  return (
    <div className="edit-quiz-modal-overlay">
      <div className="edit-quiz-modal-content">
        <h2>Edit Quiz</h2>
        <div className="edit-quiz-question-navigation">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveQuestionIndex(index)}
              className={`edit-quiz-question-button ${
                activeQuestionIndex === index ? "active" : ""
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <div className="edit-quiz-question-group">
          <input
            type="text"
            value={questions[activeQuestionIndex]?.text || ""}
            onChange={(e) => handleQuestionChange(activeQuestionIndex, e)}
            className="edit-quiz-modal-input"
          />
          {questions[activeQuestionIndex]?.options.map((option, oIndex) => (
            <div
              key={oIndex}
              className={`edit-quiz-option-group ${
                questions[activeQuestionIndex].correctOption === oIndex
                  ? "edit-quiz-correct-option"
                  : ""
              }`}
            >
              <input
                type="text"
                value={option}
                onChange={(e) =>
                  handleOptionChange(activeQuestionIndex, oIndex, e)
                }
              />
            </div>
          ))}
          <div className="edit-quiz-form-group">
            <label className="edit-quiz-modal-label">Timer:</label>
            <select
              value={questions[activeQuestionIndex]?.timer || "off"}
              onChange={(e) => handleTimerChange(activeQuestionIndex, e)}
              className="edit-quiz-modal-select"
            >
              <option value="off">Off</option>
              <option value="5">5 seconds</option>
              <option value="10">10 seconds</option>
            </select>
          </div>
        </div>
        <div className="edit-quiz-modal-actions">
          <button className="edit-quiz-modal-button" onClick={onClose}>
            Cancel
          </button>
          <button className="edit-quiz-modal-button" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditQuizModal;
