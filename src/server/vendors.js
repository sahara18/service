import path from 'path';
import {Router} from 'express';
import vendors from '@config/vendors';

let router = new Router();

for (let {file, url} of vendors) {
  router.get(url, (req, res) => {
    res.sendFile(path.resolve(file));
  });
}

export default router;
