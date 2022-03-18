const express = require('express');
const forget = require('../Models/Users');
const nodemailer = require ('nodemailer'); 
const router = express.Router();


router.post (`/reset`, async (req, res) => {
    const email = req.query.email;
    const {resetPassword, confirmPassword} = req.body;

    

    if (resetPassword === confirmPassword){
        // encrypt submitted password
        const hashedPassword = await bcrypt.hash(confirmPassword, 10);

        const emailExist = await User.findOne({email: email});
        
        if(!emailExist){
            res.status("422").json({error:'No record found'});
        }else if(emailExist){
            let values = {
                password: hashedPassword
            }


        }


    }

    
    

    // if(!userEmail){
    //     res.status("422").json({error:'Wrong Username or Password combination!'});
    // }
// res.status("422").json({error:'Wrong Username or Password combination!'});
})


router.post ('/email', async (req, res) => {
    const {email} = req.body;
    const checkEmail = await forget.findOne ({ email:email });

    if (checkEmail){
        try {
            //Reusable transporter object
            let transporter = nodemailer.createTransport({
                host: process.env.MAIL_HOST,
                port: process.env.MAIL_PORT,
                secure: false,
                auth: {
                    user: process.env.MAIL_USER,    //Unique user found in env
                    pass: process.env.MAIL_PASS,    //Unique password found in env
                },
            });

            //Verify that the transporter connection is established
            transporter.verify(function(error, success) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Server is ready to take our messages');
                }
            });

            var num = Math.floor(1000 + Math.random() * 9000);    //Random code of 4 whole digits
            code = num;                             //Pass num into 'code: code'
            console.log(code)          

            //Create message that will be sent to user email
            const msg = {
                from: `"GDSC Team" <${process.env.MAIL_FROM}>`, // sender address
                to: email, // list of receivers
                subject: "Hello",
                text: "This is your code: " + code,
                html: `<b>Hey there!</b> <br/>Here is your code ${code}`, 
            }

            const info = await transporter.sendMail(msg);       //Verify that message gets sent

            console.log("Message sent: %s", info.messageId);    //Display mail Id
            //console.log ("Preview URL: %s", nodemailer.getTestMessageUrl(info));

            res.json ({code: code});
        }
        catch (err){
            console.log (err);
        }
    }
    else
    {
        res.status(400).send({error:'Email could not be found'});
    }
});

module.exports = router;