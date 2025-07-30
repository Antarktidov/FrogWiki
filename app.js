const express = require('express');
const app = express();
const port = 3000;
const { mongoose } = require('mongoose');
const ejs = require('ejs');
const path = require('path');

mongoose.connect('mongodb://localhost:27017/frogwikic');

const Article = require('./models/article');

app.set('view engine', 'ejs');

const createPath = (page) => path.resolve(__dirname, 'views', `${page}.ejs`);

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/create', function(req, res) {
    res.render(createPath('create-article'));
});

app.post('/create', function(req, res) {
    const article = new Article({
        url_title: req.body.url_title,
        title: req.body.title,
        revisions: [],
    });
    article.revisions.push({
        content: req.body.text,
        author_ip: req.ip,
    });
    article.save();

    res.send('Статья сохранена');
});

app.get('/', async (req, res) => {
    try {
        const articles = await Article.find();
        res.render(createPath('index'), {articles});
    } catch (error) {
        console.error('Error fetching articles:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/article/:url_title', async (req, res) => {
    try {
        const url_title = req.params.url_title;
        const article = await Article.findOne({
            url_title: url_title,
        }).lean();
        console.log(`Информация о сатье: ${JSON.stringify(article)}`);
        res.render(createPath('article'), {article});
    } catch (error) {
        console.error('Error fetching article:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/edit-article/:url_title', async (req, res) => {
    try {
        const url_title = req.params.url_title;
        const article = await Article.findOne({
            url_title: url_title,
        }).lean();
        console.log(`Информация о сатье: ${JSON.stringify(article)}`);
        res.render(createPath('edit-article'), {article});
    } catch (error) {
        console.error('Error fetching article:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/edit-article/:url_title', async (req, res) => {
    try {
        const url_title = req.params.url_title;
        const article = await Article.findOneAndUpdate(
            { url_title: url_title },
            {
                $push: {
                    revisions: {
                        content: req.body.text,
                        author_ip: req.ip,
                    }
                }
            },
            { new: true }
        );
        res.send('Статья обновлена');
    } catch (error) {
        console.error('Error updating article:', error);
        res.status(500).send('Internal Server Error');
    }
} );

app.get('/article-history/:url_title', async (req, res) => {
    try {
        const url_title = req.params.url_title;
        const article = await Article.findOne({
            url_title: url_title,
        }).lean();
        console.log(`Информация о сатье: ${JSON.stringify(article)}`);
        res.render(createPath('history'), {article});
    } catch (error) {
        console.error('Error fetching article:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port);