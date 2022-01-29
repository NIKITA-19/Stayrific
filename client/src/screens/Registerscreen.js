import React, {useState, useEffect} from 'react'
import axios from 'axios';
import Error from '../components/Error';
import Loader from '../components/Loader';
import Success from '../components/Success';


function Registerscreen() {
    const[name, setname] = useState('');
    const[email, setemail] =useState('');
    const[password, setpassword]=useState('');
    const[confirmpassword, setconfirmpassword] =useState('');

    const [isloading, setisloading] = useState();
    const [haserror, sethaserror] = useState();
    const [success, setsuccess] = useState();

    async function register(){
        if(password==confirmpassword)
        {
            const user={
                name,
                email,
                password,
                confirmpassword
            }
            try{
                setisloading(true);
                const result = await axios.post('/api/users/register', user).data
                setisloading(false);
                setsuccess(true);

                setname('');
                setemail('');
                setpassword('');
                setconfirmpassword('');
            }
            catch(error){
                console.log(error);
                setisloading(false);
                sethaserror(true);
            }
        }
        else
        {
            alert("Password and ConfirmPaasword should match")
        }
    }
    return (
        <div>
            {isloading && (<Loader/>)}
            {haserror && (<Error/>)}
            <div className="row justify-content-center mt-5 ">
                <div className="col-md-5 bs">
                    <div>
                    {success && (<Success message="User Registered Successfully"/>)}
                        <h2>Register</h2>
                        <input type="text" className='form-control' placeholder='Name'
                         value={name} onChange={(e)=>{setname(e.target.value)}}/>
                        <input type="text" className='form-control' placeholder='Email'
                        value={email} onChange={(e)=>{setemail(e.target.value)}}/>
                        <input type="text" className='form-control' placeholder='Password'
                        value={password} onChange={(e)=>{setpassword(e.target.value)}}/>
                        <input type="text" className='form-control' placeholder='Confirm Password'
                        value={confirmpassword} onChange={(e)=>{setconfirmpassword(e.target.value)}}/>

                        <button className='btn btn-primary mt-3' onClick={register}>Register</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Registerscreen
