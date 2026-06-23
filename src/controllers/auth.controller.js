const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authService = require('../services/auth.service');

const SALT_ROUNDS = 12;

function validateRegistrationBody(body) {
	if (!body) {
		return null;
	}

	const { name, email, password } = body;

	if (
		typeof name !== 'string' ||
		typeof email !== 'string' ||
		typeof password !== 'string'
	) {
		return null;
	}

	const normalizedName = name.trim();
	const normalizedEmail = email.trim().toLowerCase();

	if (!normalizedName || !normalizedEmail || !password) {
		return null;
	}

	if (!normalizedEmail.includes('@')) {
		return null;
	}

	if (password.length < 8) {
		return null;
	}

	return {
		name: normalizedName,
		email: normalizedEmail,
		password
	};
}

async function register(req, res) {
	const userData = validateRegistrationBody(req.body);

	if (!userData) {
		return res.status(400).json({
			error: 'name, valid email, and password of at least 8 characters are required'
		});
	}

	const existingUser = await authService.findUserByEmail(userData.email);

	if (existingUser) {
		return res.status(409).json({
			error: 'Email is already registered'
		});
	}

	const passwordHash = await bcrypt.hash(userData.password, SALT_ROUNDS);

	const user = await authService.createUser({
		name: userData.name,
		email: userData.email,
		passwordHash
	});

	res.status(201).json({
		message: 'User registered successfully',
		user
	});
}

function validateLoginBody(body) {
    if (!body) {
        return null;
    }

    const { email, password } = body;

    if (
        typeof email !== 'string' ||
        typeof password !== 'string'
    ) {
        return null;
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
        return null;
    }

    return {
        email: normalizedEmail,
        password
    };
}

async function login(req, res) {
    const loginData = validateLoginBody(req.body);

    if (!loginData) {
        return res.status(400).json({
            error: 'email and password are required'
        });
    }

    const user = await authService.findUserByEmail(loginData.email);

    if (!user) {
        return res.status(401).json({
            error: 'Invalid email or password'
        });
    }

    const passwordMatches = await bcrypt.compare(
        loginData.password,
        user.password_hash
    );

    if (!passwordMatches) {
        return res.status(401).json({
            error: 'Invalid email or password'
        });
    }

    const token = jwt.sign(
        {
            userId: user.id,
            email: user.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || '1h'
        }
    );

    res.json({
        message: 'Login successful',
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    });
}

module.exports = {
	register,
	login	
};
