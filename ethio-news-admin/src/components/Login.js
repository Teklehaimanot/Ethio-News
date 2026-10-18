import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../state/auth/authSlice";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const basicUrl = process.env.REACT_APP_BACKEND_URL;
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const { data } = await axios.post(`${basicUrl}/user/login`, {
        email,
        password,
      });
      if (data) {
        const { user, token } = data;
        const jsonUser = JSON.stringify(data);
        localStorage.setItem("token", jsonUser);
        setErrors(false);
        setIsLoading(false);
        dispatch(login({ user, token }));
        navigate("/");
      }
    } catch (error) {
      if (error.response) {
        setErrors(error.response.data.error);
        setIsLoading(false);
      } else {
        alert("Error setting up the request:", error.message);
      }
    }
  };
  return (
    <div className="w-1/2 mx-auto space-y-4">
      <div className="text-bold text-sm text-error mb-8">{errors}</div>
      <span className="text-bold text-3xl text-primary mb-8">Login</span>
      <form className="flex flex-col space-y-7" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          className="p-4 border-2 placeholder-gray rounded"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <input
          type="password"
          placeholder="Password"
          className="p-4 border-2 placeholder-gray rounded"
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="submit"
          value={!isLoading ? "Log In" : ".... loading"}
          className="p-4  placeholder-gray rounded bg-primary text-secondary text-lg text-bold"
          disabled={isLoading}
        />
      </form>
      {/* <div className="flex flex-row justify-between mx-3">
        <span className="text-bold text-xl">New user?</span>
        <Link to="/auth/signup">
          <span className="text-bold text-xl text-blue">Create an account</span>
        </Link>
      </div> */}
    </div>
  );
};

export default Login;
