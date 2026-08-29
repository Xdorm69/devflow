import dotenv from 'dotenv';
dotenv.config();

function safeGet(value: string, name: string) : Error | string {
    if (value === undefined || value === null || value === '') {
        throw new Error(`Missing required environment variable: ${name}`);
    }

    return value;
}

const config = {
    PORT: safeGet(process.env.PORT as string, 'PORT'),
    DATABASE_URL: safeGet(process.env.DATABASE_URL as string, "DATABASE_URL")
};

export default config;
