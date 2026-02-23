const ForgotPassword = ({ switchView }) => {
  return (
    <>
      <h2>Reset Password</h2>
      <input placeholder="Email" />
      <button>Send Reset Mail</button>

      <p onClick={() => switchView("signin")}>Back to login</p>
    </>
  );
};

export default ForgotPassword;
