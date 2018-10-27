import React from 'react';
import PropTypes from 'prop-types';

import { getKeys } from 'services/redis';
import FilterList from 'ui/components/FilterList';

import styles from './KeyList.module.css';


class KeyList extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      keys: [],
      pattern: '',
    };

    this.handleChangePattern = this.handleChangePattern.bind(this);
  }

  async componentDidMount() {
    this.fetchKeys();
  }

  async fetchKeys() {
    const { pattern } = this.state;
    const keys = await getKeys(pattern);
    this.setState({
      keys: keys.map(key => [key]),
    });
  }

  async handleChangePattern(pattern) {
    this.setState({ pattern }, () => this.fetchKeys());
  }

  render () {
    const { keys, pattern } = this.state;
    const { selectedKey, onChangeKey } = this.props;

    return (
      <div className={styles.keyList}>
        <FilterList
          items={keys}
          columns={['Keys']}
          active={selectedKey}
          filter={pattern}
          onFilter={this.handleChangePattern}
          onChange={item => onChangeKey(item[0])}
        />
      </div>
    );
  }
}

KeyList.propTypes = {
  selectedKey: PropTypes.string,
  onChangeKey: PropTypes.func.isRequired,
};

export default KeyList;
