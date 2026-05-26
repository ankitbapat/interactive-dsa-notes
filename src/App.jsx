import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import "./App.css";

function App() {
  const [problems, setProblems] = useState([]);
  const [search, setSearch] = useState("");
  const [openProblem, setOpenProblem] = useState(null);
  const [openCategories, setOpenCategories] = useState({});

  useEffect(() => {
    fetch("/data/questions_final.json")
      .then((response) => response.json())
      .then((data) => setProblems(data));
  }, []);

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
    <div className="page">
      <div className="card">
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
                                    Problem
                                  </h4>

                                  <p>
                                    {problem.questionText ||
                                      "No question available"}
                                  </p>
                                </div>

                                <div className="concept-section">
                                  <h4>
                                    Input
                                  </h4>

                                  <p>
                                    {problem.input ||
                                      "N/A"}
                                  </p>
                                </div>

                                <div className="concept-section">
                                  <h4>
                                    Output
                                  </h4>

                                  <p>
                                    {problem.output ||
                                      "N/A"}
                                  </p>
                                </div>

                                <div className="concept-section">
                                  <h4>Explanation</h4>

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
                                    <h4>Time Complexity Explanation</h4>

                                    <p>
                                      {problem.timeComplexityExplanation ||
                                        "No explanation available"}
                                    </p>
                                  </div>

                                  <div className="complexity-explanation-box">
                                    <h4>Space Complexity Explanation</h4>

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
  );
}

export default App;