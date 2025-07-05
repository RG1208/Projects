import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="m-10">
      <h1 className="mb-10">Home Page</h1>
      <div className="">
      <button className="bg-blue-500 rounded px-2 m-1" onClick={() => navigate("/login")}>Login</button>
      </div>
      <div>
      <button className="bg-blue-500 rounded px-2 m-1" onClick={() => navigate("/register")}>Register</button>
      </div>
    </div>
  );
}