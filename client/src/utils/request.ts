/* eslint-disable @typescript-eslint/no-explicit-any */
import api, { fetchCsrfToken } from "@/api/api";
import { AxiosResponse } from "axios";

const request = async ({url, method = 'post', data, customHeaders, params}: {
    url: string,
    method?: string
    data?: any,
    customHeaders?: any
    params?: any
}): Promise<AxiosResponse<any>> => {
    const csrfToken = method.toLowerCase() !== 'get' ? await fetchCsrfToken() : undefined;
    const headers = {
        ...(csrfToken && {'X-CSRF-Token': csrfToken}),
        ...customHeaders,
    };

    try {
        const res = await api({
            url,
            method,
            data,
            headers,
            params
        });

        return res;
    } catch (error: any) {
        if (error.response?.status === 401) {
            try {
                const authCheckRes = await api.get('/auth/check');

                if (authCheckRes.data.valid) {
                    // Eğer authCheck başarılıysa, isteği tekrar yap ve sonucu dön
                    const retryRes = await api({
                        url,
                        method,
                        data,
                        headers,
                    });

                    return retryRes;
                } else {
                    // Eğer authCheck başarısızsa, hata fırlat
                    throw new Error("Authentication failed. Redirecting to home.");
                }
            } catch (authCheckError) {
                console.error('Auth check sırasında bir hata oluştu:', authCheckError);
                throw new Error("Authentication error during check. Redirecting to home.");
            }
        } else {
            throw error; // Diğer hataları fırlat
        }
    }
};

export default request;
