import React from "react";

export default function Dashboard({ username }) {
  return (
    <div className="dashboard-welcome" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
      <h2>Welcome student, {username}!</h2>
    </div>
  );
} 