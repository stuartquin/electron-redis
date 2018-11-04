const bluebird = window.require('bluebird');
const redis = window.require('redis');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

// Mapping of HOST:PORT to { keys, client }
const connections = {
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

const loadAllKeys = async (client, cursor = 0, results = new Set()) => {
  const [nextCursor, keys] = await client.scanAsync(cursor, 'COUNT', '50');

  keys.forEach(key => results.add(key));

  if (nextCursor === '0') {
    return results;
  }

  return loadAllKeys(client, nextCursor, results);
};

const connect = async (host) => {
  const client = redis.createClient();
  const conn = {
    client: redis.createClient(),
    keys: await loadAllKeys(client)
  };
  connections[host] = conn;

  return conn;
};

const getConnection = async (host) => {
  console.log('Connections', connections);
  if (connections[host]) {
    return Promise.resolve(connections[host]);
  }
  return connect(host);
};

export const getKeys = async (pattern = null, start = 0, count = 50) => {
  const conn = await getConnection('localhost');
  const keys = [...conn.keys].filter(
    key => key.indexOf(pattern) > -1
  );

  return {
    keys: keys.slice(start, start + count),
    total: keys.length
  };
};

export const getKeyInfo = async (key) => {
  const { client } = await getConnection('localhost');
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

export const getHashValue = async (key, field) => {
  const { client } = await getConnection('localhost');
  const value = await client.hgetAsync(key, field);
  return { field, value };
};

const getHashKeys = async (client, key, pattern) => {
  const reply = await client.hscanAsync(
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
  const { client } = await getConnection('localhost');

  if (type === 'hash') {
    return getHashKeys(client, key, pattern);
  }

  if (type === 'zset') {
    return getZSetKeys(client, key, pattern);
  }

  return null;
};

export const updateKeyTTL = async (key, ttl) => {
  const { client } = await getConnection('localhost');

  return client.expireAsync(key, ttl);
};

export const renameKey = async (key, newKeyName) => {
  const { client } = await getConnection('localhost');

  return client.renameAsync(key, newKeyName);
};

export const updateHashField = async (key, field, newField, value) => {
  const { client } = await getConnection('localhost');
  return client.multi().hdel(
    key, field
  ).hset(
    key, newField, value
  ).execAsync();
};

export const deleteHashField = async (key, field) => {
  const { client } = await getConnection('localhost');

  return client.hdelAsync(key, field);
};
