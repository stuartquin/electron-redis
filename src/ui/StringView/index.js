import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';

import ConnectionContext from 'connection-context';
import ValueEditor from 'ui/components/ValueEditor';
import styles from './StringView.module.css';

class StringView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedValue: {
        value: props.keyValue,
      }
    };

    this.handleUpdate = this.handleUpdate.bind(this);
  }

  async handleUpdate(initialValue, { value }) {
    const { selectedKey, onReload } = this.props;
    await this.context.updateStringField(selectedKey, value);
    this.setState({ selectedValue: value });

    onReload();
  }

  render () {
    const { selectedKey } = this.props;
    const { selectedValue } = this.state;

    return (
      <Grid className={styles.StringView} columns={1}>
        <Grid.Column>
          <ValueEditor
            onUpdate={this.handleUpdate}
            onDelete={this.handleDelete}
            key={selectedKey}
            value={selectedValue}
          />
        </Grid.Column>
      </Grid>
    );
  }
}

StringView.propTypes = {
  selectedKey: PropTypes.string.isRequired,
  keyValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array
  ]),
};

StringView.contextType = ConnectionContext;
export default StringView;
