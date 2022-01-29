import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Room from '../components/Room';
import Loader from '../components/Loader';
import Error from '../components/Error';
import { DatePicker, message, Space } from 'antd';
import 'antd/dist/antd.css';
import moment from 'moment';
const { RangePicker } = DatePicker;
function Homescreen() {

    const [roooms, setroooms] = useState([]);
    const [isloading, setisloading] = useState(false);
    const [haserror, sethaserror] = useState(false);
    const [fromdate, setfromdate] = useState();
    const [todate, settodate] = useState();
    const [duplicaterooms, setduplicaterooms] = useState();
    const [searchkey, setsearchkey] = useState('');
    const [type, settype] = useState('all');
    useEffect(() => {
        const fetchData = async () => {
            setisloading(true);
            sethaserror();
            try {
                const data = (await axios.get('/api/rooms/getallrooms')).data;
                setroooms(data.rooms);
                setduplicaterooms(data.rooms)
            } catch (error) {
                console.log(error);
                sethaserror(true);
            }
            setisloading(false);
        };
        fetchData();
    }, [setroooms], [setduplicaterooms]);

    function filterByDate(dates) {
        //console.log(moment(dates[0].format('DD-MM-YYYY')),moment(dates[1].format('DD-MM-YYYY')));
        setfromdate(moment(dates[0]).format('DD-MM-YYYY'));
        settodate(moment(dates[1]).format('DD-MM-YYYY'));
        const from=moment(dates[0],'DD-MM-YYYY');
        const to=moment(dates[1],'DD-MM-YYYY');
        //console.log(from);
        var temprooms = [];
        var availability = true;
        for (const room of duplicaterooms) {
            //console.log(room.name);
            availability = true;
            if (room.currentbookings.length > 0) {
                for (const booking of room.currentbookings) {
                    const bfrom=moment(booking.fromdate,'DD-MM-YYYY');
                    const bto=moment(booking.todate,'DD-MM-YYYY');
                   // console.log(moment(dates[0]).format('DD-MM-YYYY'));
                    //console.log(moment(fromdate,'DD-MM-YYYY'));
                   // console.log(booking.fromdate)
                   // console.log(booking.todate)
                  /* console.log(from);
                   console.log(to);
                   console.log(booking.fromdate);
                    console.log(
                        from.isBetween(
                            booking.fromdate,
                            booking.todate
                        ));
                    console.log(bfrom.isBetween(
                        from,to
                        ));*/
                    //console.log(moment(dates[0]).format('DD-MM-YYYY') != booking.fromdate)
                    //console.log(moment(dates[0]).format('DD-MM-YYYY'))
                    if (
                        from.isBetween(
                            bfrom,
                            bto
                        )
                        ||
                        to.isBetween(
                            bfrom,
                            bto
                        )||moment(bfrom).isBetween(
                            from,to
                        )||moment(bto).isBetween(
                          from,to)

                     ){
                        console.log("isbetween");
                        availability = false;
                        break;
                    }
                    //console.log("hello");
                    if (
                        moment(dates[0]).format('DD-MM-YYYY') === booking.fromdate
                        || moment(dates[0]).format('DD-MM-YYYY') === booking.todate
                        || moment(dates[1]).format('DD-MM-YYYY') === booking.fromdate
                        || moment(dates[1]).format('DD-MM-YYYY') === booking.todate
                    ) {
                        //console.log("here");
                        availability = false;
                        break;
                    }

                }
            }
            if (availability === true || room.currentbookings.length === 0) {
                //console.log(room.name);
                temprooms.push(room);
            }
            //console.log(availability);
        }
        setroooms(temprooms);
    }

    function filterBySearch() {
        const temprooms = duplicaterooms.filter(room => room.name.toLowerCase().includes(searchkey.toLowerCase()))
        setroooms(temprooms);
    }

    function filterByType(e) {
        settype(e);
        if (e !== 'all') {
            const temprooms = duplicaterooms.filter(room => room.type.toLowerCase() == e.toLowerCase())
            setroooms(temprooms);
        }
        else {
            setroooms(duplicaterooms);
        }
    }
    return (
        <div className='container'>
            <div className="row justify-content-center mt-5">
                <div className="col-md-3">
                    <RangePicker format="DD-MM-YYYY" onChange={filterByDate} />
                </div>
                <div className="col-md-3">
                    <input type="test" className='form-control' placeholder='Search Rooms'
                        value={searchkey} onChange={(e) => { setsearchkey(e.target.value) }} onKeyUp={filterBySearch}
                    />
                </div>
                <div className="col-md-3">
                    <select className='form-control' value={type} onChange={(e) => { filterByType(e.target.value) }}>
                        <option value="all"> All</option>
                        <option value="delux">Delux</option>
                        <option value="non-delux">Non-Delux</option>
                    </select>
                </div>
            </div>
            <div className="row justify-content-center mt-5">
                {isloading ? (
                    <h1> <Loader /></h1>
                ) : (
                    roooms.map((room) => {
                        return <div className='col-md-9 mt-5'>
                            <Room room={room} fromdate={fromdate} todate={todate} />
                        </div>
                    }))
                }
            </div>
        </div>
    )
}

export default Homescreen
