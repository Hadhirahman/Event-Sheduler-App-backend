


const isValidTime = (str) => {

    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return regex.test(str);
};



const validateEvent = (eventData) => {

    const { title, date, startTime, endTime, venue, description } = eventData;


    if (!title || typeof title !== 'string') {
        throw new Error('Invalid or missing title');
    }
    if (!date || isNaN(Date.parse(date))) {
        throw new Error('Invalid or missing date');
    }
    if (!startTime || typeof startTime !== 'string' || !isValidTime(startTime)) {

        throw new Error('Invalid or missing startTime');
    }
    if (!endTime || typeof endTime !== 'string' || !isValidTime(endTime)) {
        throw new Error('Invalid or missing endTime');
    }
    if (venue && typeof venue !== 'string') {
        throw new Error('Invalid venue');
    }
    if (description && typeof description !== 'string') {
        throw new Error('Invalid discription');
    }
    return true;
}

const validateSignup = (userData) => {
    const { name, email, password } = userData;
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!name || typeof name !== 'string') {
        throw new Error('Invalid or missing Name');
    }   
    if (!email || typeof email !== 'string' || !/\S+@\S+\.\S+/.test(email)) {
        throw new Error('Invalid or missing Email');
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
        throw new Error('Invalid or missing password');

    }else if (!strongPasswordRegex.test(password)) {
        throw new Error('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
    }
    return true;
    
}

module.exports = { validateEvent, validateSignup };