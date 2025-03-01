export default function App() {
  return (
    <div className="container mt-5">
      {/* Header Section */}
      <header className="text-center mb-4">
        <h1 className="text-primary fw-bold">CyberWise Security Training Centre</h1>
        <p className="text-muted">Empower your learning today.</p>
      </header>

      {/* Hero Section */}
      <div className="row align-items-center">
        <div className="col-md-6">
          <h2 className="text-success">Why Cyber Security Learning?</h2>
          <p>Empower your staff and reduce your surface attack area.</p>
          <button className="btn btn-warning btn-lg">Get Started</button>
        </div>
        <div className="col-md-6 text-center">
          <img
            src="https://via.placeholder.com/400"
            alt="Illustration"
            className="img-fluid rounded"
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="row mt-5">
        <div className="col-md-4 text-center">
          <i className="bi bi-emoji-smile fs-1 text-primary"></i>
          <h3>Upcoming Content</h3>
          <p>Engaging All Learners.</p>
        </div>
        <div className="col-md-4 text-center">
          <i className="bi bi-lightning fs-1 text-warning"></i>
          <h3>Super Fast</h3>
          <p>New Content Monthly.</p>
        </div>
        <div className="col-md-4 text-center">
          <i className="bi bi-lock fs-1 text-danger"></i>
          <h3>Secure</h3>
          <p>Your data is always protected with high-end encryption.</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center mt-5">
        <p className="text-muted">&copy; 2025 Cyber Wise. All rights reserved.</p>
      </footer>
    </div>
  );
}
