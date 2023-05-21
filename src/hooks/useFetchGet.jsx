import axios from "axios";
import { useEffect } from "react";


export default function useFetchGet(url) {

    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {

        const fetch = async () => {
            try {

                setLoading(true);
                const response = await axios.get(url);

                setData(response.data)

            } catch (error) {
                setError(error);
            }
            finally {
                loading(false);
            }
        }

        fetch()

    }, [url])


    return [data, loading, error]

}
