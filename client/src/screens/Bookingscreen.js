import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import Error from '../components/Error';
import Loader from '../components/Loader';
import moment from 'moment';
import StripeCheckout from 'react-stripe-checkout';
import Saal from 'sweetalert2'
import AOS from 'aos';
import 'aos/dist/aos.css'; // You can also use <link> for styles
// ..
AOS.init({
    duration:500
});
function Bookingscreen() {
    const { _id, fromdate, todate } = useParams();
    const [isloading, setisloading] = useState(true);
    const [haserror, sethaserror] = useState();
    const [room, setroom] = useState(_id);

    const checkin = moment(fromdate,'DD-MM-YYYY');
    const checkout = moment(todate,'DD-MM-YYYY');
    console.log(checkin);
    const totaldays = moment.duration(checkout.diff(checkin)).asDays() + 1;
    useEffect(() => {
        if(!localStorage.getItem('currentUser')){
           window.location.href="/login"; 
        }
        const fetchData = async () => {
            setisloading(true);
            sethaserror(false);
            try {
                const data = (await axios.post('/api/rooms/getroombyid', { roomid: _id })).data;
                setroom(data.room);
            } catch (error) {
                console.log(error);
                sethaserror(true);
            }
            setisloading(false);
        };
        fetchData();
    }, [setroom])
    const totalamount = totaldays * room.rentperday;
    async function onToken(token) {
        console.log(token)
        const bookingDetails = {
            room,
            userid: JSON.parse(localStorage.getItem('currentUser'))._id,
            fromdate,
            todate,
            totalamount,
            totaldays,
            token
        };

        try {
            setisloading(true);
            const result = await axios.post('/api/bookings/bookroom', bookingDetails);
            setisloading(false);
            Saal.fire("Congratulations", "Your Room Booked Successfully, Enjoy your stay!",'success').then(result=>{
                window.location.href='/profile';
            });
            
        }
        catch (error) {
            setisloading(false);
            Saal.fire("Oops", "Something went wrong", "error");
        }
    }
    return (
        <div className='m-5' data-aos='flip-left'>
            {isloading ? (
                <h1><Loader /></h1>
            ) : room ? (
                <div >
                    <div className="row justify-content-center mt-5 bs">
                        <div className='col-md-7'>
                            <h1> {room.name}</h1>
                            <img src={room.imageurls[0]} className='bigimg'/>
                        </div>
                        <div className='col-md-5' style={{float:'right'}}>
                            <div  style={{textAlign: 'right'}}>
                                <h1>BOOKING DETAILS</h1>
                                <hr />
                                <b>
                                    <p>Name : {JSON.parse(localStorage.getItem('currentUser')).name}</p>
                                    <p>From Date: {todate}</p>
                                    <p>To Date:{fromdate}</p>
                                    <p>Max Count: {room.maxcount}</p>
                                </b>
                            </div>
                            <div style={{textAlign: 'right'}}>
                                <b>
                                    <h1>Amount</h1>
                                    <hr />
                                    <p>Total Days:{totaldays}</p>
                                    <p>Rent Per Day:{room.rentperday}</p>
                                    <p>Total Amount: {totalamount}</p>
                                </b>
                            </div>
                            <div style={{ float: 'right' }}>
                                <StripeCheckout 
                                amount={totalamount*100}
                                token={onToken}
                                currency='INR'
                                stripeKey='pk_test_51KJXiVSG1JZ4QPtfmMmqsaUCwd88mn9Ao3doGRAMamDAJbY6Hjblp7iWelaz86NLUCDvmDLJt2inJNYloPzYlCAb00K7r1pkLn'
                                >
                                
                                <button className='btn btn-primary'>Pay Now{" "}</button>
                                </StripeCheckout>
                            </div>
                        </div>
                    </div>
                </div>) : (<Error message="Something went wrong, please try again later!" />)
            }
        </div>
    )
}
export default Bookingscreen;
