const User = require('../models/user');
const Organization = require('../models/organization');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const passport = require('passport');
const config = require('../config/database');
const bcrypt = require('bcrypt-nodejs'); // A native JS bcrypt library for NodeJS


module.exports = (router, session) => {

    mongoose.set('debug', true);

    router.get('/', (req, res) => {
        include('../index.html');
    })


    /* ==============
      Create Token
   ============== */
    router.get('/createRegisterToken', (req, res) => {
        const token = jwt.sign({}, config.secret, {expiresIn: '24h'}); // Create a token for client
        res.json({success: true, message: 'Success!', token: token});
    });

    /* ==============
      Create Organization Route
   ============== */
    router.post('/createOrganization', (req, res) => {
        if (!req.body.organizationname) {
            res.json({success: false, message: 'Please provide organization name'});
        } else {
            if (!req.body.location) {
                res.json({success: false, message: 'Please provide organization location'});
            } //else {
            //   if (!req.body.sport) {
            //     res.json({ success: false, message : 'You must provide sports'});
            //   }
            // }
        }
        let organization = new Organization({
            organizationname: req.body.organizationname,
            location: req.body.location
            // sport : req.body.sport
        });
        Organization.createOrganization(organization, function (err) {
            if (err) {
                if (err.errors) {
                    // Check if validation error is in the email field
                    if (err.errors.organizationname) {
                        res.json({success: false, message: err.errors.organizationname.message}); // Return error
                    } else {
                        // Check if validation error is in the username field
                        if (err.errors.location) {
                            res.json({success: false, message: err.errors.location.message}); // Return error
                        } // else {
                        //   if (err.errors.sport) {
                        //     res.json({ success : false, message : err.errors.sport.message});
                        //   }
                        // }
                    }
                } else {
                    res.json({success: false, message: 'Could not save organ. Error: ', err}); // Return error if not related to validation
                }
            } else {
                res.json({success: true, message: 'Organization registered!', organizationID: organization._id}); // Return success
            }
        });
    });
    /* ==============
       Register Route
    ============== */
    router.post('/register', (req, res) => {
        // Check if email was provided
        if (!req.body.firstname) {
            res.json({success: false, message: 'You must provide an first name'}); // Return error
        } else {
            // Check if username was provided
            if (!req.body.lastname) {
                res.json({success: false, message: 'You must provide a last name'}); // Return error
            } else {
                // Check if password was provided
                if (!req.body.email) {
                    res.json({success: false, message: 'You must provide a e-mail'}); // Return error
                } else {
                    if (!req.body.username) {
                        res.json({success: false, message: 'You must provide a username'}); // Return error
                    } else {
                        if (!req.body.password) {
                            res.json({success: false, message: 'You must provide a password'}); // Return error
                        } else {
                            if (!req.body.organization) {
                                res.json({success: false, message: 'You must provide an organization'});
                            }// else {
                            //   if (!req.body.sport) {
                            //     res.json({ success: false, message : 'You must provide sports'});
                            //   }
                            // }
                        }
                    }
                    // Create new user object and apply user input
                    let user = new User({
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        email: req.body.email.toLowerCase(),
                        username: req.body.username,
                        password: req.body.password,
                        organization: req.body.organization
                        // sport : req.body.sport
                    });
                    // Save user to database
                    user.save((err) => {
                        // Check if error occured
                        if (err) {
                            // Check if error is an error indicating duplicate account
                            if (err.code === 11000) {
                                res.json({success: false, message: err.message}); // Return error
                            } else {
                                // Check if error is a validation rror
                                if (err.errors) {
                                    // Check if validation error is in the email field
                                    if (err.errors.email) {
                                        res.json({success: false, message: err.errors.email.message}); // Return error
                                    } else {
                                        // Check if validation error is in the username field
                                        if (err.errors.username) {
                                            res.json({success: false, message: err.errors.username.message}); // Return error
                                        } else {
                                            // Check if validation error is in the password field
                                            if (err.errors.password) {
                                                res.json({success: false, message: err.errors.password.message}); // Return error
                                            } else {
                                                if (err.errors.firstName) {
                                                    res.json({success: false, message: err.errors.password.message}); // Return error
                                                } else {
                                                    if (err.errors.lastName) {
                                                        res.json({success: false, message: err.errors.lastName.message}); // Return error
                                                    } else {
                                                        if (err.errors.organization) {
                                                            res.json({success: false, messsage: err.errors.organization.message});
                                                        } else {
                                                            if (err.errors.role) {
                                                                res.json({success: false, message: err.errors.role.message});
                                                            } //else {
                                                            //   if (err.errors.sport) {
                                                            //     res.json({ success : false, message : err.errors.sport.message});
                                                            //   }
                                                            // }
                                                            res.json({success: false, message: err}); // Return any other error not already covered
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                } else {
                                    res.json({success: false, message: 'Could not save user. Error: ', err}); // Return error if not related to validation
                                }
                            }
                        } else {
                            res.json({success: true, message: 'Account registered!'}); // Return success
                        }
                    });
                }
            }
        }
    });

    /* ===============================================================
       Route to check if user's username is available for registration
    =============================================================== */
    router.get('/checkUsername/:username', (req, res) => {
        // Check if username was provided in paramaters
        if (!req.params.username) {
            res.json({success: false, message: 'Username was not provided'}); // Return error
        } else {
            // Look for username in database
            User.findOne({username: req.params.username.toLowerCase()}, (err, user) => {
                // Check if connection error was found
                if (err) {
                    res.json({success: false, message: err}); // Return connection error
                } else {
                    // Check if user's username was found
                    if (user) {
                        res.json({success: false, message: 'Username is already taken'}); // Return as taken username
                    } else {
                        res.json({success: true, message: 'Username is available'}); // Return as vailable username
                    }
                }
            });
        }
    });

    /* ============================================================
      Route to check if user's email is available for registration
   ============================================================ */
    router.get('/checkEmail/:email', (req, res) => {
        // Check if email was provided in paramaters
        if (!req.params.email) {
            res.json({success: false, message: 'E-mail was not provided'}); // Return error
        } else {
            // Search for user's e-mail in database;
            User.findOne({email: req.params.email}, (err, user) => {
                if (err) {
                    res.json({success: false, message: err}); // Return connection error
                } else {
                    // Check if user's e-mail is taken
                    if (user) {
                        res.json({success: false, message: 'E-mail is already taken'}); // Return as taken e-mail
                    } else {
                        res.json({success: true, message: 'E-mail is available'}); // Return as available e-mail
                    }
                }
            });
        }
    });


    /* ============================================================
      Route to check if user's organization is available for registration
   ============================================================ */
    router.get('/checkorganization/:organizationname', (req, res) => {
        // Check if email was provided in paramaters
        if (!req.params.organizationname) {
            res.json({success: false, message: 'Organization was not provided'}); // Return error
        } else {
            // Search for user's e-mail in database;
            Organization.findOne({organizationname: req.params.organizationname}, (err, organization) => {
                if (err) {
                    res.json({success: false, message: err}); // Return connection error
                } else {
                    // Check if user's e-mail is taken
                    if (organization) {
                        res.json({success: false, message: 'Organization is already taken'}); // Return as taken e-mail
                    } else {
                        res.json({success: true, message: 'Organization is available'}); // Return as available e-mail
                    }
                }
            });
        }
    });

    router.get('/getOrganization/:id', (req, res) => {
        // Check if email was provided in paramaters
        if (!req.params.id) {
            res.json({success: false, message: 'Organization was not provided'}); // Return error
        } else {
            // Search for user's e-mail in database;
            Organization.findOne({ _id: req.params.id }, (err, organization) => {
                if (err) {
                    res.json({success: false, message: err}); // Return connection error
                } else {
                    // Check if user's e-mail is taken
                    if (!organization) {
                        res.json({success: false, message: 'Organization does not exist'}); // Return as taken e-mail
                    } else {
                        res.json({success: true, message: 'Organization exists', organization: organization}); // Return as available e-mail
                    }
                }
            });
        }
    });

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user.id);
        // where is this user.id going? Are we supposed to access this anywhere?
    });

// used to deserialize the user
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    router.post('/login', (req, res) => {
        if (!req.body.username) {
            res.json({success: false, message: "Username not provided"});
        } else {
            if (!req.body.password) {
                res.json({success: false, message: "Password not provided"});
            } else {
                User.findOne({username: req.body.username.toLowerCase()}, (err, user) => {
                    if (err) {
                        res.json({success: false, message: err});
                    } else {
                        if (!user) {
                            res.json({success: false, message: "Username Not Found"});
                        } else {
                            const validPass = user.comparePassword(req.body.password);
                            if (!validPass) {
                                res.json({success: false, message: "Password invalid"});
                            } else {
                                const token = jwt.sign({
                                    userId: user._id,
                                    organId: user.organization
                                }, config.secret, {expiresIn: '24h'}); // Create a token for client
                                res.json({success: true, message: 'Log in Success!', token: token, user: {role: user.role}}); // Return success and token to frontend
                            }
                        }
                    }
                });
            }
        }
    });

    /* ===============================================================
    Route to change username
    =============================================================== */
    router.post('/changeUsername', (req, res) => {
        if (!req.body.identity) {
            console.log("no ID");
        }
        User.findOneAndUpdate(
            {"_id": req.body.identity},
            {
                "$set": {
                    "username": req.body.newUsername,
                }
            },
            {"upsert": false},
            function (err, doc) {
                if (err) {
                    res.json({success: false, message: 'Could not change username. It already exists'});
                } else {
                    // console.log(doc);
                    res.json({success: true, username: doc.username, message: 'Username Changed'});
                }
            }
        );
    });

    /* ===============================================================
    Route to change email
    =============================================================== */
    router.post('/changeEmail', (req, res) => {
        if (!req.body.identity) {
            console.log("no ID");
        }
        User.findOneAndUpdate(
            {"_id": req.body.identity},
            {
                "$set": {
                    "email": req.body.newEmail,
                }
            },
            {"new": true, "upsert": true},
            function (err, doc) {
                if (err) {
                    res.json({success: false, message: 'Could not change email. It already exists'}); // Return error, organs was not found in db
                } else {
                    // console.log(doc);
                    res.json({success: true, email: doc.email, message: 'E-mail Changed'});
                }
            }
        );
    });

    /* ===============================================================
       Route to check if old password matches before changing password to a new one
    =============================================================== */
    router.get('/checkPassword/:oldPassword/:username', (req, res) => {
        // Check if password was provided in paramaters
        if (!req.params.oldPassword) {
            res.json({success: false, message: 'Password was not provided'}); // Return error
        } else {
            // Look for password in database
            User.findOne({username: req.params.username}, (err, user) => {
                // Check if connection error was found
                if (err) {
                    res.json({success: false, message: 'err : user not found?'}); // Return connection error
                } else {
                    const validPass = user.comparePassword(req.params.oldPassword);
                    // Check if user's password was found
                    if (validPass) { //user &&
                        res.json({success: true, message: 'Old Password Matched'}); // Return as taken username
                    } else {
                        res.json({success: false, message: 'Old Password didn\'t match'}); // Return as vailable username
                    }
                }
            });
        }
    });

    /* ===============================================================
    Route to change password
    =============================================================== */
    router.post('/changePassword', (req, res) => {
        if (!req.body.identity) {
            console.log("no ID");
        }
        // Apply encryption
        bcrypt.hash(req.body.newPassword, null, null, (err, hash) => {
            if (err) return next(err); // Ensure no errors
            User.findOneAndUpdate(
                {"_id": req.body.identity},
                {
                    "$set": {
                        "password": hash,
                    }
                },
                {"new": true, "upsert": true},
                function (err, doc) {
                    if (err) {
                        res.json({success: false, message: 'Could not change password. It already exists'}); // Return error, organs was not found in db
                    } else {
                        // console.log(doc);
                        res.json({success: true, message: 'Password Changed'});
                    }
                }
            );
        });
    });


    /* ================================================
    MIDDLEWARE - Used to grab user's token from headers
    ================================================ */
    router.use((req, res, next) => {
        const token = req.headers['authorization']; // Create token found in headers
        // console.log('my token is HERE : ', token)
        // Check if token was found in headers

        if (!token) {
            res.json({success: false, message: 'No token provided middle'}); // Return error
        } else {
            // Verify the token is valid
            jwt.verify(token, config.secret, (err, decoded) => {
                // Check if error is expired or invalid
                if (err) {
                    res.json({success: false, message: 'Token invalid: ' + err}); // Return error for token validation
                } else {
                    req.decoded = decoded; // Create global variable to use in any request beyond
                    next(); // Exit middleware
                }
            });
        }
    });

    /* ===============================================================
       Route to get user's profile data
    =============================================================== */
    router.get('/profile', (req, res) => {
        // Search for user in database
        User.findOne({_id: req.decoded.userId}).exec((err, user) => {
            // Check if error connecting
            if (err) {
                res.json({success: false, message: err}); // Return error
            } else {
                // Check if user was found in database
                if (!user) {
                    res.json({success: false, message: 'User not found'}); // Return error, user was not found in db
                } else {
                    res.json({success: true, user: user}); // Return success, send user object to frontend for profile
                }
            }
        });
    });

    /* ===============================================================
       Route to get all organization
    =============================================================== */
    router.get('/getOrganizations', (req, res) => {
        Organization.find({}).select('organizationname').exec((err, allOrgans) => {
            if (err) {
                res.json({success: false, message: err}); // Return error
            } else {
                if (!allOrgans) {
                    res.json({success: false, message: 'We do not have any organizations'}); // Return error, organs was not found in db
                } else {
                    res.json({success: true, organList: allOrgans})
                }
            }
        })
    });

    /* ===============================================================
       Route to get all organization users
    =============================================================== */
    router.get('/getAllOrganizationUsers', (req, res) => {
        // Search for user in database
        User.find({organization: req.decoded.organId}).select('firstname lastname').exec((err, userList) => {
            // Check if error connecting
            if (err) {
                res.json({success: false, message: err}); // Return error
            } else {
                // Check if user was found in database
                if (!userList) {
                    res.json({success: false, message: 'User not found'}); // Return error, user was not found in db
                } else {
                    res.json({success: true, userList: userList}); // Return success, send user object to frontend for profile
                }
            }
        });
    });


    return router; // Return router object to main index.js
};
