import React from 'react';
import { Button } from 'semantic-ui-react';

import { getConnections, CONN_TYPES } from 'services/connections';
import AddConnection from 'ui/components/AddConnection';
import ConnectionList from 'ui/components/ConnectionList';
import styles from './DatabaseList.module.css';

class DatabaseList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      connections: getConnections(),
      isAdding: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    this.setState({
      isAdding: false,
      connections: getConnections(),
    });
  }

  render () {
    const { connections, isAdding } = this.state;
    const { onActivateConnection } = this.props;

    return (
      <div className={styles.DatabaseList}>
        <h2 className={styles.heading}>Connections</h2>
        <div className={styles.actions}>
          <Button
            color={isAdding ? 'grey' : 'blue'}
            onClick={() => this.setState({ isAdding: !isAdding })}
          >
            {isAdding ? 'Cancel' : 'New Connection'}
          </Button>
        </div>

        {isAdding && (
          <div className={styles.add}>
            <AddConnection onSubmit={this.handleSubmit} />
          </div>
        )}

        {!isAdding && Object.values(CONN_TYPES).map(connType => (
          connections[connType.key] && (
            <ConnectionList
              key={connType.key}
              title={connType.text}
              connections={connections[connType.key]}
              onClickConnection={
                conn => onActivateConnection(connType.key, conn)
              }
            />
          )
        ))}
      </div>
    );
  }
}

export default DatabaseList;
