var webPush = require('web-push');
const vapidKeys = {
    "publicKey": "BGaUKy5v9WBTPaO22cH1QDQB-cfWlIMNUCyajDm17Dl8qRb0xWuZC8rak8Oyx9fB2i-ugZFHA566m8mbb1cWG-0",
    "privateKey": "1Oe-uwSEIJB-ahkB4STAEAn2BbdVnYtvsGh3USQbkls"
};
 
 
webPush.setVapidDetails(
    'mailto:example@yourdomain.org',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)
var pushSubscription = {
    "endpoint": "https://fcm.googleapis.com/fcm/send/c2V5kNOLeF0:APA91bFv1xM5vDwmGTF-PTZxhdMWoXAQkV5j9Z9ild7Uttb9W1nznPwIi5LCkhMz09DxskLUCDHshdEbo37oMQKlFaDRWHeAvt-ao0bu6XbI8XAGeDybKRbynGFjw9yRgN899CKmxe7D",
    "keys": {
        "p256dh": "BJtAM0moDjuTjE0jf7ZgwuDSypmtMtdffe0c4vbAyWHoCQDWgqzfvM9tAU5qh5RUZ54vfbvubv+5tnFxoDMV8YQ=",
        "auth": "QW6PEKwaYlKgeliW3i0O9A=="
    }
};
var payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';
var options = {
    gcmAPIKey: '159503372453',
    TTL: 60
};
webPush.sendNotification(
    pushSubscription,
    payload,
    options
).catch(function(err){
console.log(err);
});