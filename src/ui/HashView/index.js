import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';

import { getHashValue, deleteHashField, updateHashField } from 'services/redis';
import ValueEditor from 'ui/components/ValueEditor';
import FilterList from 'ui/components/FilterList';
import styles from './HashView.module.css';


class HashView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedField: null,
      selectedValue: null,
      pattern: '',
    };

    this.handleChangePattern = this.handleChangePattern.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  async handleChangePattern(pattern) {
    this.setState({ pattern }, () => this.fetchFields());
  }

  async handleChangeField(selectedField) {
    const { selectedKey } = this.props;
    this.setState({ selectedField });

    const selectedValue = await getHashValue(selectedKey, selectedField);
    this.setState({ selectedValue });
  }

  async handleUpdate(initialValue, formValue) {
    const { selectedKey, onReload } = this.props;
    await updateHashField(
      selectedKey, initialValue.field, formValue.field, formValue.value
    );
    this.setState({ selectedField: formValue.field });
    onReload();
  }

  async handleDelete(field) {
    const { selectedKey, onReload } = this.props;
    await deleteHashField(selectedKey, field);
    this.setState({ selectedField: null, selectedValue: null });
    onReload();
  }

  render() {
    const { keyValue } = this.props;
    const { pattern, selectedField, selectedValue } = this.state;

    return (
      <Grid className={styles.HashView} columns={2}>
        <Grid.Column>
          {keyValue && (
            <FilterList
              items={keyValue}
              columns={['Field', 'Value']}
              active={selectedField}
              filter={pattern}
              onFilter={this.handleChangePattern}
              onChange={item => this.handleChangeField(item[0])}
            />
          )}
        </Grid.Column>

        <Grid.Column>
          {selectedValue && (
            <ValueEditor
              onUpdate={this.handleUpdate}
              onDelete={this.handleDelete}
              key={selectedValue.field}
              value={selectedValue}
            />
          )}
        </Grid.Column>
      </Grid>
    );
  }
}

HashView.propTypes = {
  keyValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array
  ]),
  selectedKey: PropTypes.string.isRequired,
  onReload: PropTypes.func,
};

export default HashView;
