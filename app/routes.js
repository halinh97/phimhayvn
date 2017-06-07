module.exports = function(app, passport) {
const pg = require('pg');
// normal routes ===============================================================
var config = {
  user: 'xbmngfbbfqjaku', //env var: PGUSER
  database: 'dd0n5iffp5jof5', //env var: PGDATABASE
  password: 'aedf899294ac4f8b270e49dd41bb4a3cc3f66e28c7da8c581e5471c941a77211', //env var: PGPASSWORD
  host: 'ec2-23-21-220-48.compute-1.amazonaws.com', // Server hosting the postgres database
  port: 5432, //env var: PGPORT
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000,
  ssl:true // h long a client is allowed to remain idle before being closed
};
var pool = new pg.Pool(config);


  app.get('/',function(req, res) {
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
            res.render("trangchu", {
              data: result,

            });
            // console.log(result.rows[0].number);
            //output: 1
        });
    });

  });

	// f SECTION =========================
	app.get('/trangchu1', isLoggedIn, function(req, res) {
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
						res.render("trangchu1", {
							data: result,
							user : req.user

						});
						// console.log(result.rows[0].number);
						//output: 1
				});
		});

	});

	// LOGOUT ==============================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

	// locally --------------------------------
		// LOGIN ===============================
		// show the login form
		app.get('/login', function(req, res) {
			res.render('login', { message: req.flash('loginMessage') });
		});

		// process the login form

    app.post('/login', passport.authenticate('local-login', {
      successRedirect : '/trangchu1', // redirect to the secure trangchu1 section
      failureRedirect : '/login', // redirect back to the signup page if there is an error
      failureFlash : true // allow flash messages
    }));
/// admin             admin login

    app.get('/login_admin', function(req, res) {
      res.render('login_admin', { message: req.flash('loginMessage') });
    });
    app.post('/login_admin', passport.authenticate('local-login_admin', {
      successRedirect : '/video/list', // redirect to the secure trangchu1 section
      failureRedirect : '/login_admin', // redirect back to the signup page if there is an error
      failureFlash : true // allow flash messages
    }));
    // process the login form


		// SIGNUP =================================
		// show the signup form
		app.get('/signup', function(req, res) {
			res.render('signup', { message: req.flash('loginMessage') });
		});

		// process the signup form
		app.post('/signup', passport.authenticate('local-signup', {
			successRedirect : '/trangchu1', // redirect to the secure trangchu1 section
			failureRedirect : '/signup', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));
// singup admin

    app.get('/signup_admin', function(req, res) {
      res.render('signup_admin', { message: req.flash('loginMessage') });
    });

    // process the signup form
    app.post('/signup_admin', passport.authenticate('local-signup_admin', {
      successRedirect : '/login_admin', // redirect to the secure trangchu1 section
      failureRedirect : '/signup_admin', // redirect back to the signup page if there is an error
      failureFlash : true // allow flash messages
    }));

	// facebook -------------------------------

		// send to facebook to do the authentication
		app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

		// handle the callback after facebook has authenticated the user
		app.get('/auth/facebook/callback',
			passport.authenticate('facebook', {
				successRedirect : '/trangchu1',
				failureRedirect : '/'
			}));

	// google ---------------------------------

		// send to google to do the authentication
		app.get('/auth/google', passport.authenticate('google', { scope : ['trangchu1', 'email'] }));

		// the callback after google has authenticated the user
		app.get('/auth/google/callback',
			passport.authenticate('google', {
				successRedirect : '/trangchu1',
				failureRedirect : '/'
			}));

	// microsoft windowslive---------------------------------

		// send to microsoft windowslive to do the authentication
		app.get('/auth/windowslive', passport.authenticate('windowslive', { scope : ['wl.signin', 'wl.basic'] }));

		// the callback after google has authenticated the user
		app.get('/auth/windowslive/callback',
			passport.authenticate('windowslive', {
				successRedirect : '/trangchu1',
				failureRedirect : '/'
			}));

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

	// locally --------------------------------
		app.get('/connect/local', function(req, res) {
			res.render('connect-local', { message: req.flash('loginMessage') });
		});
		app.post('/connect/local', passport.authenticate('local-signup', {
			successRedirect : '/trangchu1', // redirect to the secure trangchu1 section
			failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

	// facebook -------------------------------

		// send to facebook to do the authentication
		app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));
		//app.get('/connect/facebook', passport.authenticate('facebook', { scope : 'email' }));

		// handle the callback after facebook has authorized the user
		app.get('/connect/facebook/callback',
			passport.authorize('facebook', {
			//passport.authenticate('facebook', {
				successRedirect : '/trangchu1',
				failureRedirect : '/'
			}));

	// google ---------------------------------

		// send to google to do the authentication
		app.get('/connect/google', passport.authorize('google', { scope : ['trangchu1', 'email'] }));

		// the callback after google has authorized the user
		app.get('/connect/google/callback',
			passport.authorize('google', {
				successRedirect : '/trangchu1',
				failureRedirect : '/'
			}));

	// microsoft windowslive ---------------------------------

		// send to microsoft windowslive to do the authentication
		app.get('/connect/windowslive', passport.authorize('windowslive', { scope : ['wl.signin', 'wl.basic', 'wl.emails'] }));

		// the callback after google has authorized the user
		app.get('/connect/windowslive/callback',
			passport.authorize('windowslive', {
				successRedirect : '/trangchu1',
				failureRedirect : '/'
			}));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

	// local -----------------------------------
	app.get('/unlink/local', function(req, res) {
		var user            = req.user;
		user.localemail    = null;
		user.localpassword = null;
		user.save()
			.then(function ()
			{res.redirect('/trangchu');})
			.catch(function ()
			{res.redirect('/trangchu');});
	});

	// facebook -------------------------------
	app.get('/unlink/facebook', function(req, res) {
		var user            = req.user;
		user.facebooktoken = null;
		user.save()
			.then(function ()
			{res.redirect('/trangchu1');})
			.catch(function ()
			{res.redirect('/trangchu1');});
	});

	// google ---------------------------------
	app.get('/unlink/google', function(req, res) {
		var user          = req.user;
		user.googletoken = null;
		user.save()
			.then(function ()
			{res.redirect('/trangchu1');})
			.catch(function ()
			{res.redirect('/trangchu1');});
	});

	// microsoft ---------------------------------
	app.get('/unlink/windowslive', function(req, res) {
		var user          = req.user;
		user.windowslivetoken = null;
		user.save()
			.then(function ()
			{res.redirect('/trangchu1');})
			.catch(function ()
			{res.redirect('/trangchu1');});
	});


};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}
