import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import "./App.css";
import { Analytics } from "@vercel/analytics/react"
import Editor from "@monaco-editor/react";

function App() {
  const [problems, setProblems] = useState([]);
  const [search, setSearch] = useState("");
  const [openProblem, setOpenProblem] = useState(null);
  const [openCategories, setOpenCategories] = useState({});
  // const [patternStep, setPatternStep] = useState({});
  // const [feedback, setFeedback] = useState({});
  // const [thinkingStep, setThinkingStep] = useState({});
  const [points, setPoints] = useState(Number(localStorage.getItem("points")) || 0);
  const [code, setCode] = useState("// Write code here");

  useEffect(() => {
    fetch("/data/questions_2.json")
      .then((response) => response.json())
      .then((data) => setProblems(data));
  }, []);

  const [solvedProblems, setSolvedProblems] =
  useState(
    JSON.parse(
      localStorage.getItem("solvedProblems")
    ) || {}
  );

  useEffect(() => {
    localStorage.setItem("points", points);
  }, [points]);

  // const pointsByDifficulty = {
  //   Easy: 1,
  //   Medium: 3,
  //   Hard: 5,
  // };
    // const earned =
    //   pointsByDifficulty[
    //     problem.difficulty
    //   ] || 1;

    // setPoints((prev) => prev + earned);

  // filter problems
  const filteredProblems = problems.filter((problem) =>
    (
      problem.problem ||
      problem.questionText ||
      ""
    )
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // group by category -> subcategory
  const groupedProblems = filteredProblems.reduce(
    (acc, problem) => {
      const category =
        problem.category || "Other";

      const subcategory =
        problem.subcategory || "General";

      if (!acc[category]) {
        acc[category] = {};
      }

      if (!acc[category][subcategory]) {
        acc[category][subcategory] = [];
      }

      acc[category][subcategory].push(problem);

      return acc;
    },
    {}
  );

  return (
    <>
    <div className="page">
      <div className="card">
        <div className="points-bar">
          ⭐ Points: {points}
        </div>
        <h1 className="under-dev">THIS IS UNDER DEVELOPMENT</h1>
        <h1 className="heading">
          DSA Problems
        </h1>

        <input
          type="text"
          placeholder="Search problems..."
          className="search-bar"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        {Object.keys(groupedProblems).map(
          (category) => (
            <div
              key={category}
              className="topic-section"
            >
              <h2 className="topic-heading">
                {category}
              </h2>

              {Object.keys(
                groupedProblems[category]
              ).map((subcategory) => (
                <div
                  key={subcategory}
                  className="category-section"
                >
                  <div
                    className="category-header"
                    onClick={() =>
                      setOpenCategories(
                        (prev) => ({
                          ...prev,
                          [`${category}-${subcategory}`]:
                            !prev[
                              `${category}-${subcategory}`
                            ],
                        })
                      )
                    }
                  >
                    <h3 className="category-heading">
                      {subcategory}
                    </h3>

                    <span className="category-arrow">
                      {openCategories[
                        `${category}-${subcategory}`
                      ]
                        ? "−"
                        : "+"}
                    </span>
                  </div>

                  {openCategories[
                    `${category}-${subcategory}`
                  ] && (
                    <div className="category-content">
                      {groupedProblems[
                        category
                      ][subcategory].map(
                        (problem, index) => (
                          <div
                            key={index}
                            className="problem-card"
                          >
                            <div
                              className="problem-header"
                              onClick={() =>
                                setOpenProblem(
                                  openProblem ===
                                    `${category}-${subcategory}-${index}`
                                    ? null
                                    : `${category}-${subcategory}-${index}`
                                )
                              }
                            >
                              <div className="problem-left">
                                <span className="number">
                                  {index + 1}
                                </span>

                                <div className="title-row">
                                  <div className="problem-title">
                                    {
                                      problem.problem
                                    }
                                  </div>

                                  {problem.difficulty && (
                                    <span
                                      className={`difficulty-chip ${problem.difficulty.toLowerCase()}`}
                                    >
                                      {
                                        problem.difficulty
                                      }
                                    </span>
                                  )}
                                </div>
                              </div>

                              <span className="arrow">
                                {openProblem ===
                                `${category}-${subcategory}-${index}`
                                  ? "−"
                                  : "+"}
                              </span>
                            </div>

                            {openProblem ===
                              `${category}-${subcategory}-${index}` && (
                              <div className="problem-content">
                                <div className="concept-section">
                                  <h4>
                                    Problem :- {problem.questionText || "No question available"}
                                  </h4>
                                </div>

                                <div className="concept-section">
                                  <h4>
                                    Input :- {problem.input || "N/A"}
                                  </h4>
                                </div>

                                <div className="concept-section">
                                  <h4>
                                    Output :- {problem.output ||"N/A"}
                                  </h4>
                                </div>

                                <div className="explanation-section">
                                  <div className="explanation-header">
                                    💡 Explanation :- 
                                  </div>

                                  <div className="markdown-content">
                                    <ReactMarkdown>
                                      {problem.explanation ||
                                        "No explanation available"}
                                    </ReactMarkdown>
                                  </div>
                                </div>

                                <div className="code-section">
                                  <h4>Code</h4>

                                  <pre className="code-block">
                                    <code>
                                      {problem.codeSnippet ||
                                        "No code available"}
                                    </code>
                                  </pre>
                                </div>

                                <div className="complexity-container">
                                  <div className="complexity-box">
                                    <span className="complexity-label">
                                      Time Complexity
                                    </span>

                                    <span className="complexity-value">
                                      {problem.timeComplexity || "N/A"}
                                    </span>
                                  </div>

                                  <div className="complexity-box">
                                    <span className="complexity-label">
                                      Space Complexity
                                    </span>

                                    <span className="complexity-value">
                                      {problem.spaceComplexity || "N/A"}
                                    </span>
                                  </div>

                                  {problem.repoUrl && (
                                    <a
                                      href={problem.repoUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="github-link"
                                    >
                                      View Code
                                    </a>
                                  )}
                                </div>

                                <div className="complexity-explanation-container">
                                  <div className="complexity-explanation-box">
                                    <h4>Time Complexity Explanation :- </h4>

                                    <p>
                                      {problem.timeComplexityExplanation ||
                                        "No explanation available"}
                                    </p>
                                  </div>

                                  <div className="complexity-explanation-box">
                                    <h4>Space Complexity Explanation :- </h4>

                                    <p>
                                      {problem.spaceComplexityExplanation ||
                                        "No explanation available"}
                                    </p>
                                  </div>
                                </div>

                                {problem.leetcodeUrl && (
                                  <div
                                    style={{
                                      marginTop:
                                        "16px",
                                    }}
                                  >
                                    <a
                                      href={
                                        problem.leetcodeUrl
                                      }
                                      target="_blank"
                                      rel="noreferrer"
                                      className="github-link"
                                    >
                                      Open in
                                      LeetCode
                                    </a>
                                  </div>
                                )}

                                <button
                                  className="solve-btn"
                                  disabled={solvedProblems[problem.problem]}
                                  onClick={() => {
                                    setPoints((prev) => prev + 1);

                                    const updated = {
                                      ...solvedProblems,
                                      [problem.problem]: true,
                                    };

                                    setSolvedProblems(updated);

                                    localStorage.setItem(
                                      "solvedProblems",
                                      JSON.stringify(updated)
                                    );
                                  }}
                                >
                                  {solvedProblems[problem.problem]
                                    ? "✅ Solved"
                                    : "Mark as Solved (+1 Point)"}
                                </button>

                                <div className="editor-section">
                                  <h4>💻 Solve It Yourself</h4>

                                  <Editor
                                    height="400px"
                                    defaultLanguage="java"
                                    value={code}
                                    onChange={(value) => setCode(value)}
                                  />
                                </div>

{/* 
                                {problem.patternGame && (
                                  <div className="pattern-game">
                                    <h4>🎯 Pattern Recognition</h4>

                                    {(() => {
                                      const current =
                                        patternStep[problem.problem] || 0;

                                      const steps =
                                        problem.patternGame.steps;

                                      const step = steps[current];

                                      if (!step) {
                                        return (
                                          <div className="success-box">
                                            🎉 Pattern Identified!

                                            <div>
                                              Backtracking →
                                              Decision Tree →
                                              Recursion
                                            </div>
                                          </div>
                                        );
                                      }

                                      return (
                                        <>
                                          <div className="question-box">
                                            {step.question}
                                          </div>

                                          <div className="options-container">
                                            {step.options.map((option) => (
                                              <button
                                                key={option}
                                                className="option-btn"
                                                onClick={() => {
                                                  if (
                                                    option === step.correct
                                                  ) {
                                                    setFeedback((prev) => ({
                                                      ...prev,
                                                      [problem.problem]:
                                                        "correct",
                                                    }));

                                                    setTimeout(() => {
                                                      setPatternStep(
                                                        (prev) => ({
                                                          ...prev,
                                                          [problem.problem]:
                                                            current + 1,
                                                        })
                                                      );

                                                      setFeedback(
                                                        (prev) => ({
                                                          ...prev,
                                                          [problem.problem]:
                                                            "",
                                                        })
                                                      );
                                                    }, 800);
                                                  } else {
                                                    setFeedback((prev) => ({
                                                      ...prev,
                                                      [problem.problem]:
                                                        "wrong",
                                                    }));
                                                  }
                                                }}
                                              >
                                                {option}
                                              </button>
                                            ))}
                                          </div>

                                          {feedback[
                                            problem.problem
                                          ] === "correct" && (
                                            <div className="correct-msg">
                                              ✅ Correct
                                            </div>
                                          )}

                                          {feedback[
                                            problem.problem
                                          ] === "wrong" && (
                                            <div className="wrong-msg">
                                              ❌ Try Again
                                            </div>
                                          )}
                                        </>
                                      );
                                    })()}
                                  </div>
                                )}

                                {problem.thinkingProcess && (
                                  <div className="thinking-section">
                                    <h4>🧠 How a Strong Candidate Thinks</h4>

                                    {problem.thinkingProcess
                                      .slice(
                                        0,
                                        (thinkingStep[problem.problem] || 0) + 1
                                      )
                                      .map((step, idx) => (
                                        <div
                                          key={idx}
                                          className={`thinking-card ${step.type}`}
                                        >
                                          {step.type === "wrong" && "❌ "}
                                          {step.type === "insight" && "💡 "}
                                          {step.type === "aha" && "🚀 "}

                                          {step.thought}
                                        </div>
                                      ))}

                                    {(thinkingStep[problem.problem] || 0) <
                                      problem.thinkingProcess.length - 1 && (
                                      <button
                                        className="thinking-btn"
                                        onClick={() =>
                                          setThinkingStep((prev) => ({
                                            ...prev,
                                            [problem.problem]:
                                              (prev[problem.problem] || 0) + 1,
                                          }))
                                        }
                                      >
                                        Show Next Thought →
                                      </button>
                                    )}
                                  </div>
                                )}
 */}

                              </div>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
    <Analytics/>
    </>
  );
}

export default App;