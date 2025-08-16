import React, { useState } from "react";
import { useSearchParams } from "next/navigation";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [params] = useSearchParams();
  const token = params.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password })
    });
    const data = await res.json();
    setMsg(data.message);
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New Password" required />
        <button type="submit">Update Password</button>
      </form>
      <p>{msg}</p>
    </div>
  );
}
export default ResetPassword;