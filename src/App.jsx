import { useEffect, useState } from "react";
import "./App.css";


function App() {
  const [problems, setProblems] = useState([]);
  const [search, setSearch] = useState("");
  const [openProblem, setOpenProblem] = useState(null);

  useEffect(() => {
    fetch("/data/questions.json")
      .then((response) => response.json())
      .then((data) => setProblems(data));
  }, []);

  // filter problems
  const filteredProblems = problems.filter((problem) =>
    problem.question.toLowerCase().includes(search.toLowerCase())
  );

  // group by category -> topic
  const groupedProblems = filteredProblems.reduce((acc, problem) => {
    const category = problem.category || "Other";
    const topic = problem.topic || "General";

    if (!acc[category]) {
      acc[category] = {};
    }

    if (!acc[category][topic]) {
      acc[category][topic] = [];
    }

    acc[category][topic].push(problem);

    return acc;
  }, {});

  return (
    <div className="page">
      <div className="card">
        <h1 className="heading">DSA Problems</h1>

        <input
          type="text"
          placeholder="Search problems..."
          className="search-bar"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {Object.keys(groupedProblems).map((category) => (
          <div key={category} className="topic-section">
            <h2 className="topic-heading">{category}</h2>

            {Object.keys(groupedProblems[category]).map((topic) => (
              <div key={topic} className="category-section">
                <h3 className="category-heading">{topic}</h3>

                <ul className="list">
                  {groupedProblems[category][topic].map(
                    (problem, index) => (

                      <div key={index} className="problem-card">
                        <div className="problem-header"
                          onClick={() =>
                            setOpenProblem(
                              openProblem === `${category}-${topic}-${index}`
                                ? null
                                : `${category}-${topic}-${index}`
                            )}
                        >
                          <div className="problem-left">
                            <span className="number">{index + 1}</span>

                            <div className="title-row">
                              <div className="problem-title">
                                {problem.question}
                              </div>
                              <span
                                className={`difficulty-chip ${
                                  problem.difficulty?.toLowerCase() || ""
                                }`}
                              >
                                {problem.difficulty}
                              </span>
                            </div>
                          </div>

                          <span className="arrow">
                            {openProblem === `${category}-${topic}-${index}`
                              ? "−"
                              : "+"}
                          </span>

                        </div>

                        {openProblem === `${category}-${topic}-${index}` && (
                          <div className="problem-content">
                            
                            <div className="concept-section">
                              <h4>Concept</h4>

                              <p>
                                {problem.concept || "No concept available"}
                              </p>
                            </div>

                            <br></br>

                            <div className="code-section">
                              <h4>Code</h4>

                              <pre className="code-block">
                                <code>
                                  {problem.source || "No code available"}
                                </code>
                              </pre>
                            </div>

                            <br></br>

                            <div className="complexity-container">
                              <div className="complexity-box">
                                <span className="complexity-label">
                                  Time Complexity
                                </span>

                                <span className="complexity-value">
                                  {problem.time || "N/A"}
                                </span>
                              </div>

                              <div className="complexity-box">
                                <span className="complexity-label">
                                  Space Complexity
                                </span>

                                <span className="complexity-value">
                                  {problem.space || "N/A"}
                                </span>
                              </div>
                              <a
                                href={problem.repoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="github-link"
                              >
                                View Code
                              </a>
                            </div>

                          </div>
                        )}

                      </div>
                    )

                  )}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;