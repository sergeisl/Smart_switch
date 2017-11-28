import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'cookie-session';
import { serverPort } from '../etc/config.json';
import jwt from 'jsonwebtoken';
import passport from './passport/login';
import * as register from './passport/register';
import * as device from './utils/DataBaseDevises';
import * as db from './utils/DataBaseUtils';
import * as wall from './utils/DataBaseWall';
import models from '../models';
import passportJWT from 'passport-jwt';
import multer from 'multer';
import fs from 'fs';
import routes from './routes'

const User = models.user;
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
var storage = multer.diskStorage({
    destination: function (request, file, callback) {
        callback(null, './avatar/');
    },
    filename: function (request, file, callback) {
        console.log(file);
        callback(null, file.originalname);
    }
});
const jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
jwtOptions.secretOrKey = 'fjkgsejgraehguORshsfouHIHDZK';

const app = express();
    app.use(bodyParser());
    app.use(cookieParser());
    app.use(session({keys: ['secret']}));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use( cors({ origin: '*' }) );
const checkAuthenticated = (req, res, next) => {
	req.isAuthenticated() ? next() : res.redirect('/');
};
const checkNOTAuthenticated = (req, res, next) => {
	req.isAuthenticated() ? res.redirect('/') : next();
};

app.all('/user', checkAuthenticated);
app.all('/user/*', checkAuthenticated);
app.all('/login', checkNOTAuthenticated);

const auth = passport.authenticate(
	'local',{ session: false });
app.all('/',(req, res) => {
	return res.sendStatus(200).send('OK');
});
app.post('/login', auth, (req, res) => {
    let payload = {id: req.user.id};
    let token = jwt.sign(payload, jwtOptions.secretOrKey);
    res.json({
        user: req.user,
        token: token
    });
});

app.post('/register', (req, res) => {
    register.register(req, res);
});

app.post('/device', passport.authenticate('jwt', { session: false }), (req, res) => {
    device.addDevice(req.body,req.user.id).then(data => res.send(200))
    .catch(err => {
        console.log('Database error: ' + err);
        return res.sendStatus(500);
    });
});

app.get("/avatar/:id",(req, res) => {
	let url = './avatar/'+req.params.id;
	let file = fs.createReadStream(url);
    file.pipe(res);
});

var upload = multer({storage: storage}).single('photo');

app.post('/avatar',passport.authenticate('jwt', { session: false }), (req, res) => {

    upload(req, res, function(err) {
        if(err) {
            console.log('Error Occured');
            return;
        }
        console.log(req.file.originalname);
        res.end('Your File Uploaded');
        console.log('Photo Uploaded');
        db.updateAvatar(req.file.originalname,req.user.id).then(data => res.send(data))
        .catch(err => {
            console.log('Database error: ' + err);
            return res.sendStatus(500);
        });
    })

});

app.post("/status", passport.authenticate('jwt', { session: false }), (req, res) => {
	db.updateStatus(req.body,req.user.id).then(data => res.send(200))
    .catch((err) => {
	  	console.log('Database error: ' + err);
	  	return res.sendStatus(500);
    });
});

app.get("/devices", passport.authenticate('jwt', { session: false }), (req, res) => {
	device.getDevices(req.user.id).then(data => res.send(data))
    .catch((err) => {
	  	console.log('Database error: ' + err);
	  	return res.sendStatus(500);
    });
});

app.post('/swichDevice', passport.authenticate('jwt', { session: false }), (req, res) => {
	device.swichDevice(req.body,req.user.id).then(() => {
        device.getDevices(req.user.id).then(data => res.send(data)).catch((err) => {
            console.log('Database error: ' + err);
            return res.sendStatus(500);
        });
    }).catch((err) => {
		    console.log('Database error: ' + err);
		    return res.sendStatus(500);
	});
});

app.post('/deviceDelete', passport.authenticate('jwt', { session: false }), (req, res) => {
	device.deviceDelete(req.body,req.user.id).then(() => {
        device.getDevices(req.user.id).then(data => res.send(data)).catch((err) => {
            console.log('Database error: ' + err);
            return res.sendStatus(500);
        });
		}).catch((err) => {
		console.log('Database error: ' + err);
		return res.sendStatus(500);
	});
});

app.post('/deviceDragAndDrop', passport.authenticate('jwt', { session: false }), (req, res) => {
	req.body.map((data) =>{
		device.deviceDragAndDrop(data);
	});
});

app.get('/check', passport.authenticate('jwt', { session: false }), (req, res) => {
    console.log(req.body);
	db.getCheck(req.body).then(data => res.send(data.make))
	.catch((err) => {
		console.log('Database error: ' + err);
		return res.sendStatus(500);
	});
});

app.get('/user', (req, res) => {
    let payload = {id: req.user.id};
    let token = jwt.sign(payload, jwtOptions.secretOrKey);
    res.cookie('token',token,);
    res.send(200, 'Hello, ' + req.user.username);
});

app.get("/user_secret", passport.authenticate('jwt', { session: false }), (req, res) => {
	res.send(req.user);
});

app.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

app.get('/tasks/', passport.authenticate('jwt', { session: false }), (req, res) => {
    db.listTasks().then(data => res.send(data))
    .catch((err) => {
	  	console.log('Database error: ' + err);
	  	return res.sendStatus(500);
		});
});

app.get("/deviceCheck/", (req, res) => {
	console.log(req.params.pin)
	device.getDevice(1).then(data => res.send(data[0].status))
    .catch((err) => {
	  	console.log('Database error: ' + err);
	  	return res.sendStatus(500);
		});
});

app.post('/wallDelete', passport.authenticate('jwt', { session: false }), (req, res) => {
	wall.deleteWall(req.body.id).then(() => {
        wall.listWall(req.user.id).then(data => res.send(data)).catch((err) => {
	  	    console.log('Database error: ' + err);
	  	    return res.sendStatus(500);
		});
		}).catch((err) => {
		console.log('Database error: ' + err);
		return res.sendStatus(500);
	});
});

app.get("/wall", passport.authenticate('jwt', { session: false }), (req, res) => {
	wall.listWall(req.user.id).then(data => res.send(data))
    .catch((err) => {
	  	console.log('Database error: ' + err);
	  	return res.sendStatus(500);
		});
});

app.post('/wall', passport.authenticate('jwt', { session: false }), (req, res) => {
    wall.addWall(req.body,req.user.id).then(() => {
        wall.listWall(req.user.id).then(data => res.send(data)).catch((err) => {
	  	    console.log('Database error: ' + err);
	  	        return res.sendStatus(500);
        });
    }).catch((err) => {
		    console.log('Database error: ' + err);
		    return res.sendStatus(500);
	});
});

app.post('/updateuser', passport.authenticate('jwt', { session: false }), (req, res) => {
    db.UpDateUser(req.body,req.user.id).then(data => res.send(200))
    .catch(err => {
        console.log('Database error: ' + err);
        return res.sendStatus(500);
	});
});

const server = app.listen(serverPort, () => {
    console.log(`Server running on port ${serverPort}`);
});

