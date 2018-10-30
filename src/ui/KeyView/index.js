import React from 'react';
import PropTypes from 'prop-types';

import { getKeyInfo } from 'services/redis';
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
  }

  async componentDidMount() {
    this.fetchKeyType();
  }

  async componentDidUpdate(prevProps) {
    const { selectedKey } = this.props;
    if (prevProps.selectedKey !== selectedKey) {
      this.fetchKeyType();
    }
  }

  async fetchKeyType() {
    const { selectedKey } = this.props;
    const keyInfo = await getKeyInfo(selectedKey);
    this.setState({ keyInfo });
  }

  render() {
    const { keyInfo } = this.state;
    const { selectedKey, onRenameKey } = this.props;
    const View = views[keyInfo.type];

    console.log('View', View);

    return (
      <div className={styles.KeyView}>
        {View && (
          <React.Fragment>
            <KeyEditor
              selectedKey={selectedKey}
              onRenameKey={onRenameKey}
            />
            <View
              selectedKey={selectedKey}
              keyInfo={keyInfo}
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
