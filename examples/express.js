const express = require('express');
const serveIndex = require('serve-index');

const app = express();
const PORT = 3000;

app.use('/dist', express.static('./dist'));
app.use('/examples', express.static('./examples'));
app.use('/examples', serveIndex('./examples'));

app.get('/', (_, res) => { res.redirect('/examples'); });

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
