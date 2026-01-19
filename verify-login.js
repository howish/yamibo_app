const axios = require('axios');
const FormData = require('form-data');
const iconv = require('iconv-lite');

const USERNAME = '番茄牛奶糖';
const PASSWORD = 'tomatocandy';
const BASE_URL = 'https://bbs.yamibo.com/api/mobile/index.php';

async function verifyLogin() {

    const tryLogin = async (encoding) => {
        console.log(`\n--- Trying with ${encoding} encoding ---`);
        let usernameEncoded = USERNAME;
        if (encoding === 'GBK') {
            usernameEncoded = iconv.encode(USERNAME, 'gbk');
        }

        try {
            // Step 1: Get Formhash
            console.log('Step 1: Fetching formhash for cookie...');
            const initResponse = await axios.get(BASE_URL, {
                params: { module: 'login', version: 4 },
                headers: { 'User-Agent': 'YamiboApp/1.0' }
            });
            const cookieHeader = initResponse.headers['set-cookie'];

            // Step 2: Login
            console.log('Step 2: Submitting credentials...');
            const formData = new FormData();
            formData.append('username', usernameEncoded); // Buffer if GBK
            formData.append('password', PASSWORD);

            const response = await axios.post(BASE_URL, formData, {
                params: {
                    module: 'login',
                    loginsubmit: 'yes',
                    loginfield: 'username',
                    version: 4
                },
                headers: {
                    ...formData.getHeaders(),
                    'User-Agent': 'YamiboApp/1.0',
                    'Cookie': cookieHeader
                },
                responseType: 'arraybuffer' // To handle potential GBK response
            });

            // Decode response
            const strResponse = iconv.decode(response.data, 'utf-8');
            let data;
            try {
                data = JSON.parse(strResponse);
            } catch (e) {
                console.log('Failed to parse JSON response:', strResponse.substring(0, 100));
                return false;
            }

            if (data && data.Variables && data.Variables.member_uid && data.Variables.member_uid !== '0') {
                console.log('✅ Login Successful!');
                console.log('User ID:', data.Variables.member_uid);
                console.log('Username:', data.Variables.member_username);
                console.log('Auth Token:', data.Variables.auth);
                return true;
            } else {
                console.log('❌ Login Failed:', data.Message);
                return false;
            }
        } catch (error) {
            console.error('❌ Request Failed:', error.message);
            return false;
        }
    };

    // Try UTF-8 first
    if (!await tryLogin('UTF-8')) {
        // Try GBK if UTF-8 fails
        await tryLogin('GBK');
    }
}

verifyLogin();
