import axios from 'axios';

// Define interfaces
/**
 * @typedef {Object} LoginResponse
 * @property {string} message
 * @property {string} user
 * @property {string} full_name
 * @property {string} home_page
 */

/**
 * @typedef {Object} GenerateKeysResponse
 * @property {Object} message
 * @property {string} message.api_key
 * @property {string} message.api_secret
 */

/**
 * @typedef {Object} UserDocResponse
 * @property {Object} data
 * @property {string} data.api_key
 * @property {string} data.api_secret
 */

// Site name and URL
const siteName = 'test1-site';
const sitePort = 8000; // Confirm the port Frappe/ERPNext is running on
const siteUrl = `http://localhost:${sitePort}`;
const username = 'Administrator';
const password = 'test';

// User's email address
const userEmail = 'Administrator'; // Using the default admin username

// Define function to get API key and API secret
async function getApiKeys() {
    try {
        // Login request
        console.log(`Attempting to login at ${siteUrl}/api/method/login`);
        const loginResponse = await axios.post(`${siteUrl}/api/method/login`, {
            usr: username,
            pwd: password,
        }, {
            headers: {
                'X-Frappe-Site-Name': siteName,
            },
        });

        /** @type {LoginResponse} */
        const loginData = loginResponse.data;
        console.log('Login Response:', loginData);

        if (loginData.message !== 'Logged In') {
            throw new Error('Login failed');
        }

        // Get API key and API secret
        console.log(`Attempting to get user info at ${siteUrl}/api/resource/User/${userEmail}`);
        const userDocResponse = await axios.get(`${siteUrl}/api/resource/User/${userEmail}`, {
            headers: {
                'Cookie': (loginResponse.headers['set-cookie'] || []).join('; '),
                'X-Frappe-Site-Name': siteName,
            },
        });

        /** @type {UserDocResponse} */
        const userData = userDocResponse.data;
        console.log('User Doc Response:', userData);

        let { api_key, api_secret } = userData.data;

        // If API key or API secret does not exist, generate new ones
        if (!api_key || !api_secret) {
            console.log(`Attempting to generate API keys at ${siteUrl}/api/method/frappe.core.doctype.user.user.generate_keys`);
            const generateKeysResponse = await axios.post(`${siteUrl}/api/method/frappe.core.doctype.user.user.generate_keys`, {
                user: userEmail,
            }, {
                headers: {
                    'Cookie': (loginResponse.headers['set-cookie'] || []).join('; '),
                    'X-Frappe-Site-Name': siteName,
                },
            });

            /** @type {GenerateKeysResponse} */
            const generateKeysData = generateKeysResponse.data;
            console.log('Generate Keys Response:', generateKeysData);

            api_key = generateKeysData.message.api_key;
            api_secret = generateKeysData.message.api_secret;
        }

        console.log(`API Key: ${api_key}`);
        console.log(`API Secret: ${api_secret}`);
    } catch (error) {
        if (error.response) {
            console.error('Error:', error.response.status, error.response.statusText);
            console.error('Error Response Data:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
}

// Execute function
getApiKeys();
