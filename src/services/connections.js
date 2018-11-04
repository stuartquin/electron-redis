import * as redis from 'services/redis';
import * as memcache from 'services/memcache';

const CONN_TYPES = {
  redis,
  memcache
};

const connections = JSON.parse(
  window.localStorage.getItem('connections') || '[]'
);

export const getDefaultConnectionInfo = (connType) => {
  return CONN_TYPES[connType].getDefaultConnectionInfo();
};

export const addConnection = (connType, connInfo) => {
  const connStr = CONN_TYPES[connType].getConnectionString(connInfo);

  if (connections.indexOf(connStr) === -1) {
    connections.push(connStr);
    window.localStorage.setItem('connections', JSON.stringify(connections));
  }

  return connStr;
};

export const getConnections = () => {
  return connections;
};

export const getConnection = (connType, connStr) => {
  return new Proxy(CONN_TYPES[connType], {
    get: (obj, prop) => {
      if (prop in obj) {
        return (...args) => obj[prop](connStr, ...args);
      }
      return null;
    }
  });
};
