
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost/student_api/students.php";

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [course, setCourse] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchStudents = async () => {
    try {
      setError("");

      const response = await fetch(API_URL);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load students.");
      }

      setStudents(data.students);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, age, course }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Registration failed.");
      }

      setMessage("Student registered successfully!");
      setName("");
      setAge("");
      setCourse("");

      await fetchStudents();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app-container">

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">S</div>
          <div>
            <h2>STUDENT<span>HUB</span></h2>
            <p>Management System</p>
          </div>
        </div>

        <div className="sidebar-menu">
          <p className="menu-heading">MAIN MENU</p>

          <a href="#dashboard" className="menu-item active">
            <span>▦</span> Dashboard
          </a>

          <a href="#register" className="menu-item">
            <span>＋</span> Register Student
          </a>

          <a href="#students" className="menu-item">
            <span>♙</span> Students
          </a>
        </div>

        <div className="sidebar-bottom">
          <div className="admin-avatar">EG</div>
          <div>
            <strong>Administrator</strong>
            <p>System Manager</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content" id="dashboard">

        <header className="topbar">
          <div>
            <p className="breadcrumb">Pages / Dashboard</p>
            <h1>Student Dashboard</h1>
          </div>

          <div className="topbar-right">
            <span className="online-dot"></span>
            <span>System Online</span>
            <div className="profile-circle">EG</div>
          </div>
        </header>

        <section className="welcome-banner">
          <div>
            <p className="welcome-label">WELCOME BACK, ADMINISTRATOR</p>
            <h2>Manage Your Students</h2>
            <p>
              Organize student information, manage registrations,
              and monitor academic records in one place.
            </p>
          </div>
          <div className="banner-icon">🎓</div>
        </section>

        {/* Statistics */}
        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">♙</div>
            <div>
              <p>Total Students</p>
              <h2>{students.length}</h2>
              <span>Registered records</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">✓</div>
            <div>
              <p>System Status</p>
              <h2 className="status-text">Active</h2>
              <span>PHP and MySQL connected</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">⌕</div>
            <div>
              <p>Search Results</p>
              <h2>{filteredStudents.length}</h2>
              <span>Matching students</span>
            </div>
          </div>
        </section>

        <div className="content-grid">

          {/* Registration Form */}
          <section className="panel registration-panel" id="register">
            <div className="panel-heading">
              <div>
                <h2>Register New Student</h2>
                <p>Enter the student's information below.</p>
              </div>
              <div className="heading-icon">＋</div>
            </div>

            <form onSubmit={handleSubmit} className="student-form">

              <div className="form-group">
                <label htmlFor="studentName">Student Full Name</label>
                <input
                  id="studentName"
                  type="text"
                  placeholder="e.g. John Peter"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="studentAge">Student Age</label>
                <input
                  id="studentAge"
                  type="number"
                  placeholder="Enter student's age"
                  min="1"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="studentCourse">Course / Department</label>
                <input
                  id="studentCourse"
                  type="text"
                  placeholder="e.g. Software Development"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  required
                />
              </div>

              <button
                className="submit-btn"
                type="submit"
                disabled={submitting}
              >
                {submitting ? "Registering..." : "＋ Register Student"}
              </button>
            </form>

            {message && (
              <div className="alert success-alert">✓ {message}</div>
            )}

            {error && (
              <div className="alert error-alert">⚠ {error}</div>
            )}
          </section>

          {/* Information Card */}
          <section className="panel information-panel">
            <div className="info-decoration">✦</div>
            <div className="info-content">
              <div className="info-icon">🗂️</div>
              <h2>Student Records</h2>
              <p>
                All student information is stored securely in your
                MySQL database and retrieved through your PHP API.
              </p>

              <div className="connection-status">
                <span className="online-dot"></span>
                Database Connection Active
              </div>
            </div>
          </section>
        </div>

        {/* Student List */}
        <section className="panel students-panel" id="students">
          <div className="students-heading">
            <div>
              <h2>Registered Students</h2>
              <p>View and search all registered student records.</p>
            </div>

            <span className="record-count">
              {students.length} Records
            </span>
          </div>

          <div className="search-container">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Search by student name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="empty-state">Loading student records...</div>
          ) : filteredStudents.length === 0 ? (
            <div className="empty-state">
              <div>📂</div>
              <h3>No students found</h3>
              <p>Try another search or register a new student.</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="students-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>STUDENT NAME</th>
                    <th>AGE</th>
                    <th>COURSE</th>
                    <th>REGISTRATION DATE</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id}>
                      <td>#{student.id}</td>
                      <td>
                        <div className="student-name-cell">
                          <div className="student-avatar">
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                          <strong>{student.name}</strong>
                        </div>
                      </td>
                      <td>{student.age} years</td>
                      <td>
                        <span className="course-badge">
                          {student.course}
                        </span>
                      </td>
                      <td>
                        {student.created_at
                          ? student.created_at.split(" ")[0]
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer className="footer">
          <p>© 2026 <strong>ELIDYGRAM</strong>. All rights reserved.</p>
          <p>Student Registration Management System</p>
        </footer>

      </main>
    </div>
  );
}

export default App;
