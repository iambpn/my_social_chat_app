import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { AuthInfoState } from "../store/authStore";

export function ProtectedRoute({ children, isAuthenticated = true, ...rest }) {
  const authInfo = useRecoilValue(AuthInfoState);
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated && !authInfo.isAuthenticated) {
      navigate("/login");
    } else if (!isAuthenticated && authInfo.isAuthenticated) {
      navigate("/conversation");
    }
  }, [authInfo]);

  return <>{children}</>;
}
