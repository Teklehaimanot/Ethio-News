import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { login } from "../state/auth/authSlice";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const basicUrl = process.env.REACT_APP_BACKEND_URL;
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const { data } = await axios.post(`${basicUrl}/user`, {
        name,
        email,
        password,
        confirmPassword,
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
      console.log(error);
      if (error.response) {
        setErrors(error.response.data.error);
        setIsLoading(false);
      } else {
        alert("Error setting up the request:", error.message);
      }
    }
  };
  console.log(name, email, password);
  return (
    <div className="w-1/2 mx-auto space-y-4">
      <div className="text-bold text-sm text-error mb-8">{errors}</div>
      <span className="text-bold text-3xl  text-primary mb-8">
        Create Account
      </span>
      <form className="flex flex-col space-y-7" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          className="p-4 border-2 placeholder-gray rounded"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
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
          value={password}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="p-4 border-2 placeholder-gray rounded"
          onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmPassword}
        />
        <input
          type="submit"
          value={!isLoading ? "Create Account" : ".... loading"}
          className="p-4  placeholder-gray rounded bg-primary text-secondary text-lg text-bold"
          disabled={isLoading}
        />
      </form>
      <div className="flex flex-row justify-between mx-3">
        <span className="text-bold text-xl">Have an Account?</span>
        <Link to="/auth">
          <span className="text-bold text-xl text-blue">Log in</span>
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
