import * as redis from 'services/redis';
import * as memcache from 'services/memcache';

const CONN_LIBS = {
  redis,
  memcache
};

export const CONN_TYPES = [
  { key: 'redis', value: 'redis', text: 'Redis' },
  { key: 'memcache', value: 'memcache', text: 'Memcache' },
];

const connections = JSON.parse(
  window.localStorage.getItem('connections') || '{}'
);

export const getDefaultConnectionInfo = (connType) => {
  return CONN_LIBS[connType].getDefaultConnectionInfo();
};

export const addConnection = (connType, connInfo) => {
  const connStr = CONN_LIBS[connType].getConnectionString(connInfo);
  const connTypes = connections[connType] || {};

  if (!connTypes[connStr]) {
    connections[connType] = {
      ...(connections[connType] || {}),
      [connStr]: {
        ...connInfo,
        connStr
      }
    };
    window.localStorage.setItem('connections', JSON.stringify(connections));
  }

  return connStr;
};

export const getConnections = () => {
  return connections;
};

export const getConnection = (connType, connStr) => {
  return new Proxy(CONN_LIBS[connType], {
    get: (obj, prop) => {
      if (prop in obj) {
        return (...args) => obj[prop](connStr, ...args);
      }
      return null;
    }
  });
};
