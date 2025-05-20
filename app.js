const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req,res){
    res.sendFile(__dirname+"/signup.html");
});

app.post("/", function(req,res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    const jsonData =JSON.stringify(data);

    const url = "https://us15.api.mailchimp.com/3.0/lists/b0658849b0";
    const options = {
        method: "POST",
        auth: "shouvik:12e523cc65c0b24da0e5d4fef5992242-us15"
    };

    const request = https.request(url, options, function(response){
        if(response.statusCode === "200") {
            res.sendFile(__dirname+"/succes.html");
        } else {
            res.sendFile(__dirname+"/failure.html");
        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        });
    });

    //request.write(jsonData);
    request.end();
});

app.post("/failure", function(req, res){
    res.redirect("/");
});

app.listen(3000, function() {
   console.log("Server is up and running in port 3000"); 
});

//12e523cc65c0b24da0e5d4fef5992242-us15  //API Key for mailchimp

//b0658849b0  //List Id or Audience ID for mailchimp