import dotenv from 'dotenv';
dotenv.config();

function safeGet(value, name) {
    if (value === undefined || value === null || value === '') {
        throw new Error(`Missing required environment variable: ${name}`);
    }

    return value;
}

const config = {
    PORT: safeGet(process.env.PORT, 'PORT')
};

export default config;
