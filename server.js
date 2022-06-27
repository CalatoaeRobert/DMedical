// const express = require('express');
// const app = express ();

// const path = require('path')

// const port = process.env.PORT || 5000;

// if (process.env.NODE_ENV === 'production'){
//     app.use(express.static('build'));
//     app.get('*', (req, res) => {
//         req.sendFile(path.resolve(__dirname, 'build', 'index.html'));
//     })
// }

// app.listen(port, (err) => {
//     if (err) return console.log(err);
//     console.log('Server running on port ', port);
// })

const express = require('express');
const path = require('path');

const app = express();

const forceSSL = function() {
    return function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '');
        if (req.headers['x-forwarded-proto'] !== 'https') {
            return res.redirect(
                ['https://', req.get('Host'), req.url].join('')
            );
        }
        next();
    }
}

app.use(forceSSL());

app.use(express.static(__dirname + '/build'));

app.get('/', function(req,res) {
    res.sendFile(path.join(__dirname+'/build/index.html'));
});

app.listen(process.env.PORT || 8080);