const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const request = require('request')
//init
const app = express();
app.use(express.static(path.join(__dirname, 'static')));

//body parser
app.use(bodyParser.urlencoded({
    extended: false
}));
var cors = require('cors');
app.use(cors());
app.use(bodyParser.json());
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    // if (req.query.lat && req.query.lng) {
    //     request(`https://api.halanx.com/homes/houses/?lat=${req.query.lat}&lng=${req.query.lng}`, (err, resp, body) => {
    //         // console.log('res',res);
    //         body = JSON.parse(body);
    //         console.log('body', body.results.length);
    //         if (resp.statusCode == 200) {
    //             res.render('index', {
    //                 data: body.results
    //             });
    //         }
    //     })

    // } else {
    //     res.render('index', {
    //         data: "empty"
    //     });
    // }
    res.render('index');
});

app.get('/api',(req,res)=>{
    if (req.query.lat && req.query.lng) {
        request(`https://api.halanx.com/homes/houses/?lat=${req.query.lat}&lng=${req.query.lng}`, (err, resp, body) => {
            // console.log('res',res);
            body = JSON.parse(body);
            res.send(body);
        })

    } else {
        res.send("No data");
    }
})

app.listen(3000, () => console.log("Server started at 3000"));