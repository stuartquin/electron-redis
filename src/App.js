import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Segment, Sidebar } from 'semantic-ui-react';

import AddConnection from 'ui/components/AddConnection';
import DatabaseView from 'ui/DatabaseView';
import SideMenu from 'ui/components/SideMenu';
import styles from './App.module.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isAddVisible: true
    };

    this.handleAddConnection = this.handleAddConnection.bind(this);
  }

  handleAddConnection() {
    const { isAddVisible } = this.state;
    this.setState({ isAddVisible: !isAddVisible });
  }

  render () {
    const { isAddVisible } = this.state;

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
            <AddConnection />
          </Sidebar>

          <Sidebar.Pusher dimmed={isAddVisible}>
            <div className={styles.content}>
              <DatabaseView />
            </div>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    );
  }
}

export default App;
