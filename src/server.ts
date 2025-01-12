import { app } from './app';
import { config, getLogger } from './app/utils';

const port = config.PORT;

const logger = getLogger({
  layer: 'server',
  function: 'listen',
  port,
});

app.listen(port, (err) => {
  if (err) {
    logger.error(err, 'Could not start server');
    throw err;
  }

  logger.info('Server started up and is running');
});
