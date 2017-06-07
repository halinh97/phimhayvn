var express = require('express');
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");
app.set('port', (process.env.PORT || 1000));
app.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port'));
});
var passport = require('passport');
var flash    = require('connect-flash'); // store and retrieve messages in session store

var morgan       = require('morgan'); // logger
var cookieParser = require('cookie-parser'); // parse cookies
var bodyParser   = require('body-parser'); // parse posts
var session      = require('express-session'); // session middleware

require('./config/passport')(passport);
const pg = require('pg');
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
// required for passport
app.use(session({ secret: 'zomaareenstukjetekstDatjenietzomaarbedenkt' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport);
var config = {
    user: 'khjazedjdbfznh', //env var: PGUSER
    database: 'de3acf6i8u7q72', //env var: PGDATABASE
    password: 'aedf899294ac4f8b270e49dd41bb4a3cc3f66e28c7da8c581e5471c941a77211', //env var: PGPASSWORD
    host: 'ec2-184-73-236-170.compute-1.amazonaws.com', // Server hosting the postgres database
    port: 5432, //env var: PGPORT
    max: 10, // max number of clients in the pool
    idleTimeoutMillis: 30000,
		ssl:true // how long a client is allowed to remain idle before being closed
};
var pool = new pg.Pool(config);
var bodyParser = require('body-parser');
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/upload')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
        // cb(null, file.fieldname + '-' + Date.now())
    }
});

var upload = multer({
    storage: storage
}).single('uploadfile');
var urlencodedParser = bodyParser.urlencoded({
    extended: false
});

// app.get("/", function(req, res) {
//     pool.connect(function(err, client, done) {
//         if (err) {
//             return console.error('error fetching client from pool', err);
//         }
//
//         //use the client for executing the query
//         client.query('SELECT * FROM video ', function(err, result) {
//             //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
//             done(err);
//
//             if (err) {
//                 res.end;
//                 return console.error('error running query', err);
//             }
//             res.render("trangchu1", {
//                 data: result
//             });
//             // console.log(result.rows[0].number);
//             //output: 1
//         });
//     });
//
// });


app.get("/video/list",isLoggedInadmin, function(req, res) {
    pool.connect(function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        //use the client for executing the query
        client.query('SELECT * FROM video ', function(err, result) {
            //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
            done(err);

            if (err) {
                res.end;
                return console.error('error running query', err);
            }
            res.render("list", {
                data: result
            });
            // console.log(result.rows[0].number);
            //output: 1
        });
    });

});
app.get("/video/list1",isLoggedInadmin, function(req, res) {
    pool.connect(function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        //use the client for executing the query
        client.query('SELECT * FROM users ', function(err, result) {
            //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
            done(err);

            if (err) {
                res.end;
                return console.error('error running query', err);
            }
            res.render("list1", {
                data: result
            });
            // console.log(result.rows[0].number);
            //output: 1
        });
    });

});


app.get("/video/xemvideo/:id", function(req, res) {
    var id = req.params.id;
    pool.connect(function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        client.query('SELECT * FROM video WHERE id=' + id, function(err, result) {
            //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
            done(err);

            if (err) {
                res.end();
                return console.error('error running query', err);
            }
            res.render("xemvideo", {
                data: result.rows[0]
            });

        });
    });
});
app.get("/video/delete/:id", function(req, res) {
    // res.send(req.params.id);
    pool.connect(function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        //use the client for executing the query
        client.query('delete from video where id = ' + req.params.id, function(err, result) {
            //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
            done(err);

            if (err) {
                res.end;
                return console.error('error running query', err);
            }
            res.redirect("../list");

        });
    });

})
app.get("/video/add", function(req, res) {
    res.render("add");

});
app.get("/video/adduser", function(req, res) {
    res.render("adduser");

});
app.post("/login-admin",urlencodedParser, function(req, res) {
    res.render("login-admin");

});
app.get("/login-admin", function(req, res) {

    pool.connect(function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        //use the client for executing the query
        client.query('SELECT * FROM nguoidung ', function(err, result) {
            //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
            done(err);

            if (err) {
                res.end;
                return console.error('error running query', err);
            }
            res.render("login-admin", {
                data: result
            });
            // console.log(result.rows[0].number);
            //output: 1
        });

    });

});

