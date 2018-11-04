import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Segment, Sidebar } from 'semantic-ui-react';

import { getConnection } from 'services/connections';
import AddConnection from 'ui/components/AddConnection';
import DatabaseView from 'ui/DatabaseView';
import SideMenu from 'ui/components/SideMenu';
import styles from './App.module.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isAddVisible: true,
      activeConnection: null,
    };

    this.handleAddConnection = this.handleAddConnection.bind(this);
    this.handleSubmitConnection = this.handleSubmitConnection.bind(this);
  }

  handleAddConnection() {
    const { isAddVisible } = this.state;
    this.setState({ isAddVisible: !isAddVisible });
  }

  handleSubmitConnection(connType, connStr) {
    this.setState({
      activeConnection: getConnection(connType, connStr),
      isAddVisible: false,
    });
  }

  render () {
    const { isAddVisible, activeConnection } = this.state;

    return (
      <div className={styles.App}>
        <SideMenu
          isAddVisible={isAddVisible}
          onAdd={this.handleAddConnection}
        />

        <Sidebar.Pushable>
          <Sidebar
            className={styles.sidebar}
            animation="overlay"
            icon="labeled"
            inverted
            onHide={this.handleAddConnection}
            vertical
            visible={isAddVisible}
            width="very wide"
          >
            <AddConnection
              onSubmit={this.handleSubmitConnection}
            />
          </Sidebar>

          <Sidebar.Pusher dimmed={isAddVisible}>
            <div className={styles.content}>
              {activeConnection && (
                <DatabaseView connection={activeConnection} />
              )}
            </div>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    );
  }
}

export default App;
