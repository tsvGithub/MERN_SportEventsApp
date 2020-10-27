import React from "react";

//Dashboard shows all the events
const Dashboard = () => {
  const user_id = localStorage.getItem("user");

  console.log(user_id);
  return (
    <div>
      <h1>Dashboard Page</h1>
    </div>
  );
};

export default Dashboard;
