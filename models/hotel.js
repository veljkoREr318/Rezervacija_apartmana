"use strict";
var rethinkdb = require('rethinkdb');
var db = require('./db');
var async = require('async');

class hotel {
    addNewHotels(hotelData,callback) {
        async.waterfall([
            function(callback) {
                var hotelObject = new db();
                hotelObject.connectToDb(function(err,connection) {
                    if(err) {
                        return callback(true,"Error connecting to database");
                    }
                    callback(null,connection);
                });
            },
            function(connection,callback) {
                rethinkdb.table('hotel').insert({
                    "hotels" : hotelData.hotels
            }).run(connection,function(err,result) {
                    connection.close();
                    if(err) {
                        return callback(true,"Error happens while adding new hotels");
                    }
                    callback(null,result);
                });
            }
        ],function(err,data) {
            callback(err === null ? false : true,data);
        });
    }

    voteHotelOption(hotelData,callback) {
        async.waterfall([
            function(callback) {
                var hotelObject = new db();
                hotelObject.connectToDb(function(err,connection) {
                    if(err) {
                        return callback(true,"Error connecting to database");
                    }
                    callback(null,connection);
                });
            },
            function(connection,callback) {
                rethinkdb.table('hotel').get(hotelData.id).run(connection,function(err,result) {
                    if(err) {
                        return callback(true,"Error fetching hotels to database");
                    }
                    for(var hotelCounter = 0; hotelCounter < result.hotels.length; hotelCounter++) {
                        if(result.hotels[hotelCounter].option === hotelData.option) {
                            result.hotels[hotelCounter].vote += 1;
                            break;
                        }
                    }
                    rethinkdb.table('hotel').get(hotelData.id).update(result).run(connection,function(err,result) {
                        connection.close();
                        if(err) {
                            return callback(true,"Error updating the vote");
                        }
                        callback(null,result);
                    });
                });
            }
        ],function(err,data) {
            callback(err === null ? false : true,data);
        });
    }

    getAllHotels(callback) {
        async.waterfall([
            function(callback) {
                var hotelObject = new db();
                hotelObject.connectToDb(function(err,connection) {
                    if(err) {
                        return callback(true,"Error connecting to database");
                    }
                    callback(null,connection);
                });
            },
            function(connection,callback) {
                rethinkdb.table('hotel').run(connection,function(err,cursor) {
                    connection.close();
                    if(err) {
                        return callback(true,"Error fetching hotels to database");
                    }
                    cursor.toArray(function(err, result) {
                        if(err) {
                            return callback(true,"Error reading cursor");
                        }
                        callback(null,result)
                    });
                });
            }
        ],function(err,data) {
            callback(err === null ? false : true,data);
        });
    }


    deleteHotels(hotelData,callback) {
        async.waterfall([
            function(callback) {
                var hotelObject = new db();
                hotelObject.connectToDb(function(err,connection) {
                    if(err) {
                        return callback(true,"Error connecting to database");
                    }
                    callback(null,connection);
                });
            },
            function(connection,callback) {
                rethinkdb.table('hotel').delete().run(connection,function(err,result) {
                    connection.close();
                    if(err) {
                        return callback(true,"Error happens while deleting hotels");
                    }
                    callback(null,result);
                });
            }
        ],function(err,data) {
            callback(err === null ? false : true,data);
        });
    }
}
module.exports = hotel;
