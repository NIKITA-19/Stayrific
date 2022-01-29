import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import axios from 'axios';
import Error from '../components/Error';
import Loader from '../components/Loader'; 
import Saal from 'sweetalert2';
import { Tag } from 'antd';
const { TabPane } = Tabs;


const { CheckableTag } = Tag;

function Profilescreen() {
    const user = JSON.parse(localStorage.getItem("currentUser"));

    useEffect(() => {
        if (!user) {
            window.location.href = '/login'
        }
    }, []);

    return <div className='ml-3 mt-3'>
        <Tabs defaultActiveKey="1">
            <TabPane tab="Profile" key="1">
                <h1>My Profile</h1>
                <br />
                <h1>Name: {user.name}</h1>
                <h1>Email: {user.email}</h1>
                <h1>isAdmin: {user.isAdmin ? "Yes" : "No"}</h1>
            </TabPane>
            <TabPane tab="Bookings" key="2">
                <MyBookings />
            </TabPane>
        </Tabs>
    </div>;
}

export default Profilescreen;


export function MyBookings() {

    const user = JSON.parse(localStorage.getItem("currentUser"));
    const [isloading, setisloading] = useState(false);
    const [haserror, sethaserror] = useState();
    const [bookings, setbookings]= useState([])
    useEffect(async() => {
     
        try {
            setisloading(true);
            const room= (await 
                 axios.post('/api/bookings/getbookingsbyuserid', {userid:user._id})
                 ).data;
                 console.log(room);
                 setbookings(room);
                 setisloading(false);
        } catch (error) {
            console.log(error);
            setisloading(false);
            sethaserror(error);
        }
    }, []);
    async function cancelBooking(bookingid, roomid) {
        try{
            setisloading(true);
            const result = await (await axios.post("/api/bookings/cancelbooking", {bookingid, roomid})).data;
            setisloading(false);
            console.log(result);
            Saal.fire('Congrats', 'Your booking has been cancelled :(','success').then(result=>{
                window.location.reload()
            })
        }catch(error){
            console.log(error);
            setisloading(false);
            Saal.fire('Oops', 'Something went wrong','error'); 
        }
        
    }
    return <div>
        <div className="row">
            <div className="col-md-6">
                {isloading && (<Loader/>)}
                {bookings && (bookings.map(booking=>{
                    return (
                        <div className='bs'>
                            <h1>{booking.room}</h1>
                            <p>Booking Id: {booking._id}</p>
                            <p><b>CheckIn: {booking.fromdate}</b></p>
                            <p><b>CheckOut: {booking.todate}</b></p>
                            <p><b>Amount: {booking.totalamount}</b></p>
                            <p><b>Status: </b>{booking.status=='cancelled' ? (<Tag color="red">CANCELLED</Tag>):(<Tag color="green">CONFIRMED</Tag>)}</p>
                            
                            {booking.status!== 'cancelled' && (
                                <div className='text-right'>
                                <button className='btn btn-primary' onClick={()=>{cancelBooking(booking._id,booking.roomid)}}>CANCEL BOOKING</button>
                            </div>
                            )}
                            

                        </div>
                    )
                }))}
            </div>
        </div>
    </div>;
}


