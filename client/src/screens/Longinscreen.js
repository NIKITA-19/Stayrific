import React, {useState,useEffect} from 'react'
import axios from 'axios';
import Error from '../components/Error';
import Loader from '../components/Loader';

function Longinscreen() {
    const[email, setemail] =useState('');
    const[password, setpassword]=useState('');

    const [isloading, setisloading] = useState();
    const [haserror, sethaserror] = useState();

    async function login(){
            const user={
                email,
                password,
            }
            try{
                setisloading(true);
                const result = (await axios.post('/api/users/login', user)).data
                console.log("User Login Succcessfully")
                setisloading(false);

                localStorage.setItem('currentUser', JSON.stringify(result));
                window.location.href="/home"
            }catch(error){
                console.log(error);
                setisloading(false);
                sethaserror(true);
                
            }
    }
    return (
        <div>
            {isloading && <Loader/>}
            <div className="row justify-content-center" style={{margin:'90px'}}>
                <div className="col-md-5 bs">
                    <div>
                        <h2>Login</h2>
                        <input type="text" className='form-control' placeholder='Email'
                        value={email} onChange={(e)=>{setemail(e.target.value)}}/>
                        <input type="text" className='form-control' placeholder='Password'
                        value={password} onChange={(e)=>{setpassword(e.target.value)}}/>
                        <button className='btn btn-primary mt-3' onClick={login}>Login</button>
                    </div>
                    {haserror && (<Error message={"Invalid Credentials"} />)}
                </div>
            </div>
        </div>
    )
}

export default Longinscreen
