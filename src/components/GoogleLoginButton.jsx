import { useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { FcGoogle } from "react-icons/fc";

const GoogleLoginButton = () => {
  const { setShowModal } = useAuth();

  useEffect(() => {
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id:
        "3056590140-6pdu8r2691opggq3fgh314h4oppk2qa0.apps.googleusercontent.com",
      callback: handleCallback,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("googleButton"),
      {
        theme: "outline",
        size: "large",
        width: "100%",
      }
    );
  }, []);

  const handleCallback = async (response) => {
    try {
      const res = await api.post("/auth/google", {
        credential: response.credential,
      });

      const { accessToken, refreshToken } = res.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      window.location.reload();
    } catch (error) {
      alert("Google login failed");
    }
  };

  return (
    <div className="w-full">
      {/* Wrapper to match shadcn UI */}
      <div className="w-full rounded-md px-3 py-2">
        <div
          id="googleButton"
          className="flex w-full justify-center"
        />
      </div>
    </div>
  );
};

export default GoogleLoginButton;
