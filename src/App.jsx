import { useMemo, useState } from "react";
import "./App.css";

const STORAGE_KEY = "caline_students";

function readStudents() {
  const savedStudents = window.localStorage.getItem(STORAGE_KEY);
  const students = savedStudents ? JSON.parse(savedStudents) : [];

  if (
    !Array.isArray(students) ||
    students.some(
      (student) =>
        !student ||
        (typeof student.id !== "string" &&
          typeof student.id !== "number") ||
        typeof student.name !== "string" ||
        typeof student.age !== "number" ||
        typeof student.course !== "string"
    )
  ) {
    throw new Error("Saved student data is invalid.");
  }

  return students;
}

function getInitialData() {
  try {
    return { students: readStudents(), error: "" };
  } catch (loadError) {
    console.error("Loading student records failed:", loadError);
    return {
      students: [],
      error: "Unable to load saved student records.",
    };
  }
}

function App() {
  const [initialData] = useState(getInitialData);
  const [page, setPage] = useState("home");
  const [students, setStudents] = useState(initialData.students);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    course: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(initialData.error);
  const [successMessage, setSuccessMessage] = useState("");

  const filteredStudents = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return students.filter((student) =>
      student.name.toLowerCase().includes(query)
    );
  }, [searchTerm, students]);

  const navigateTo = (nextPage) => {
    setPage(nextPage);
    setError("");
    setSuccessMessage("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({ ...currentData, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    const name = formData.name.trim();
    const age = Number(formData.age);
    const course = formData.course.trim();

    if (name.length < 2) {
      setError("Enter a student name with at least 2 characters.");
      return;
    }

    if (!Number.isInteger(age) || age < 1 || age > 120) {
      setError("Enter a valid age between 1 and 120.");
      return;
    }

    if (!course) {
      setError("Enter a course name.");
      return;
    }

    setIsSaving(true);

    try {
      const currentStudents = readStudents();
      const newStudent = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name,
        age,
        course,
      };
      const updatedStudents = [...currentStudents, newStudent];

      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedStudents)
      );
      setStudents(updatedStudents);
      setFormData({ name: "", age: "", course: "" });
      setSuccessMessage("Student registered successfully.");
      setPage("students");
    } catch (saveError) {
      console.error("Student registration failed:", saveError);
      setError("Unable to save the student. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (studentId) => {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }

    setError("");
    setSuccessMessage("");
    const updatedStudents = students.filter(
      (student) => student.id !== studentId
    );

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedStudents)
      );
      setStudents(updatedStudents);
      setSuccessMessage("Student deleted successfully.");
    } catch (deleteError) {
      console.error("Student deletion failed:", deleteError);
      setError("Unable to delete the student. Please try again.");
    }
  };

  return (
    <div className="app-container">
      <header className="navbar">
        <button
          className="navbar-brand"
          type="button"
          onClick={() => navigateTo("home")}
          aria-label="CALINEPRO home"
        >
          <span className="navbar-logo" aria-hidden="true">
            C
          </span>
          <span className="brand-text">
            <strong>CALINEPRO</strong>
            <small>STUDENT MANAGEMENT</small>
          </span>
        </button>

        <nav className="navbar-links" aria-label="Main navigation">
          <button
            className={`nav-link ${page === "home" ? "active" : ""}`}
            type="button"
            onClick={() => navigateTo("home")}
            aria-current={page === "home" ? "page" : undefined}
          >
            <span aria-hidden="true">⌂</span> Home
          </button>
          <button
            className={`nav-link ${page === "register" ? "active" : ""}`}
            type="button"
            onClick={() => navigateTo("register")}
            aria-current={page === "register" ? "page" : undefined}
          >
            <span aria-hidden="true">＋</span> Register
          </button>
          <button
            className={`nav-link ${page === "students" ? "active" : ""}`}
            type="button"
            onClick={() => navigateTo("students")}
            aria-current={page === "students" ? "page" : undefined}
          >
            <span aria-hidden="true">▤</span> Students
          </button>
        </nav>

        <button
          className="navbar-action"
          type="button"
          onClick={() => navigateTo("register")}
        >
          Get started <span aria-hidden="true">→</span>
        </button>
      </header>

      <div className="feedback-region" aria-live="polite">
        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}
        {successMessage && (
          <p className="success-message" role="status">
            {successMessage}
          </p>
        )}
      </div>

      {page === "home" && (
        <main className="home-page">
          <section className="hero-premium">
            <div className="hero-decoration decoration-one" aria-hidden="true" />
            <div className="hero-decoration decoration-two" aria-hidden="true" />

            <div className="hero-content">
              <div className="hero-label">
                <span className="hero-label-line" aria-hidden="true" />
                SMART STUDENT MANAGEMENT
              </div>
              <h1>
                Manage your
                <span>student records</span>
                with confidence.
              </h1>
              <p>
                CALINEPRO makes student registration simple. Keep records
                organized, find information quickly, and manage your student
                list in one place.
              </p>
              <div className="hero-actions">
                <button
                  className="hero-primary"
                  type="button"
                  onClick={() => navigateTo("register")}
                >
                  Register a student <span aria-hidden="true">→</span>
                </button>
                <button
                  className="hero-secondary"
                  type="button"
                  onClick={() => navigateTo("students")}
                >
                  View students
                </button>
              </div>
            </div>

            <div className="hero-stats" aria-label="System overview">
              <div className="hero-stat-card">
                <span className="hero-stat-icon" aria-hidden="true">
                  ♙
                </span>
                <div>
                  <small>Registered students</small>
                  <strong>{students.length}</strong>
                </div>
              </div>
              <div className="hero-stat-card">
                <span className="hero-stat-icon" aria-hidden="true">
                  ▣
                </span>
                <div>
                  <small>Registration system</small>
                  <strong>Ready</strong>
                </div>
              </div>
              <div className="hero-stat-card">
                <span className="hero-stat-icon success-icon" aria-hidden="true">
                  ✓
                </span>
                <div>
                  <small>System status</small>
                  <strong className="active-status">Active</strong>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      {page === "register" && (
        <main className="registration-page">
          <header className="registration-header">
            <span>CALINEPRO REGISTRATION</span>
            <h1>Register a student</h1>
            <p>Enter the student’s details to add a new record.</p>
          </header>

          <form className="registration-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="student-name">Student full name</label>
              <input
                autoComplete="name"
                id="student-name"
                maxLength={100}
                minLength={2}
                name="name"
                onChange={handleChange}
                placeholder="e.g. Alex Morgan"
                required
                value={formData.name}
              />
            </div>
            <div className="form-group">
              <label htmlFor="student-age">Age</label>
              <input
                id="student-age"
                inputMode="numeric"
                max={120}
                min={1}
                name="age"
                onChange={handleChange}
                placeholder="e.g. 18"
                required
                type="number"
                value={formData.age}
              />
            </div>
            <div className="form-group">
              <label htmlFor="student-course">Course</label>
              <input
                id="student-course"
                maxLength={100}
                name="course"
                onChange={handleChange}
                placeholder="e.g. Information Technology"
                required
                value={formData.course}
              />
            </div>
            <button
              className="submit-button"
              disabled={isSaving}
              type="submit"
            >
              {isSaving ? "Saving…" : "Register student"}
            </button>
            <button
              className="back-button"
              type="button"
              onClick={() => navigateTo("home")}
            >
              ← Back to home
            </button>
          </form>
        </main>
      )}

      {page === "students" && (
        <main className="students-page">
          <header className="students-header">
            <span>CALINEPRO DIRECTORY</span>
            <h1>Registered students</h1>
            <p>Search and manage the student records saved on this device.</p>
          </header>

          <section className="students-summary" aria-label="Student summary">
            <div>
              <span className="summary-label">Total students</span>
              <strong>{students.length}</strong>
            </div>
            <button
              className="summary-add-button"
              type="button"
              onClick={() => navigateTo("register")}
            >
              + Add student
            </button>
          </section>

          <div className="search-container">
            <label className="visually-hidden" htmlFor="student-search">
              Search students by name
            </label>
            <input
              id="student-search"
              type="search"
              placeholder="Search by student name..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          {filteredStudents.length > 0 ? (
            <div className="students-list" role="table" aria-label="Students">
              <div
                className="students-table"
                role="rowgroup"
              >
                <div className="student-row student-table-header" role="row">
                  <span role="columnheader">Student name</span>
                  <span role="columnheader">Age</span>
                  <span role="columnheader">Course</span>
                  <span role="columnheader">Action</span>
                </div>
                {filteredStudents.map((student) => (
                  <div className="student-row" key={student.id} role="row">
                    <span role="cell">{student.name}</span>
                    <span role="cell">{student.age}</span>
                    <span role="cell">{student.course}</span>
                    <span role="cell">
                      <button
                        className="delete-button"
                        type="button"
                        aria-label={`Delete ${student.name}`}
                        onClick={() => handleDelete(student.id)}
                      >
                        Delete
                      </button>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <section className="empty-state">
              <span className="empty-icon" aria-hidden="true">
                ♙
              </span>
              <h2>{searchTerm ? "No matching students" : "No students yet"}</h2>
              <p>
                {searchTerm
                  ? "Try another name or clear the search."
                  : "Register your first student to start building your directory."}
              </p>
              {!searchTerm && (
                <button
                  className="hero-primary"
                  type="button"
                  onClick={() => navigateTo("register")}
                >
                  Register a student <span aria-hidden="true">→</span>
                </button>
              )}
            </section>
          )}
        </main>
      )}

      <footer className="app-footer">
        <div className="footer-brand">
          <span className="footer-logo" aria-hidden="true">
            C
          </span>
          <strong>CALINEPRO</strong>
        </div>
        <p className="footer-description">
          A simple, organized way to manage student registrations.
        </p>
        <div className="footer-divider" />
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} CALINEPRO. All rights reserved.</p>
          <span>Student records are saved in this browser.</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
