import React from 'react';
import PropTypes from 'prop-types';

import { getKeyType } from 'services/redis';
import HashView from 'ui/HashView';
import styles from './KeyView.module.css';

const views = {
  hash: HashView,
};

class KeyView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keyType: null,
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
    const keyType = await getKeyType(selectedKey);
    this.setState({ keyType });
  }

  render() {
    const { keyType } = this.state;
    const { selectedKey } = this.props;
    const View = views[keyType];

    return (
      <div className={styles.KeyView}>
        <h2>
          {selectedKey}
          -
          {keyType}
        </h2>
        {View && (
          <View
            selectedKey={selectedKey}
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
