import {Router} from 'express';

export default new Router()
  .use('/test', (req, res) => {
    res.json({test: 'message'});
  });
