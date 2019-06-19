const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const cors = require('cors');
const request = require('request');

// init
const app = express();
const router = express.Router();
app.use(cors());

app.set('view engine', 'ejs');
app.use('/widget', router);

//body parser
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// set static routing
router.use('/static', express.static(path.join(__dirname, 'static')));

// logger
router.use(function(req, res, next) {
  console.log('%s %s %s', req.method, req.url, req.path);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

router.get('/', (req, res) => {
    res.render('index', {loc:req.get('host'), protocol:req.protocol});
});

const housesListAPIEndpoint = "https://api.halanx.com/homes/houses/";

router.get('/api/', (req, res) => {
    let params = {};

    if (req.query.lat && req.query.lng) {
        params['latitude'] = req.query.lat;
        params['longitude'] = req.query.lng;
    }

    if (req.query.accomodation_allowed) {
        params['accomodation_allowed'] = req.query.accomodation_allowed;
    }

    if (req.query.accomodation_type) {
        params['accomodation_type'] = req.query.accomodation_type
    }

    request({url:housesListAPIEndpoint, qs:params}, (err, resp, body) => {
        body = JSON.parse(body);
        res.send(body);
    })
});

app.listen(8080, () => console.log("Server started at 3000"));
