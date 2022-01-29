import React from 'react'
import HashLoader from "react-spinners/HashLoader";
import {useState, useEffect} from 'react'
function Loader() {
    let [loading, setLoading] = useState(true);
    let [color, setColor] = useState("#ffffff");
    return (
        <div className="sweet-loading text-center">
            <HashLoader color='#000' loading={loading} size={80} />
        </div>
    )
}

export default Loader;
