import api from "./api";

const googleCalendarApi = {
    // Redirect to backend OAuth endpoint
    initiateGoogleLogin() {
        console.log("🔄 Initiating Google Login...");

        const backendBaseURL = process.env.REACT_APP_API_URL ;
        const oauthUrl = `${backendBaseURL}/google-calendar/login`;


        // Save current location to return after OAuth
        localStorage.setItem('googleOAuthReturnUrl', window.location.pathname);
        window.location.href = oauthUrl;
    },

    handleOAuthCallback() {
        const urlParams = new URLSearchParams(window.location.search);
        // Check for OAuth error
        const oauthError = urlParams.get('oauth');
        if (oauthError === 'error') {
            const message = urlParams.get('message');
            console.error("❌ OAuth Error:", message);
            throw new Error(`OAuth Error: ${message}`);
        }

        // ✅ Get tokens directly from URL (your backend sends these)
        const accessToken = urlParams.get('accessToken');
        const refreshToken = urlParams.get('refreshToken');
        const expiresIn = urlParams.get('expiresIn');

        if (accessToken && refreshToken) {
            
            const tokens = {
                accessToken: accessToken,
                refreshToken: refreshToken,
                expiresIn: parseInt(expiresIn),
                expiresAt: Date.now() + (parseInt(expiresIn) * 1000)
            };

            this.storeTokens(tokens);
            
            // Clean up URL (remove tokens from URL bar)
            window.history.replaceState({}, document.title, window.location.pathname);
            
            return tokens;
        }

        return null;
    },

    storeTokens(tokens) {
        if (!tokens.accessToken) {
            throw new Error("No access token received");
        }

        localStorage.setItem('googleCalendarTokens', JSON.stringify(tokens));
    },

    getStoredTokens() {
        try {
            const tokens = localStorage.getItem('googleCalendarTokens');
            return tokens ? JSON.parse(tokens) : null;
        } catch (error) {
            return null;
        }
    },

    isTokenExpired(tokens) {
        if (!tokens || !tokens.expiresAt) return true;
        // Add 5 minute buffer to refresh before actual expiry
        return Date.now() >= (tokens.expiresAt - 300000);
    },

    async getValidAccessToken() {
        let tokens = this.getStoredTokens();
        if (!tokens) {
            throw new Error('No tokens found. Please connect Google Calendar first.');
        }

        if (this.isTokenExpired(tokens)) {
            const newTokens = await this.refreshAccessToken(tokens.refreshToken);
            
            // Merge with existing tokens (keep refreshToken if not returned)
            tokens = {
                ...tokens,
                accessToken: newTokens.accessToken,
                expiresIn: newTokens.expiresIn,
                expiresAt: Date.now() + (newTokens.expiresIn * 1000)
            };
            
            this.storeTokens(tokens);
        }

        return tokens.accessToken;
    },

    async refreshAccessToken(refreshToken) {
        try {
            const response = await api.post(`/google-calendar/refresh-token`, { 
                refreshToken: refreshToken 
            });
            
            return {
                accessToken: response.data.accessToken,
                expiresIn: response.data.expiresIn
            };
        } catch (error) {
            // Clear invalid tokens
            localStorage.removeItem('googleCalendarTokens');
            throw new Error('Token refresh failed. Please reconnect Google Calendar.');
        }
    },

    async getGoogleEvents(accessToken) {
        try {
            const response = await api.post(`/google-calendar/events`, {
                accessToken: accessToken
            });
            return response.data || [];

        } catch (error) {

            if (error.response) {
                console.error("Backend error:", {
                    status: error.response.status,
                    data: error.response.data,
                    url: error.config?.url
                });
                
                // Handle 401 Unauthorized
                if (error.response.status === 401) {
                    localStorage.removeItem('googleCalendarTokens');
                    throw new Error('Google Calendar authorization expired. Please reconnect.');
                }
            } else if (error.request) {
                throw new Error('Failed to connect to backend server');
            } else {
            }
            
            throw error;
        }
    },

    // Disconnect/logout
    disconnect() {
        localStorage.removeItem('googleCalendarTokens');
        localStorage.removeItem('googleOAuthReturnUrl');
    }
};

export default googleCalendarApi;