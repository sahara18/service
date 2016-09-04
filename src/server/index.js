import path from 'path';
import express from 'express';

import vendors from './vendors';
import api from './api';
import router from '../router/server';

let app = express();

app.use('/client', express.static(path.join(__dirname, '../client')));
app.use(vendors);
app.use('/api', api);
app.use(router);

let port = 3000;

app.listen(port, () => {
  console.log(`Lifted on http://localhost:${port}`);
});
