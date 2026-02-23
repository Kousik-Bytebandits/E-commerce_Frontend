import { useAuth } from "../context/AuthContext";

const SignIn = ({ switchView }) => {
  const { login } = useAuth();

  const handleLogin = () => {
    // MOCK LOGIN
    login({
      name: "John Doe",
      email: "john@example.com",
      image: "https://i.pravatar.cc/150",
    });
  };

  return (
    <>
      <h2>Sign In</h2>
      <input placeholder="Email" />
      <input placeholder="Password" type="password" />
      <button onClick={handleLogin}>Login</button>

      <button>Login with Google</button>

      <p onClick={() => switchView("forgot")}>Forgot password?</p>
      <p onClick={() => switchView("signup")}>Create account</p>
    </>
  );
};

export default SignIn;
