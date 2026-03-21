import React ,{useEffect , useState} from "react";

export default function Github() {
    const [data, setData] = useState([]);
    useEffect(() => {
        fetch("https://api.github.com/users/RMXN007")
            .then((response) => response.json())
            .then((data) => setData(data));
    }, []);

    return (
        <div className='text-center m-4 bg-gray-600 text-white p-4 text-3xl'>
            Github followers: {data.followers}
            <br />
            Name : {data.name}
            <br />
            <img src={data.avatar_url} alt="Git picture" width={300} />
        </div>
    )
}