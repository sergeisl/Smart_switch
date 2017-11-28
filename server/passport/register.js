import models from '../../models';
import passwordHash from 'password-hash';

const User = models.user;

export function register(req, res){
		User.findOne({where: {username: req.body.username}}).then(user => {
		if(!user) {
			console.log(req.body.username);
			User.create({
				username: req.body.username, 
				password: passwordHash.generate(req.body.password),
				email: req.body.email,
				gender: req.body.gender,
				address: req.body.address
			}).then(() => {
				res.send(200, 'Hello, ' + req.body.username);
			}).catch(err => {
				console.log(err);
			});
		} else {
			res.send(409, 'Имя ' + req.body.username + ' занято');
		}
	});
};