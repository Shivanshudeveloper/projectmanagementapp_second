import React from "react";

// ----------------------------------------------------------------------

const redirect = () => {
  window.location.href = "/auth/login-unprotected";
};

// ----------------------------------------------------------------------

export default function LandingPage() {
  return <>{redirect()}</>;
}
