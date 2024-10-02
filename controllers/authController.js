import userModel from "../models/userModel.js"

export const registerController = async (req, res, next) => {
    const { name, email, password } = req.body
    // validate
    if (!name) {
        next('Name is required')
    }
    if (!email) {
        next('Email is required')
    }
    if (!password) {
        next('Password is required and should be greater than six characters')
    }
    const existingUser = await userModel.findOne({ email })
    if (existingUser) {
        next('Email already registered, please login!')
    }
    const user = await userModel.create({ name, email, password });
    // Token
    const token = user.createJWT();

    res.status(201).send({
        success: true,
        message: 'User created Successfully',
        user: {
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            location: user.location
        }, token
    });

}

export const loginController = async (req, res, next) => {
    const { email, password } = req.body
    // Validation
    if (!email || !password) {
        next('Please provide all fields')
    }
    // Find user by email
    const user = await userModel.findOne({ email }).select('+password');
    // Validation
    if (!user) {
        next('Invalid credentials')
    }
    // Compare Password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        next('Invalid credentials')
    }
    user.password = undefined;
    const token = user.createJWT();
    res.status(200).json({
        success: true,
        message: 'User logged in Successfully',
        user,
        token
    })
};