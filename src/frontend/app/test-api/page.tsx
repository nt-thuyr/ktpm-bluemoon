"use client";

import { useEffect, useState } from "react";

export default function Page() {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/households")
            .then(res => res.json())
            .then(setData);
    }, []);

    return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
