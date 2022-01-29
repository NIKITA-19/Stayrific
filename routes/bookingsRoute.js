const express = require("express");
const router = express.Router();
const Booking = require("../model/booking")
const Room = require("../model/room")
const moment = require("moment")
const { v4: uuidv4 } = require('uuid');
const stripe = require("stripe")("sk_test_51KJXiVSG1JZ4QPtfgljBLrs36px94nAoSRholpphLrVXAKKDHBWj6dxCa8jVaeSPpHA6vVXKH4i8FY1kz4LsEChV00TFKXnVtI")
router.post('/getbookingsbyuserid', async (req,res) =>{
    const userid = req.body.userid;
    try {
        const bookings = await Booking.find({userid : userid});
        res.send(bookings);
    } catch (error) {
        return res.status(400).json({error});
    }
});
router.post("/cancelbooking",async(req,res)=>{
    const bookingid=req.body.bookingid;
    const  roomid =req.body.roomid;
    try {
        const booking = await Booking.findOne({_id : bookingid});
        booking.status ="cancelled"
        await booking.save()
        const room= await Room.findOne({_id: roomid})
 
        const bookings = room.currentbookings
 
        const temp = bookings.filter(booking => booking.bookingid.toString()!==bookingid)
        room.currentbookings= temp
 
        await room.save()
 
        res.send("Your booking cancelled successfully")
    } catch (error) {
        return res.status(400).json({error});
    }
 });
router.get("/getallbookings",async(req,res)=>{
    try {
        const bookings = await Booking.find();
        res.send(bookings);
    } catch (error) {
        return res.status(400).json({error});
    }
})
router.post("/bookroom", async (req, res) => {
    const {
        room,
        userid,
        fromdate,
        todate,
        totalamount,
        totaldays,
        token
    } = req.body;
    try {
        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id
        })

        /*stripe.handleCardPayment('{PAYMENT_INTENT_CLIENT_SECRET}', {
            payment_method: '{PAYMENT_METHOD_ID}',
        })
            .then(function (result) {
                // Handle result.error or result.paymentIntent
            });*/
        const payment = await stripe.paymentIntents.create({
            payment_method: token.card.id,
            amount: totalamount * 100,
            currency: 'inr',
            customer: customer.id,
            receipt_email: token.email,
        }, {
            idempotencyKey: uuidv4()
        });
        //console.log(payment)
        intent = await stripe.paymentIntents.confirm(
            payment.id
          );
          //console.log(intent);
          //stripe.confirmCardPayment(payment.clientSecret).then(function(params) {
          //  console.log("yay");
          //}
          //)
          //stripe.handleCardPayment();
        /*stripe.confirmCardPayment(idempotencyKey).then(function (res) {
            if (res.error) {
                console.log("Error");
            } else if (res.paymentIntent && res.paymentIntent.status === 'succeeded') {
                console.log('Payment Successfull, Enjoy your stay!');
            }
        });*/
        /*const payment = await stripe.charges.create(
            {
                amount: totalamount * 100,
                customer: customer.id,
                currency: 'INR',
                receipt_email: token.email
            }, {
            idempotencyKey: uuidv4()
        }
        )*/
        //res.render('checkout', { client_secret: intent.client_secret });
        //console.log(payment);

        if (intent) {
            //response.paymentIntent.status === 'succeeded';
                const newbooking = new Booking({
                    room: room.name,
                    roomid: room._id,
                    userid,
                    fromdate,
                    todate,
                    totalamount,
                    totaldays,
                    transactionId: '1234'
                })

                const booking = await newbooking.save();
                const curroom = await Room.findOne({ _id: room._id })
                curroom.currentbookings.push(
                    {
                        bookingid: booking._id,
                        fromdate: fromdate,
                        todate: todate,
                        userid: userid,
                        status: booking.status
                    });
                await curroom.save()
        }
        res.send('Payment Successfull, Enjoy your stay!')
    }   
     catch (error) {
        res.status(400).json({ error });
    }

});



module.exports = router;