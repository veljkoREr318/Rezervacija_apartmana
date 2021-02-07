var express = require('express');
var router = express.Router();
// require model file.
var hotelModel = require('../models/hotel');

router.route('/')
    .get(function(req,res) {
        // Code to fetch the hotels.
        var hotelObject = new hotelModel();
        // Calling our model function.
        hotelObject.getAllHotels(function(err,hotelResponse) {
            if(err) {
                return res.json({"responseCode" : 1, "responseDesc" : hotelResponse});
            }
            res.json({"responseCode" : 0, "responseDesc" : "Success", "data" : hotelResponse});
        });
    })
    .post(function(req,res) {
        // Code to add new hotels.
        var hotelObject = new hotelModel();
        // Calling our model function.
        // We nee to validate our payload here.
        hotelObject.addNewHotels(req.body,function(err,hotelResponse) {
            if(err) {
                return res.json({"responseCode" : 1, "responseDesc" : hotelResponse});
            }
            res.json({"responseCode" : 0, "responseDesc" : "Success","data" : hotelResponse});
        });
    })
    .delete(function(req,res) {
        // Code to delete hotels.
        var hotelObject = new hotelModel();
        // Calling our model function.
        // We nee to validate our payload here.
        hotelObject.deleteHotels(req.body,function(err,hotelResponse) {
            if(err) {
                return res.json({"responseCode" : 1, "responseDesc" : hotelResponse});
            }
            res.json({"responseCode" : 0, "responseDesc" : "Success","data" : hotelResponse});
        });
    })
    .put(function(req,res) {
        // Code to update votes hotels.
        var hotelObject = new hotelModel();
        // Calling our model function.
        // We need to validate our payload here.
        hotelObject.voteHotelOption(req.body,function(err,hotelResponse) {
            if(err) {
                return res.json({"responseCode" : 1, "responseDesc" : hotelResponse});
            }
            res.json({"responseCode" : 0, "responseDesc" : "Success", "data" : hotelResponse});
        });
    });

module.exports = router;
