const bluebird = window.require('bluebird');
const redis = window.require('redis');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const connectionString = null;

// Mapping of HOST:PORT to { keys, client }
const connections = {
};

const loadedHashKeys = {
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

const loadAllKeys = async (
  client, key = null, method = 'scanAsync', cursor = 0, results = []
) => {
  const [nextCursor, keys] = key
    ? await client[method](key, cursor, 'COUNT', '50')
    : await client[method](cursor, 'COUNT', '50');

  keys.forEach(k => results.push(k));

  if (nextCursor === '0') {
    return results;
  }

  return loadAllKeys(client, key, method, nextCursor, results);
};

const connect = async (host) => {
  const client = redis.createClient();
  const conn = {
    client: redis.createClient(),
    keys: new Set(await loadAllKeys(client)),
    type: 'redis',
  };
  connections[host] = conn;

  return conn;
};

const getConnection = async () => {
  if (connections[connectionString]) {
    return Promise.resolve(connections[connectionString]);
  }
  return connect(connectionString);
};

export const getKeys = async (
  host, pattern = null, start = 0, count = 50
) => {
  const conn = await getConnection(host);
  const keys = [...conn.keys].filter(
    key => key.indexOf(pattern) > -1
  );

  return {
    keys: keys.slice(start, start + count),
    total: keys.length
  };
};

export const getKeyInfo = async (host, key) => {
  const { client } = await getConnection(host);
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

export const getHashFieldValue = async (host, key, field) => {
  const { client } = await getConnection(host);
  const value = await client.hgetAsync(key, field);
  return { field, value };
};

export const getHashValue = async (
  host, key, pattern = null, start = 0, count = 50
) => {
  const { client } = await getConnection(host);
  const promise = loadedHashKeys[key]
    ? Promise.resolve(loadedHashKeys[key])
    : loadAllKeys(client, key, 'hscanAsync');
  const keys = await promise;

  if (!loadedHashKeys[key]) {
    loadedHashKeys[key] = zipKeys(keys, 2);
  }

  const filtered = loadedHashKeys[key].filter(
    ([val]) => !pattern || val.indexOf(pattern) > -1
  );

  return {
    keys: filtered.slice(start, start + count),
    total: keys.length
  };
};

const getZSetKeys = async (client, key, pattern) => {
  const reply = await promisify(
    client,
    'zscan',
    [key, ...getScanArguments(pattern, 0, 100)]
  );
  return zipKeys(reply[1], 2);
};

const getStringValue = async (client, key) => {
  return client.getAsync(key);
};

export const getKeyValue = async (host, key, type, pattern = null) => {
  const { client } = await getConnection(host);

  if (type === 'hash') {
    return getHashValue(host, key, pattern);
  }

  if (type === 'zset') {
    return getZSetKeys(client, key, pattern);
  }

  if (type === 'string') {
    return getStringValue(client, key);
  }

  return null;
};

export const updateKeyTTL = async (host, key, ttl) => {
  const { client } = await getConnection(host);

  return client.expireAsync(key, ttl);
};

export const renameKey = async (host, key, newKeyName) => {
  const { client } = await getConnection(host);

  return client.renameAsync(key, newKeyName);
};

export const updateStringField = async (host, key, value) => {
  const { client } = await getConnection(host);
  return client.setAsync(key, value);
};

export const updateHashField = async (host, key, field, newField, value) => {
  const { client } = await getConnection(host);
  return client.multi().hdel(
    key, field
  ).hset(
    key, newField, value
  ).execAsync();
};

export const deleteHashField = async (host, key, field) => {
  const { client } = await getConnection(host);

  return client.hdelAsync(key, field);
};

export const getDefaultConnectionInfo = () => {
  return {
    hostname: '',
    port: 6379,
    db: 0
  };
};

export const getConnectionString = ({ hostname, port, db = 0 }) => {
  return `redis://${hostname}:${port}/${db}`;
};
