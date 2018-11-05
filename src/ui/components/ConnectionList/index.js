import React from 'react';
import PropTypes from 'prop-types';

import styles from './ConnectionList.module.css';

const ConnectionList = ({ title, connections, onClickConnection }) => {
  return (
    <div className={styles.ConnectionList}>
      <h3 className={styles.heading}>{title}</h3>
      {Object.values(connections).map(conn => (
        <a
          className={styles.connection}
          onClick={() => onClickConnection(conn)}
        >
          <strong>{conn.name}</strong>
          <div>{conn.connStr}</div>
        </a>
      ))}
    </div>
  );
};

ConnectionList.propTypes = {
  title: PropTypes.string.isRequired,
  connections: PropTypes.object.isRequired,
  onClickConnection: PropTypes.func.isRequired,
};

export default ConnectionList;
