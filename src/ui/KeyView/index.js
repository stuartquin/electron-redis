import React from 'react';
import PropTypes from 'prop-types';

import { getKeyType } from 'services/redis';
import styles from './KeyView.module.css';


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

    return (
      <div className={styles.KeyView}>
        <h1>{selectedKey}</h1>
        <h2>{keyType}</h2>
      </div>
    );
  }
}

KeyView.propTypes = {
  selectedKey: PropTypes.string,
};

export default KeyView;
