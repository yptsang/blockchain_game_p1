exports.EXPRESS_SERVER_URL = "http://localhost:3001"
exports.REACT_SERVER_URL = "http://localhost:3000"
exports.DATABASE_HOST = process.env.DB_HOST || "localhost" // maria_db
exports.DATABASE_USER = process.env.MARIADB_USER || "root"
exports.DATABASE_PASSWORD = process.env.MARIADB_PASSWORD || "root"
// exports.DATABASE_PASSWORD = "rootroot"
exports.DATABASE_DB = process.env.MARIADB_DATABASE || "bclp_db"

exports.PASSCODE_EXPIRES_TIME = 1 // 1hour

exports.JWT_SECRET_KEY = "BCLP_82871464-8222-4d5d-92f7-9618a48a7b06" // token key
exports.JWT_EXPIRES_TIME = '1h' // token expires in 1 hour
