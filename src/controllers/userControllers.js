import User from '../models/userModel.js';
import cryptoHash from 'crypto';
import { signUpValidator, signInValidator } from '../validators/authValidators.js';
import { formatZodError } from '../../errorMessage.js';
import main from '../../server.js'; 
import { generateToken } from '../utils/jwt.js';

const hashValue = (value) => {
    const hash = cryptoHash.createHash('sha256');
    hash.update(value);
    return hash.digest('hex');
};

const comparePasswords = (inputPassword, hashedPassword) => {
    return hashValue(inputPassword) === hashedPassword;
};

export const signUp = async (req, res) => {
    const registerResults = signUpValidator.safeParse(req.body)
    if (!registerResults) {
        return res.status(400).json(formatZodError(registerResults.error.issues))
    }
    try {
        const { email}=req.body 
        const user = await User.findOne({for:[{email}]})
        if (user) {
            res.status(409).json({messaage:'User with email already exists'})
        } else {
            const {
                firstName,
                lastName,
                password,
                email,
            } = req.body
   
            const encryption = hashValue(password)
            const newUser = new User({
                firstName,
                lastName,
                password: encryption,
                email,
            })
            await newUser.save()
            res.status(200).json({message: 'User registered succesfully',newUser})
            console.log('User registered succesfully',newUser);
        }
    } catch (error) {
        res.status(500).json({message: error.message})
        console.log('INTERNAL SERVER ERROR',error.message)
    }
}




export const signIn = async (req, res, next) => {
    const loginResults = signInValidator.safeParse(req.body);
    if (!loginResults.success) {
        return res.status(400).json(formatZodError(loginResults.error.issues));
    } 
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User with email not found' });
        }
        
        const comparePass = comparePasswords(password, user.password);
        if (!comparePass) {
            console.log({ message: 'Password is incorrect' });
            return({})
        }
        
        
        const accessToken = generateToken(user._id, user.name);
        

        user.token = accessToken;
        await user.save();
        main.io.emit('user-login', { userId: user._id, name: user.name, email: user.email });

        // Send response with token
        console.log('Login   successful', user, accessToken);
        return res.json({ accessToken });
        

    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log('INTERNAL SERVER ERROR', error.message);
    }
};


export const getUserProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId, 'name email');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Log the user ID and user data
        console.log(`User ID: ${userId}, User Data: ${JSON.stringify(user)}`);
        return res.json({ user })

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
        console.error('Internal server error:', error);
    }
};




// export const logout = async (req, res, next) => {
//     // Implement logout logic here if needed
// };

export default { signUp, signIn, getUserProfile };
