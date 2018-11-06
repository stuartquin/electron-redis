import React from 'react';
import PropTypes from 'prop-types';
import { Button, Grid, Pagination } from 'semantic-ui-react';

import ConnectionContext from 'connection-context';
import ValueEditor from 'ui/components/ValueEditor';
import FilterList from 'ui/components/FilterList';
import styles from './HashView.module.css';

const TOTAL_PER_PAGE = 50;

class HashView extends React.Component {
  constructor(props) {
    super(props);

    const { keys, total } = props.keyValue;
    this.state = {
      selectedField: null,
      selectedValue: null,
      pattern: '',
      activePage: 1,
      keys,
      total
    };

    this.handleChangePattern = this.handleChangePattern.bind(this);
    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddNew = this.handleAddNew.bind(this);
  }

  async handleChangePattern(pattern) {
    this.setState({ pattern }, () => this.fetchFields());
  }

  async fetchKeys() {
    const { context } = this;
    const { activePage, pattern, total } = this.state;
    const start = (activePage - 1) * TOTAL_PER_PAGE;
    const count = Math.min(
      TOTAL_PER_PAGE, (total - start) || TOTAL_PER_PAGE
    );
    const result = await context.getHashValue(pattern, start, count);

    this.setState({
      keys: result.keys.map(key => [key]),
      total: result.total
    });
  }

  async handleChangePage(e, { activePage }) {
    this.setState({ activePage }, () => this.fetchKeys());
  }

  async handleChangeField(selectedField) {
    const { selectedKey } = this.props;
    this.setState({ selectedField });

    const selectedValue = await this.context.getHashFieldValue(
      selectedKey, selectedField
    );
    this.setState({ selectedValue });
  }

  async handleUpdate(initialValue, formValue) {
    const { selectedKey, onReload } = this.props;
    await this.context.updateHashField(
      selectedKey, initialValue.field, formValue.field, formValue.value
    );
    this.setState({ selectedField: formValue.field });
    onReload();
  }

  async handleDelete(field) {
    const { selectedKey, onReload } = this.props;
    await this.context.deleteHashField(selectedKey, field);
    this.setState({ selectedField: null, selectedValue: null });
    onReload();
  }

  handleAddNew() {
    this.setState({
      selectedValue: {
        field: '',
        value: '',
      }
    });
  }

  render() {
    const {
      keys, total, activePage, pattern, selectedField, selectedValue
    } = this.state;
    const totalPages = Math.ceil(
      parseFloat(total) / parseFloat(TOTAL_PER_PAGE)
    );

    return (
      <Grid className={styles.HashView} columns={2}>
        <Grid.Column>
          <FilterList
            items={keys}
            columns={['Field', 'Value']}
            active={selectedField}
            filter={pattern}
            onFilter={this.handleChangePattern}
            onChange={item => this.handleChangeField(item[0])}
          >
            <Button icon="plus" onClick={this.handleAddNew} />
          </FilterList>
          <Pagination
            onPageChange={this.handleChangePage}
            activePage={activePage}
            totalPages={totalPages}
          />
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
    PropTypes.object,
    PropTypes.array
  ]),
  selectedKey: PropTypes.string.isRequired,
  onReload: PropTypes.func,
};

HashView.contextType = ConnectionContext;

export default HashView;
