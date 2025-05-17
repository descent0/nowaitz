const passport = require('passport');
const User = require('../model/user.model');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
console.log('Google Strategy Initialized');
const dotenv = require('dotenv');
dotenv.config(); 



passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: "http://localhost:5002/api/auth/google/callback"
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                console.log('Access Token:', accessToken);
                console.log('Profile ID:', profile.id);
                console.log('Profile Name:', profile.displayName);
                console.log('Profile Email:', profile.emails?.[0]?.value);
                console.log('Profile Picture:', profile.photos?.[0]?.value);

                // Check if the user exists in the database
                let user = await User.findOne({ googleId: profile.id });
                console.log('User found in DB:', user);

                if (!user) {
                    console.log('Creating a new user...');
                    user = await new User({
                        googleId: profile.id,
                        name: profile.displayName,
                        email: profile.emails?.[0]?.value,
                        profilePicture: profile.photos?.[0]?.value
                    }).save();
                    console.log('New User Created:', user);
                }

                done(err, user);
            } catch (err) {
                console.error('Error in Google Strategy:', err);
                
                done(err, null);
            }
        }
    )
);

// Serialize user
passport.serializeUser((user, done) => {
    console.log('Serializing User:', user.id);
    done(null, user.id);
});

// Deserialize user
passport.deserializeUser((id, done) => {
    console.log('Deserializing User ID:', id);
    User.findById(id)
        .then(user => {
            console.log('User Found During Deserialization:', user);
            done(null, user);
        })
        .catch(err => {
            console.error('Error During Deserialization:', err);
            done(err, null);
        });
});
