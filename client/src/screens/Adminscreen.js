import { React, useState, useEffect } from 'react';
import { Tabs } from 'antd';
import axios from 'axios';
import Loader from '../components/Loader';
import Error from '../components/Error';
import Saal from 'sweetalert2'

const { TabPane } = Tabs;
function Adminscreen() {
    useEffect(() => {
        if (!JSON.parse(localStorage.getItem("currentUser")).isAdmin) {
            window.location.href = "/home";
        }
    }, []);

    return <div className='mt-3 ml-3 bs'>
        <h1 className='text-center'><b>ADMIN PANEL</b></h1>
        <Tabs defaultActiveKey="1">
            <TabPane tab="Bookings" key="1">
                <Bookings />
            </TabPane>
            <TabPane tab="Rooms" key="2">
                <Rooms />
            </TabPane>
            <TabPane tab="Add Room" key="3">
                <Addroom />
            </TabPane>
            <TabPane tab="Users" key="4">
                <Users />
            </TabPane>
        </Tabs>
    </div>;
}

export default Adminscreen;

export function Bookings() {

    const [bookings, setbookings] = useState([]);
    const [isloading, setisloading] = useState(true);
    const [haserror, sethaserror] = useState()
    useEffect(() => {
        const bookings = async () => {
            try {
                const data = await (await axios.get("/api/bookings/getallbookings")).data;
                setbookings(data);
                setisloading(false);
            } catch (error) {
                console.log(error);
                setisloading(false);
                sethaserror(haserror);
            }
        }
        bookings();
    }, []);

    return (
        <div className='row'>
            <div className="col-md-12">
                {isloading && (<Loader />)}
                <div className="responsive-table">
                <table className='table table-borderd table-dark'>
                    <thead className='bs'>
                        <tr>
                            <th>Booking Id</th>
                            <th>User Id</th>
                            <th>Room</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.length && (bookings.map(booking => {
                            return <tr>
                                <td>{booking._id}</td>
                                <td>{booking.userid}</td>
                                <td>{booking.room}</td>
                                <td>{booking.fromdate}</td>
                                <td>{booking.todate}</td>
                                <td>{booking.status}</td>
                            </tr>
                        }))}
                    </tbody>
                </table>
                </div>
            </div>
        </div>
    )

}

export function Rooms() {

    const [rooms, setrooms] = useState([]);
    const [isloading, setisloading] = useState(true);
    const [haserror, sethaserror] = useState()
    useEffect(() => {
        const roooms = async () => {
            try {
                const data = await (await axios.get("/api/rooms/getallrooms")).data;
                setrooms(data.rooms);
                setisloading(false);
            } catch (error) {
                console.log(error);
                setisloading(false);
                sethaserror(haserror);
            }
        }
        roooms();
    }, []);

    return (
        <div className='row'>
            <div className="col-md-12">
                <h1>Rooms</h1>
                {isloading && (<Loader />)}
                <div className="responsive-heading">
                <table className='table table-borderd table-dark'>
                    <thead className='bs'>
                        <tr>
                            <th>Room ID</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Rent Per Day</th>
                            <th>Max Count</th>
                            <th>Phone Number</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rooms.length && (rooms.map(room => {
                            return <tr>
                                <td>{room._id}</td>
                                <td>{room.name}</td>
                                <td>{room.type}</td>
                                <td>{room.rentperday}</td>
                                <td>{room.maxcount}</td>
                                <td>{room.phonenumber}</td>
                            </tr>
                        }))}
                    </tbody>
                </table>
                </div>
            </div>
        </div>
    )

}

export function Users() {

    const [users, setusers] = useState([]);
    const [isloading, setisloading] = useState(true);
    const [haserror, sethaserror] = useState()
    useEffect(() => {
        const useers = async () => {
            try {
                const data = await (await axios.get("/api/users/getallusers")).data;
                setusers(data);
                setisloading(false);
            } catch (error) {
                console.log(error);
                setisloading(false);
                sethaserror(haserror);
            }
        }
        useers();
    }, []);

    return (
        <div className='row'>
            <div className="col-md-12">
                <h1>Users</h1>
                {isloading && (<Loader />)}
                <div className='responsive-table'>
                <table className='table table-borderd table-dark'>
                    <thead className='bs'>
                        <tr>
                            <th>ID </th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Is Admin</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length && (users.map(user => {
                            return <tr>
                                <td>{user._id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.isAdmin ? "YES" : "NO"}</td>
                            </tr>
                        }))}
                    </tbody>
                </table>
                </div>
            </div>
        </div>
    )

}


export function Addroom() {
    const [isloading, setisloading] = useState(false);
    const [haserror, sethaserror] = useState();
    const [name, setname] = useState('');
    const [rentperday, setrentperday] = useState();
    const [maxcount, setmaxcount] = useState();
    const [description, setdescription] = useState();
    const [phonenumber, setphonenumber] = useState();
    const [type, settype] = useState();
    const [imageurl1, setimageurl1] = useState();
    const [imageurl2, setimageurl2] = useState();
    const [imageurl3, setimageurl3] = useState();

    async function addRoom() {
        const newroom = {
            name,
            rentperday,
            maxcount,
            description,
            phonenumber,
            type,
            imageurls: [imageurl1, imageurl2, imageurl3]
        }
        console.log(newroom);
        try {
            setisloading(true);
            const result = await (await axios.post('/api/rooms/addroom', newroom)).data;
            console.log(result);
            setisloading(false);
            Saal.fire('Oops', 'Something went wrong', 'error');
        } catch (error) {
            console.log(error);
            setisloading(false);
            Saal.fire('Congrats', 'New Room Added Successfully', 'success').then(result => {
                window.location.href = "/home"
            });
        }
    }
    return (<div>
        <div className="row">
            <div className="form col-md-10">
                {isloading && <Loader />}
                <input type="text" className='form-control' placeholder='Room Name'
                    value={name} onChange={(e) => { setname(e.target.value) }}/>
                <input type="text" className='form-control' placeholder='Rent per day'
                    value={rentperday} onChange={(e) => { setrentperday(e.target.value) }} />
                <input type="text" className='form-control' placeholder='Max Count'
                    value={maxcount} onChange={(e) => { setmaxcount(e.target.value) }} />
                <input type="text" className='form-control' placeholder='Description'
                    value={description} onChange={(e) => { setdescription(e.target.value) }} />
                <input type="text" className='form-control' placeholder='Phone Number'
                    value={phonenumber} onChange={(e) => { setphonenumber(e.target.value) }} />
                <input type="text" className='form-control' placeholder='Type'
                    value={type} onChange={(e) => { settype(e.target.value) }} />
                <input type="text" className='form-control' placeholder='Image Url 1'
                    value={imageurl1} onChange={(e) => { setimageurl1(e.target.value) }} />
                <input type="text" className='form-control' placeholder='Image Url 2'
                    value={imageurl2} onChange={(e) => { setimageurl2(e.target.value) }} />
                <input type="text" className='form-control' placeholder='Image Url 3'
                    value={imageurl3} onChange={(e) => { setimageurl3(e.target.value) }} />
                <div className='text-center'>
                    <button className='btn btn-primary' onClick={addRoom}>Add Room</button>
                </div>
            </div>

        </div>
    </div>);
}


