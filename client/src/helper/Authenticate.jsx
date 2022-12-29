import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { AuthInfoState } from "../store/authStore";

export function Authenticate({ children, ...rest }) {
  const authInfo = useRecoilValue(AuthInfoState);
  const navigate = useNavigate();

  useEffect(()=>{
    if(!authInfo.isAuthenticated){
      navigate("/login")
    }
  },[])

  return <>{children}</>
}