app.post("/video/add", urlencodedParser, function(req, res) {
    upload(req, res, function(err) {
        if (err) {
            res.send("co loi");
        } else {
            if (req.file == undefined) {
                res.send("file chua duoc chon");
            } else {
                pool.connect(function(err, client, done) {
                    if (err) {
                        return console.error('error fetching client from pool', err);
                    }

                    var sql = "insert into video (tieude, mota, keys, imge) values('" + req.body.tieude + "','" + req.body.mota + "','" + req.body.keys + "','" + req.file.originalname + "')";

                    client.query(sql, function(err, result) {
                        //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
                        done(err);

                        if (err) {
                            res.end;
                            return console.error('error running query', err);
                        }
                        res.redirect("./list");

                    });
                });
            }

        }

    })


});
app.post("/video/adduser", urlencodedParser, function(req, res) {
    upload(req, res, function(err) {
        if (err) {
            res.send("co loi");
        } else {
            if (req.hoten == "") {
                res.send("ban chua dien ten chon");
            } else {
                pool.connect(function(err, client, done) {
                    if (err) {
                        return console.error('error fetching client from pool', err);
                    }

                    var sql = "insert into nguoidung (hoten,ten, mk) values('" + req.body.hoten + "','" + req.body.ten + "','" + req.body.mk + "')";

                    client.query(sql, function(err, result) {
                        //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
                        done(err);

                        if (err) {
                            res.end;
                            return console.error('error running query', err);
                        }
                        res.redirect("./list1");

                    });
                });
            }

        }

    })


});
app.get("/video/edit/:id", function(req, res) {
    var id = req.params.id;
    pool.connect(function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        client.query('SELECT * FROM video WHERE id=' + id, function(err, result) {
            //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
            done(err);

            if (err) {
                res.end();
                return console.error('error running query', err);
            }
            res.render("edit", {
                data: result.rows[0]
            });

        });
    });
});
app.post("/video/edit/:id", urlencodedParser, function(req, res) {
    var id = req.params.id;
    upload(req, res, function(err) {
        if (err) {
            res.send("xay ra loi upload");
        } else {
            if (typeof(req.file) == 'undefined') {
                pool.connect(function(err, client, done) {
                    if (err) {
                        return console.error('error fetching client from pool', err);
                    }

                    //  var sql = "insert into video (tieude, mota, keys, imge) values('"+req.body.tieude+"','"+req.body.mota+"','"+req.body.keys+"','"+req.file.originalname+"')";

                    client.query("UPDATE video set tieude='" + req.body.tieude + "',mota='" + req.body.mota + "',keys='" + req.body.keys + "' WHERE id =" + id, function(err, result) {
                        //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
                        done(err);

                        if (err) {
                            res.end;
                            return console.error('error running query', err);
                        }
                        res.redirect("../list");

                    });
                });

            } else {
                pool.connect(function(err, client, done) {
                    if (err) {
                        return console.error('error fetching client from pool', err);
                    }

                    //  var sql = "insert into video (tieude, mota, keys, imge) values('"+req.body.tieude+"','"+req.body.mota+"','"+req.body.keys+"','"+req.file.originalname+"')";

                    client.query("UPDATE video set tieude='" + req.body.tieude + "',mota='" + req.body.mota + "',keys='" + req.body.keys + "',imge='" + req.file.originalname + "' WHERE id =" + id, function(err, result) {
                        //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
                        done(err);

                        if (err) {
                            res.end;
                            return console.error('error running query', err);
                        }
                        res.redirect("../list");

                    });
                });
            }
        }


    });
});

function isLoggedInadmin(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/login_admin');
}
