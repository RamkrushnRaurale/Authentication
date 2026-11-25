import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000",
});

/* ================= REQUEST INTERCEPTOR ================= */

api.interceptors.request.use(
    (config) => {

        const accessToken =
            localStorage.getItem(
                "accessToken"
            );

        if (accessToken) {

            config.headers.Authorization =
                `Bearer ${accessToken}`;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);

/* ================= RESPONSE INTERCEPTOR ================= */

api.interceptors.response.use(

    (response) => response,

    async (error) => {

        const originalRequest =
            error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {

            originalRequest._retry = true;

            try {

                const refreshToken =
                    localStorage.getItem(
                        "refreshToken"
                    );

                if (!refreshToken) {

                    localStorage.clear();

                    window.location.href =
                        "/login";

                    return Promise.reject(
                        error
                    );
                }

                const response =
                    await axios.post(
                        "http://localhost:5000/refresh-token",
                        {
                            refreshToken,
                        }
                    );

                const newAccessToken =
                    response.data.accessToken;

                localStorage.setItem(
                    "accessToken",
                    newAccessToken
                );

                originalRequest.headers.Authorization =
                    `Bearer ${newAccessToken}`;

                return api(
                    originalRequest
                );

            } catch (refreshError) {

                localStorage.clear();

                window.location.href =
                    "/login";

                return Promise.reject(
                    refreshError
                );
            }
        }

        return Promise.reject(error);
    }
);

export default api;