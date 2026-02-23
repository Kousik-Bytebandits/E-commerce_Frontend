const SignUp = ({ switchView }) => {
  return (
    <>
      <h2>Sign Up</h2>

      <input placeholder="Email" />
      <input placeholder="Username" />
      <input placeholder="Password" type="password" />

      <h4>Profile</h4>
      <input placeholder="First Name" />
      <input placeholder="Last Name" />
      <input placeholder="Phone" />

      <h4>Address</h4>
      <input placeholder="Address Line 1" />
       <input placeholder="Address Line 2" />
      <input placeholder="City" />
      <input placeholder="Postal Code" />

      <button onClick={() => switchView("otp")}>Sign Up</button>

      <button>Sign up with Google</button>

      <p onClick={() => switchView("signin")}>Already have an account?</p>
    </>
  );
};

export default SignUp;
