import { useRouter } from "next/navigation";
import { Profile } from "@/app/profile/page";
import React from "react";
import { loadProfile } from "./load-profile";



export const useAuthorize = () => {
    const router = useRouter();
    const [auth, setAuth] = React.useState(false);
    const [user, setUser] = React.useState(null);
    const [token, setToken] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
            setAuth(true);
        }
        else{ 
            setAuth(false);
        }

        setLoading(false);
    }, []);


    return {
        auth,
        user,
        token,
        loading,
    };
}



