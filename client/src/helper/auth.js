import { useRecoilValue } from "recoil";
import { AuthInfoState } from "../store/authStore";

export const getAuthInfo = async () => {
    const authInfo = useRecoilValue(AuthInfoState);
    if (!authInfo.isAuthenticated) {
        try {
            const res = await fetch("/user-info");
            const data = await res.json();
            return {
                userInfo: data.userInfo,
                isAuthenticated: true
            };
        }
        catch (error) {
            //display error
            console.error(error)
        }
    }

    return {
        ...authInfo
    }

}