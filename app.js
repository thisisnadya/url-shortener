const express = require('express');
const app = express();
const ShortUrl = require('./models/urlShort');
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended : true}));

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/urlShortener', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find();
    res.render('index', { shortUrls });
});

app.post('/shortUrls', async (req, res) => {
    await ShortUrl.create({
        full: req.body.fullUrl
    });
    res.redirect('/');
});

app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({short : req.params.shortUrl});

    if(shortUrl == null) {
        return res.send(404);
    }
    shortUrl.click++;
    shortUrl.save();

    res.redirect(shortUrl.full);
});

app.listen(port, () => {
    console.log(`URL Shortener listening on port http://localhost:${port}`);
});