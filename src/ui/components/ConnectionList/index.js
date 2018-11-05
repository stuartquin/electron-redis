import React from 'react';

import styles from './ConnectionList.module.css';

class ConnectionList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount () {
  }

  render () {
    const { title, connections, onClickConnection } = this.props;

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
  }
}

export default ConnectionList;
