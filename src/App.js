import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Sidebar } from 'semantic-ui-react';

import { getConnection } from 'services/connections';
import DatabaseList from 'ui/DatabaseList';
import DatabaseView from 'ui/DatabaseView';
import SideMenu from 'ui/components/SideMenu';
import styles from './App.module.css';

import ConnectionContext from './connection-context';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isDatabaseVisible: false,
      activeConnection: null,
    };

    this.handleActivateConnection = this.handleActivateConnection.bind(this);
  }

  handleActivateConnection(connType, { connStr }) {
    const activeConnection = getConnection(connType, connStr);
    this.setState({
      isDatabaseVisible: false,
      activeConnection
    });
  }

  render () {
    const { isDatabaseVisible, activeConnection } = this.state;

    return (
      <div className={styles.App}>
        <SideMenu
          onDatabases={() => this.setState({ isDatabaseVisible: true })}
        />

        <Sidebar.Pushable>
          <Sidebar
            className={styles.sidebar}
            animation="overlay"
            icon="labeled"
            visible={isDatabaseVisible}
            onHide={() => this.setState({ isDatabaseVisible: false })}
            width="very wide"
          >
            <DatabaseList
              onActivateConnection={this.handleActivateConnection}
            />
          </Sidebar>

          <Sidebar.Pusher dimmed={isDatabaseVisible}>
            <div className={styles.content}>
              {activeConnection && (
                <ConnectionContext.Provider value={activeConnection}>
                  <DatabaseView />
                </ConnectionContext.Provider>
              )}
            </div>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    );
  }
}

export default App;
