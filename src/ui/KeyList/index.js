import React from 'react';
import PropTypes from 'prop-types';
import { Pagination } from 'semantic-ui-react';

import ConnectionContext from 'connection-context';
import FilterList from 'ui/components/FilterList';
import styles from './KeyList.module.css';

const TOTAL_PER_PAGE = 50;

class KeyList extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      keys: [],
      total: 0,
      pattern: '',
      activePage: 1,
    };

    this.handleChangePattern = this.handleChangePattern.bind(this);
    this.handleChangePage = this.handleChangePage.bind(this);
  }

  async componentDidMount() {
    this.fetchKeys();
  }

  async fetchKeys() {
    const { context } = this;
    const { activePage, pattern, total } = this.state;
    const start = (activePage - 1) * TOTAL_PER_PAGE;
    const count = Math.min(
      TOTAL_PER_PAGE, (total - start) || TOTAL_PER_PAGE
    );
    const result = await context.getKeys(pattern, start, count);

    this.setState({
      keys: result.keys.map(key => [key]),
      total: result.total
    });
  }

  async handleChangePattern(pattern) {
    this.setState({ activePage: 1, pattern }, () => this.fetchKeys());
  }

  async handleChangePage(e, { activePage }) {
    this.setState({ activePage }, () => this.fetchKeys());
  }

  render () {
    const {
      keys, pattern, activePage, total
    } = this.state;
    const { selectedKey, onChangeKey } = this.props;
    const totalPages = Math.ceil(
      parseFloat(total) / parseFloat(TOTAL_PER_PAGE)
    );

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
        <Pagination
          onPageChange={this.handleChangePage}
          activePage={activePage}
          totalPages={totalPages}
        />
      </div>
    );
  }
}

KeyList.propTypes = {
  selectedKey: PropTypes.string,
  onChangeKey: PropTypes.func.isRequired,
};

KeyList.contextType = ConnectionContext;

export default KeyList;
