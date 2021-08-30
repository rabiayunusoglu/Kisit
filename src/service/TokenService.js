
const TOKEN_KEY = 'access_token'
const USER_TYPE = 'user_type'
const BLOCK_TYPE = 'block_type'
const REFRESH_TOKEN_KEY = 'refresh_token'

const TokenService = {
    getToken() {
        return localStorage.getItem(TOKEN_KEY)
    },
    getUserType() {
        return localStorage.getItem(USER_TYPE)
    },
    getBlockType() {
        return localStorage.getItem(BLOCK_TYPE)
    },
    saveToken(accessToken,userType) {
        localStorage.setItem(TOKEN_KEY, accessToken)
        localStorage.setItem(USER_TYPE, userType)
        
    },
    saveBlockType(block) {
        localStorage.setItem(BLOCK_TYPE, block)
    },
    removeBlock() {
        localStorage.removeItem(BLOCK_TYPE)
    },
    removeToken() {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_TYPE)
    },

    getRefreshToken() {
        return localStorage.getItem(REFRESH_TOKEN_KEY)
    },

    saveRefreshToken(refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
    },

    removeRefreshToken() {
        localStorage.removeItem(REFRESH_TOKEN_KEY)
    }

}

export default TokenService