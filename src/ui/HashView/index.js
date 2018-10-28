import React from 'react';
import PropTypes from 'prop-types';

import { getKeyValue } from 'services/redis';
import FilterList from 'ui/components/FilterList';
import KeyEditor from 'ui/components/KeyEditor';
import styles from './HashView.module.css';


class HashView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keyValue: null,
      selectedField: null,
      pattern: '',
    };

    this.handleChangePattern = this.handleChangePattern.bind(this);
  }

  async componentDidMount() {
    this.fetchFields();
  }

  async componentDidUpdate(prevProps) {
    const { selectedKey } = this.props;
    if (prevProps.selectedKey !== selectedKey) {
      this.fetchFields();
    }
  }

  async fetchFields() {
    const { pattern } = this.state;
    const { selectedKey } = this.props;

    const keyValue = await getKeyValue(selectedKey, 'hash', pattern);
    this.setState({ keyValue });
  }

  async handleChangePattern(pattern) {
    this.setState({ pattern }, () => this.fetchFields());
  }

  handleChangeField(selectedField) {
    this.setState({ selectedField });
  }

  render() {
    const { keyValue, pattern, selectedField } = this.state;
    const { selectedKey, keyInfo } = this.props;

    return (
      <div className={styles.HashView}>
        <div className={styles.panel}>
          <KeyEditor
            selectedKey={selectedKey}
          />
          <h4>Value:</h4>
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
      </div>
    );
  }
}

HashView.propTypes = {
  selectedKey: PropTypes.string,
  keyInfo: PropTypes.object,
};

export default HashView;
