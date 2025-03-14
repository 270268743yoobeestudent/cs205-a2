import React, { useEffect, useState, useRef } from "react";
import "./Quizzes.css";

const Quizzes = () => {
    const [answers, setAnswers] = useState({});
    const [score, setScore] = useState(null);
    const topRef = useRef(null); // Create reference to scroll to

    // Force the first question into view on load
    useEffect(() => {
        if (topRef.current) {
            topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, []);

    const handleAnswerChange = (event) => {
        setAnswers({
            ...answers,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = () => {
        if (!answers.q5 || !answers.q6) {
            setScore("❗ Please answer all questions.");
            return;
        }

        let totalScore = 0;
        if (answers.q5 === "mfa") totalScore++;
        if (answers.q6 === "attachments") totalScore++;

        setScore(`✅ You got ${totalScore}/2 correct!`);
    };

    return (
        <div className="quiz-container" ref={topRef}>
            <h2>Take the Quiz</h2>

            {/* Question 5 */}
            <div className="question">❓ Question 5: What does multi-factor authentication require?</div>
            <ul className="options">
                <li>
                    <label>
                        <input type="radio" name="q5" value="username" onChange={handleAnswerChange} />
                        Only a username
                    </label>
                </li>
                <li>
                    <label>
                        <input type="radio" name="q5" value="password" onChange={handleAnswerChange} />
                        A single strong password
                    </label>
                </li>
                <li>
                    <label>
                        <input type="radio" name="q5" value="mfa" onChange={handleAnswerChange} />
                        Two or more methods to verify identity
                    </label>
                </li>
                <li>
                    <label>
                        <input type="radio" name="q5" value="safe" onChange={handleAnswerChange} />
                        Access to a physical safe
                    </label>
                </li>
            </ul>

            {/* Question 6 */}
            <div className="question">❓ Question 6: What should you avoid doing to stay safe from malware?</div>
            <ul className="options">
                <li>
                    <label>
                        <input type="radio" name="q6" value="attachments" onChange={handleAnswerChange} />
                        Opening email attachments from unknown sources
                    </label>
                </li>
                <li>
                    <label>
                        <input type="radio" name="q6" value="antivirus" onChange={handleAnswerChange} />
                        Using updated antivirus software
                    </label>
                </li>
                <li>
                    <label>
                        <input type="radio" name="q6" value="update" onChange={handleAnswerChange} />
                        Regularly updating your operating system
                    </label>
                </li>
                <li>
                    <label>
                        <input type="radio" name="q6" value="suspicious" onChange={handleAnswerChange} />
                        Avoiding suspicious websites
                    </label>
                </li>
            </ul>

            <button onClick={handleSubmit}>Submit</button>
            
            {score !== null && <p className="result">{score}</p>}
        </div>
    );
};

export default Quizzes;
