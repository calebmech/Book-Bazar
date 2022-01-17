import axios from 'axios';
export const axiosRequest = async (endpoint: string) => {
    try {
        const response = await axios(endpoint);
        return response.data;
    } catch (err) {
        console.error(err);
        return null;
    }
};
