import React from 'react';
import PropTypes from 'prop-types';

import FilterList from 'ui/components/FilterList';
import styles from './HashView.module.css';


class HashView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedField: null,
      pattern: '',
    };

    this.handleChangePattern = this.handleChangePattern.bind(this);
  }

  async handleChangePattern(pattern) {
    this.setState({ pattern }, () => this.fetchFields());
  }

  handleChangeField(selectedField) {
    this.setState({ selectedField });
  }

  render() {
    const { keyValue } = this.props;
    const { pattern, selectedField } = this.state;

    return (
      <div className={styles.HashView}>
        <div className={styles.panel}>
          {keyValue && (
            <FilterList
              items={keyValue}
              columns={['Key', 'Value']}
              active={selectedField}
              filter={pattern}
              onFilter={this.handleChangePattern}
              onChange={item => this.handleChangeField(item[0])}
            />
          )}
        </div>

        <div className={styles.panel}>
          {selectedField && (
            <h2>{selectedField}</h2>
          )}
        </div>
      </div>
    );
  }
}

HashView.propTypes = {
  keyValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array
  ]),
};

export default HashView;
