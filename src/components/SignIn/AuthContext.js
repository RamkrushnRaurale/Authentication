import {
    createContext,
    useState,
    useContext,
    useEffect,
} from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({
    children,
}) => {

    const [user, setUser] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    /* ================= AUTO LOGIN ================= */

    useEffect(() => {

        const storedUser =
            localStorage.getItem(
                "user"
            );

        const accessToken =
            localStorage.getItem(
                "accessToken"
            );

        if (
            storedUser &&
            accessToken
        ) {

            setUser(
                JSON.parse(
                    storedUser
                )
            );
        }

        setLoading(false);

    }, []);

    /* ================= LOGIN ================= */

    const login = (
        accessToken,
        refreshToken,
        userData
    ) => {

        localStorage.setItem(
            "accessToken",
            accessToken
        );

        localStorage.setItem(
            "refreshToken",
            refreshToken
        );

        localStorage.setItem(
            "user",
            JSON.stringify(
                userData
            )
        );

        setUser(userData);

        console.log(
            "✅ Login Success"
        );
    };

    /* ================= LOGOUT ================= */

    const logout = () => {

        localStorage.removeItem(
            "accessToken"
        );

        localStorage.removeItem(
            "refreshToken"
        );

        localStorage.removeItem(
            "user"
        );

        setUser(null);

        console.log(
            "✅ Logout Success"
        );
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () =>
    useContext(AuthContext);