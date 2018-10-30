import React from 'react';

import { renameKey } from 'services/redis';
import KeyList from 'ui/KeyList';
import KeyView from 'ui/KeyView';
import DatabaseInfo from 'ui/components/DatabaseInfo';

import styles from './DatabaseView.module.css';


class DatabaseView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedKey: 'users:50b7151b-3626-47f7-8faf-49ef466d463f'
    };

    this.handleChangeKey = this.handleChangeKey.bind(this);
    this.handleRenameKey = this.handleRenameKey.bind(this);
  }

  handleChangeKey(selectedKey) {
    this.setState({ selectedKey });
  }

  async handleRenameKey(selectedKey, newKeyName) {
    try {
      await renameKey(selectedKey, newKeyName);
      this.setState({
        selectedKey: newKeyName
      });
    } catch (error) {
      console.log('error', error);
    }
  }

  render() {
    const { selectedKey } = this.state;

    return (
      <div className={styles.DatabaseView}>
        <div className={styles.panel}>
          <DatabaseInfo />
          <KeyList
            selectedKey={selectedKey}
            onChangeKey={this.handleChangeKey}
          />
        </div>
        {selectedKey && (
          <div className={`${styles.panel} ${styles.keyView}`}>
            <KeyView
              selectedKey={selectedKey}
              onRenameKey={this.handleRenameKey}
            />
          </div>
        )}
      </div>
    );
  }
}

export default DatabaseView;
