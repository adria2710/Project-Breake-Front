import "../styles/Dashboard.css";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Bienvenido al Dashboard</h1>

      {user && (
        <div className="dashboard-card">
          <h3>👤 Información del usuario</h3>
          <p><strong>Nombre:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Rol:</strong> {user.role}</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
