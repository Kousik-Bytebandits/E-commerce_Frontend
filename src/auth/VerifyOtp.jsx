import { useAuth } from "../context/AuthContext";

const VerifyOtp = () => {
  const { login } = useAuth();

  const verify = () => {
    login({
      name: "New User",
      email: "new@example.com",
      image: "https://i.pravatar.cc/150",
    });
  };

  return (
    <>
      <h2>Email Verification</h2>
      <input placeholder="Enter OTP" />
      <button onClick={verify}>Verify</button>
    </>
  );
};

export default VerifyOtp;
