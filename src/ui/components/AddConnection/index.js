import React from 'react';
import {
  Input, Button, Dropdown, Form
} from 'semantic-ui-react';

import {
  addConnection, getDefaultConnectionInfo, CONN_TYPES
} from 'services/connections';
import AddRedisConnection from 'ui/components/AddRedisConnection';
import styles from './AddConnection.module.css';

class AddConnection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      connType: 'redis',
      form: getDefaultConnectionInfo('redis'),
    };

    this.handleChangeForm = this.handleChangeForm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeConnType = this.handleChangeConnType.bind(this);
  }

  handleChangeForm(field, value) {
    const { form } = this.state;

    this.setState({
      form: {
        ...form,
        [field]: value
      }
    });
  }

  handleSubmit() {
    const { onSubmit } = this.props;
    const { connType, form } = this.state;
    const connStr = addConnection(connType, form);

    onSubmit(connType, connStr);
  }

  handleChangeConnType(connType) {
    this.setState({
      connType,
      form: getDefaultConnectionInfo(connType)
    });
  }

  render() {
    const { connType, form } = this.state;

    return (
      <Form className={styles.AddConnection} onSubmit={this.handleSubmit}>
        <Form.Field>
          <label>Cache Type</label>
          <Dropdown
            options={CONN_TYPES}
            value={connType}
            onChange={(evt, { value }) => this.handleChangeConnType(value)}
            selection
            fluid
          />
        </Form.Field>

        <Form.Field>
          <label>Name</label>
          <Input
            value={form.name || ''}
            onChange={
              ({ target }) => this.handleChangeForm('name', target.value)
            }
          />
        </Form.Field>

        {connType === 'redis' && (
          <AddRedisConnection
            form={form}
            onChange={this.handleChangeForm}
          />
        )}

        <div className={styles.actions}>
          <Form.Button as={Button} color="blue">Add</Form.Button>
          <Button>Test</Button>
        </div>
      </Form>
    );
  }
}

export default AddConnection;
