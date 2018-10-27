import React from 'react';

import KeyList from 'ui/KeyList';
import KeyView from 'ui/KeyView';
import DatabaseInfo from 'ui/components/DatabaseInfo';

import styles from './DatabaseView.module.css';


class DatabaseView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedKey: null,
    };

    this.handleChangeKey = this.handleChangeKey.bind(this);
  }

  handleChangeKey(selectedKey) {
    this.setState({ selectedKey });
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
          <div className={styles.panel}>
            <KeyView selectedKey={selectedKey} />
          </div>
        )}
      </div>
    );
  }
}

export default DatabaseView;