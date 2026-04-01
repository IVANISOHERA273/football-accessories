const bcrypt = require('bcrypt');

const password = 'loulou1234'; // Example plain text password
const hashedPassword = '$2b$10$kQpba7kGjkXrEBxOWGdYKeT0Je340gvqntTEwbZIXvsNyb.76/U.W'; // Example hashed password from DB

console.log('Original password:', password);
console.log('Hashed password from DB:', hashedPassword);

bcrypt.compare(password, hashedPassword, (err, result) => {
    if (err) {
        console.error('Error comparing passwords:', err);
    } else {
        console.log('Password match:', result); // Should print true if passwords match
    }
});