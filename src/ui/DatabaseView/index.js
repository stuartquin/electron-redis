import React from 'react';

import ConnectionContext from 'connection-context';
import KeyList from 'ui/KeyList';
import KeyView from 'ui/KeyView';

import styles from './DatabaseView.module.css';

class DatabaseView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedKey: 'str:e0ba2c0c-358d-4850-85f2-ca1faa49c0f1',
    };

    this.handleChangeKey = this.handleChangeKey.bind(this);
    this.handleRenameKey = this.handleRenameKey.bind(this);
  }

  handleChangeKey(selectedKey) {
    this.setState({ selectedKey });
  }

  async handleRenameKey(selectedKey, newKeyName) {
    const { context } = this;

    try {
      await context.renameKey(selectedKey, newKeyName);
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
          <KeyList
            selectedKey={selectedKey}
            onChangeKey={this.handleChangeKey}
          />
        </div>
        {selectedKey && (
          <div className={`${styles.panel} ${styles.keyView}`}>
            <KeyView
              key={selectedKey}
              selectedKey={selectedKey}
              onRenameKey={this.handleRenameKey}
            />
          </div>
        )}
      </div>
    );
  }
}

DatabaseView.contextType = ConnectionContext;

export default DatabaseView;
