import React ,{ useContext } from "react";
import UserContext from "../Contexts/UserContext";

export default function Profile(){
    const { user } = useContext(UserContext);

    if (!user) {
        return <div>Please Login to continue</div>;
    }

    return (
        <div>
            <h1>Profile</h1>
            <div>Welcome {user.username}</div>
        </div>
    );
}
