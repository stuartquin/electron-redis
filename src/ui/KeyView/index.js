import React from 'react';
import PropTypes from 'prop-types';
import { Divider } from 'semantic-ui-react';

import { getKeyValue, getKeyInfo, updateKeyTTL } from 'services/redis';
import KeyEditor from 'ui/components/KeyEditor';
import HashView from 'ui/HashView';
import styles from './KeyView.module.css';

const views = {
  hash: HashView,
};

class KeyView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keyInfo: {},
    };

    this.handleAction = this.handleAction.bind(this);
    this.handleUpdateTTL = this.handleUpdateTTL.bind(this);
  }

  async componentDidMount() {
    this.fetchKey();
  }

  async componentDidUpdate(prevProps) {
    const { selectedKey } = this.props;
    if (prevProps.selectedKey !== selectedKey) {
      this.fetchKey();
    }
  }

  async fetchKey() {
    const { selectedKey } = this.props;
    const keyInfo = await getKeyInfo(selectedKey);

    this.fetchKeyValue(keyInfo.type);
    this.setState({ keyInfo });
  }

  async fetchKeyValue(type) {
    const { selectedKey } = this.props;
    const keyValue = await getKeyValue(selectedKey, type);

    this.setState({ keyValue });
  }

  async handleAction(action) {
    if (action === 'reload') {
      return this.fetchKey();
    }
    console.log('ActionNotImplemented', `|${action}|`);
    return null;
  }

  async handleUpdateTTL(key, ttl) {
    const { keyInfo } = this.state;
    const success = await updateKeyTTL(key, ttl);

    if (success) {
      this.setState({
        keyInfo: {
          ...keyInfo,
          ttl
        }
      });
    }
  }

  render() {
    const { keyInfo, keyValue } = this.state;
    const { selectedKey, onRenameKey } = this.props;
    const View = views[keyInfo.type];

    return (
      <div className={styles.KeyView}>
        {View && (
          <React.Fragment>
            <h2>{keyInfo.type}</h2>
            <KeyEditor
              key={`${keyInfo.key}_${keyInfo.ttl}`}
              keyInfo={keyInfo}
              selectedKey={selectedKey}
              onRenameKey={onRenameKey}
              onUpdateTTL={this.handleUpdateTTL}
              onAction={this.handleAction}
            />
            <Divider />
            <h2>Value</h2>
            <View
              selectedKey={selectedKey}
              keyValue={keyValue}
              onReload={() => this.handleAction('reload')}
            />
          </React.Fragment>
        )}
      </div>
    );
  }
}

KeyView.propTypes = {
  selectedKey: PropTypes.string,
  onRenameKey: PropTypes.func,
};

export default KeyView;
