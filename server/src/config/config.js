import dotenv from 'dotenv'
dotenv.config()

const config={
    MONGO_URL:process.env.MONGO_URL,
    ACCESS_TOKEN:process.env.ACCESS_TOKEN,
    REFRESH_TOKEN:process.env.REFRESH_TOKEN,
    PORT:process.env.PORT,
    CLIENT_URL:process.env.CLIENT_URL
}

export default config