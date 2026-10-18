const fetch = require("node-fetch");

let expoTokens = []; // In production, use a DB

// Store token from client
const registerToken =  (req, res) => {
  const { token } = req.body;
  if (token && !expoTokens.includes(token)) {
    expoTokens.push(token);
    console.log("Registered token:", token);
  }
  res.sendStatus(200);
};


// Send push notification to all registered tokens
const sendPushNotification = async (req, res) => {
        const { title, body } = req.body;
      
        const messages = expoTokens.map(token => ({
          to: token,
          sound: 'default',
          title: title || '📰 News Update',
          body: body || 'Check out the latest headlines!',
        }));
      
        try {
          const response = await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Accept-Encoding': 'gzip, deflate',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(messages),
          });
      
          const data = await response.json();
          console.log('Notification sent:', data);
          res.json({ success: true, data });
        } catch (error) {
          console.error('Failed to send notification:', error);
          res.status(500).json({ success: false });
        }
      };

module.exports = {
    registerToken,
    sendPushNotification,
    };