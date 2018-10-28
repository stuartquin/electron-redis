import React from 'react';
import PropTypes from 'prop-types';

import { getKeyInfo } from 'services/redis';
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
    const { selectedKey } = this.props;
    const View = views[keyInfo.type];

    return (
      <div className={styles.KeyView}>
        <h2>
          {selectedKey}
        </h2>
        {View && (
          <View
            selectedKey={selectedKey}
            keyInfo={keyInfo}
          />
        )}
      </div>
    );
  }
}

KeyView.propTypes = {
  selectedKey: PropTypes.string,
};

export default KeyView;
