import _  from "lodash";
import passport from 'passport';
import passportJWT from "passport-jwt";
import Local from 'passport-local';
import models from '../../models';
import passwordHash from 'password-hash';

const User = models.user;
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

passport.serializeUser((user, done) =>{
	done(null, user);
});

passport.deserializeUser((user, done) => {
	User.findOne({where: {username: user.username}}).then(user => {
		done(null, user);
	}).catch(user =>{
		done(err, null)
	});
});

passport.use(new Local.Strategy((username, password, done)=>{
	User.findOne({where: {username: username}}).then(user => {
		let hashedPassword = user ? user.password : '';
		if ( passwordHash.verify(password, hashedPassword) ) {
		  	return done(null, user);
		} else {
		  	return done(null, false, {message: 'Неверный пароль'});
		}
	});
}));

const jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
jwtOptions.secretOrKey = 'fjkgsejgraehguORshsfouHIHDZK';

passport.use(new JwtStrategy(jwtOptions, (jwt_payload, next) => {
	console.log("-----------------------------------------------------");
	console.log(jwt_payload.id);
  	User.findOne({where: {id: jwt_payload.id}}).then(user => {
  		if (user) {
  		  	next(null, user);
  		} else {
  		  	next(null, false);
  		}
	});
}));

export default passport;