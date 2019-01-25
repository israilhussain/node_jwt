const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.get('/api', (req, res) => {
	res.json({
		'message': 'Welcome to api'
	})
})

app.post('/api/posts', verifyToken, (req, res) => {

	console.log('req.token', req.token)

	jwt.verify(req.token, 'secretkey', function(err, authData) {

		if (err) {
			res.sendStatus(403)
		}else {
			res.json({
				'message': 'Post created...',
				authData,
			})
		}
    });
	
})

app.post('/api/login', (req, res) => {
	//Mock user
	const user = {
		id: 101,
		usename: 'Israil',
		email: '23israil@gmail.com'
	}

	//jwt.sign({payload:user}, 'secretkey', (err, token) => {})
	jwt.sign({user: user}, 'secretkey', { expiresIn: '30s' }, (err, token) => {
		res.json({
			token: token
		})
	})
})

function verifyToken(req, res, next) {
	const bearerHeader = req.headers['authorization'];
	if (typeof bearerHeader !== 'undefined') {

		const bearer = bearerHeader.split(' ');
		const bearerToken = bearer[1];

		req.token = bearerToken;

		next();

	} else {
		res.sendStatus(403);
	}
}

app.listen(5000, () => console.log('Server started at 5000'))