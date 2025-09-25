exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { password } = JSON.parse(event.body);
        const correctPassword = process.env.DASHBOARD_PASSWORD;

        if (password === correctPassword) {
            // Generate a simple session token
            const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
            
            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'POST'
                },
                body: JSON.stringify({
                    success: true,
                    token: token
                })
            };
        } else {
            return {
                statusCode: 401,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    success: false,
                    message: 'Invalid password'
                })
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ error: 'Server error' })
        };
    }
};