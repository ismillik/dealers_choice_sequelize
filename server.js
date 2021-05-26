const express = require('express');
const app = express();
const db = require('./db');
// const morgan = require('morgan');
const path = require('path');
const { models: { Composer, Director, Film} } = db;

// app.use(morgan('dev'));

// app.get('/', (req, res, next)=> res.sendFile(path.join(__dirname, 'index.html')));

app.get('/', async (req,res,next)=> {
    const composers = await Composer.findAll();
    
    const html = `
    <!DOCTYPE html>
    <html>
        <head>
            <title>An Inexhaustive List of Film Composers</title>
            <!-- <link rel="stylesheet" href="/style.css" /> -->
        </head>
        <body>
            <h1>An Inexhaustive List of Film Composers</h1>
            <ul>
                ${
                    composers.map((composer) => `<li><a href='/composer/${composer.id}'>${composer.name}</a></li>`).join('')
                }
            </ul>
        </body>
    </html>
    `
    res.send(html);
});


app.get ('/composer/:id', async (req, res, next) => {
    try {
        const composer = await Composer.findByPk(req.params.id);
        const films = await composer.findFilms();
        console.log(films);

        const html = `
        <!DOCTYPE html>
        <html>
            <head>
                <title>${composer.name}</title>
                <!-- <link rel="stylesheet" href="/style.css" /> -->
            </head>
            <body>
                <h3><a href ='/'>${composer.name}</a></h3>
                <ul>
                    ${
                        films.map((film) => `<li>${film.title}, directed by ${film.director.name}</li>`).join('')
                    }
                </ul>
            </body>
        </html>
        `

        res.send(html); 
    }
    catch (err) {
        next(err);
    }
});

const setUp = async() => {
    try {
        await db.syncAndSeed();
    }
    catch(err) {
        console.log(err);
    }
};

setUp();

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));