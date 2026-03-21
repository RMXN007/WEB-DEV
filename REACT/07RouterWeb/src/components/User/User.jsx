import React from "react";
import { useParams } from "react-router-dom";
export default function User() {
    const { userid } = useParams();
    return(
        <div>
            <h1 className="text-3xl font-bold text-center mt-10">User {userid}</h1>
        </div>
    )
}