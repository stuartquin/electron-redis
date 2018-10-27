const redis = window.require('redis');

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

export const getClient = (host) => {
  clients[host] = clients[host] || redis.createClient();
  return clients[host];
};

export const getKeys = async (pattern = null, start = 0, count = 100) => {
  const client = getClient('localhost');

  let args = [start];
  if (pattern) {
    args = args.concat(['MATCH', `*${pattern}*`]);
  }
  args = args.concat(['COUNT', count]);

  const reply = await promisify(client, 'scan', args);
  return reply[1];
};

export const getKeyType = async (key) => {
  const client = getClient('localhost');
  return promisify(client, 'type', [key]);
};
