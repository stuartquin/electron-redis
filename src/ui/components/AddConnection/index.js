import React from 'react';
import { Dropdown, Form } from 'semantic-ui-react';

import AddRedisConnection from 'ui/components/AddRedisConnection';
import styles from './AddConnection.module.css';

const CONN_TYPES = [
  { key: 'redis', value: 'redis', text: 'Redis' },
  { key: 'memcache', value: 'memcache', text: 'Memcache' },
];

class AddConnection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      connType: 'redis',
      form: {}
    };

    this.handleChangeForm = this.handleChangeForm.bind(this);
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

  render() {
    const { connType, form } = this.state;

    return (
      <div className={styles.AddConnection}>
        <h4>Add New Conenction</h4>
        <Form className={styles.ValueEditor}>
          <Form.Field>
            <label>Cache Type</label>
            <Dropdown
              options={CONN_TYPES}
              value={connType}
              onChange={(evt, { value }) => this.setState({ connType: value })}
              selection
              fluid
            />
          </Form.Field>

          {connType === 'redis' && (
            <AddRedisConnection
              form={form}
              onChange={this.handleChangeForm}
            />
          )}
        </Form>
      </div>
    );
  }
}

export default AddConnection;
