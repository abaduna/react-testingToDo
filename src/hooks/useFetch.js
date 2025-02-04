import { useState, useEffect } from 'react';
import axios from 'axios';

export const useFetch = (initialUrl = '', initialMethod = 'GET', initialBody = null) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchData = async (url = initialUrl, method = initialMethod, bodyData = initialBody) => {
        setLoading(true);
        console.log('Fetching data from:', url);
        try {
            const config = {
                method,
                url,
                data: bodyData,
            };
            const response = await axios(config);
            setData(response.data);
            setError(null);
            return response.data;
        } catch (err) {
            setError(err);
            setData(null);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (initialUrl) {
            fetchData(initialUrl, initialMethod, initialBody);
        }
    }, [initialUrl, initialMethod, initialBody]);

    return { data, error, loading, fetchData };
};