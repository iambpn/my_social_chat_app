import { atom, selector } from "recoil";

const AuthInfoState = atom({
    key: "auth_authInfoState",
    default: {
        userInfo: {},
        isAuthenticated: false
    },
    effects: [
        async ({ setSelf, resetSelf }) => {
            try {
                const res = await fetch("/user-info");
                const data = await res.json();
                setSelf({
                    userInfo: data.userInfo,
                    isAuthenticated: true
                });
            }
            catch (error) {
                //display error
                console.error(error);
                resetSelf();
            }
        }
    ]
})
