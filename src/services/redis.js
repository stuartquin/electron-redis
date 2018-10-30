const bluebird = window.require('bluebird');
const redis = window.require('redis');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

// Mapping of HOST:PORT to client
const clients = {
};

const promisify = (client, cmd, args) => {
  return new Promise((resolve, reject) => {
    client[cmd](args, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const zipKeys = (list, size) => {
  return list.reduce((keys, value) => {
    if (keys.length && keys[keys.length - 1].length < size) {
      keys[keys.length - 1].push(value);
    } else {
      keys.push([value]);
    }

    return keys;
  }, []);
};

const getScanArguments = (pattern = null, start = 0, count = 100) => {
  let args = [start];
  if (pattern) {
    args = args.concat(['MATCH', `*${pattern}*`]);
  }
  return args.concat(['COUNT', count]);
};

export const getClient = (host) => {
  clients[host] = clients[host] || redis.createClient();
  return clients[host];
};

export const getKeys = async (pattern = null, start = 0, count = 100) => {
  const client = getClient('localhost');

  const reply = await promisify(
    client,
    'scan',
    getScanArguments(pattern, start, count)
  );
  return reply[1];
};

export const getKeyInfo = async (key) => {
  const client = getClient('localhost');
  const result = await client.multi().type(
    key
  ).ttl(
    key
  ).execAsync();

  return {
    key,
    type: result[0],
    ttl: result[1],
  };
};

const getHashKeys = async (client, key, pattern) => {
  const reply = await promisify(
    client,
    'hscan',
    [key, ...getScanArguments(pattern, 0, 100)]
  );
  return zipKeys(reply[1], 2);
};

const getZSetKeys = async (client, key, pattern) => {
  const reply = await promisify(
    client,
    'zscan',
    [key, ...getScanArguments(pattern, 0, 100)]
  );
  return zipKeys(reply[1], 2);
};

export const getKeyValue = async (key, type, pattern = null) => {
  const client = getClient('localhost');

  if (type === 'string') {
    return promisify(client, 'get', [key]);
  }

  if (type === 'hash') {
    return getHashKeys(client, key, pattern);
  }

  if (type === 'zset') {
    return getZSetKeys(client, key, pattern);
  }

  return null;
};

export const updateKeyTTL = async (key, ttl) => {
  const client = getClient('localhost');

  return client.expireAsync(key, ttl);
};

export const renameKey = async (key, newKeyName) => {
  const client = getClient('localhost');

  return client.renameAsync(key, newKeyName);
};
