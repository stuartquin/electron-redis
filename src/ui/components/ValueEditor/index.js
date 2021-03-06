import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, Input, TextArea, Form
} from 'semantic-ui-react';

import { prettyPrint } from 'services/text';
import styles from './ValueEditor.module.css';

class ValueEditor extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      form: {
        field: props.value.field,
        value: prettyPrint(props.value.value),
        score: props.value.score,
      },
    };

    this.handleCancel = this.handleCancel.bind(this);
  }

  handleChange(field, { target }) {
    const { form } = this.state;

    this.setState({
      form: {
        ...form,
        [field]: target.value
      }
    });
  }

  handleCancel() {
    const { value } = this.props;
    this.setState({ form: { ...value } });
  }

  render() {
    const { form } = this.state;
    const { value, onUpdate, onDelete } = this.props;

    return (
      <Form className={styles.ValueEditor}>
        {typeof value.field !== 'undefined' && (
          <Form.Field>
            <label>Field</label>
            <Input
              value={form.field}
              onChange={evt => this.handleChange('field', evt)}
            />
          </Form.Field>
        )}

        {typeof value.score !== 'undefined' && (
          <Form.Field>
            <label>Rank</label>
            <Input value={form.score} />
          </Form.Field>
        )}

        <Form.Field>
          <label>Value</label>
          <TextArea
            autoHeight
            value={form.value}
            style={{ minHeight: 200, maxHeight: 600 }}
            onChange={evt => this.handleChange('value', evt)}
            placeholder="Value"
          />
        </Form.Field>

        <div className={styles.actions}>
          <Button
            color="green"
            title="Save"
            onClick={() => onUpdate(value, form)}
          >
            Save
          </Button>
          <Button
            title="Cancel"
            onClick={this.handleCancel}
          >
            Cancel
          </Button>
          <Button
            title="Delete"
            color="red"
            onClick={() => onDelete(value.field)}
          >
            Delete
          </Button>
        </div>
      </Form>
    );
  }
}

ValueEditor.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array
  ]),
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ValueEditor;
