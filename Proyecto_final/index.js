import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let app = express();

app.use( express.static( __dirname + '/public' ));

app.get('/main', function(req, res) {
    res.sendFile(__dirname + '/main.html');
});

app.listen(8080, function(){
    console.log('Express ercver started')
    console.log(__dirname)
});