const express = require('express');
const serveIndex = require('serve-index');
const open = require('open');
const pressAnyKey = require('press-any-key');

const app = express();
const PORT = 3000;

app.use('/dist', express.static('./dist'));
app.use('/examples', express.static('./examples'));
app.use('/node_modules', express.static('./node_modules'));
app.use('/examples', serveIndex('./examples', {
    filter: filename => {
        return filename.slice(-5) === '.html';
    }
    , view: 'details'
}));

app.get('/', (_, res) => { res.redirect('/examples'); });

app.listen(PORT, () => {
    const url = `http://localhost:${PORT}`;

    console.log(`Open ${url} in your browser to view the RIsland examples.`);

    pressAnyKey('Or press any key to open it automatically.').then(() => {
        open(url);
    });
});
