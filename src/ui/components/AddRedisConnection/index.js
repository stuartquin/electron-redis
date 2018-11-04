import React from 'react';
import { Form, Grid, Input } from 'semantic-ui-react';

const DEFAULT_PORT = 6379;
const DEFAULT_DB = 0;

const AddRedisConnection = ({ form, onChange }) => {
  return (
    <React.Fragment>
      <Form.Field>
        <label>Hostname</label>
        <Input
          value={form.hostname || ''}
          placeholder="Hostname"
          onChange={({ target }) => onChange('hostname', target.value)}
        />
      </Form.Field>
      <Grid columns={2}>
        <Grid.Column>
          <Form.Field>
            <label>Port</label>
            <Input
              value={form.port || DEFAULT_PORT}
              placeholder="Port"
              onChange={({ target }) => onChange('port', target.value)}
            />
          </Form.Field>
        </Grid.Column>
        <Grid.Column>
          <Form.Field>
            <label>Database</label>
            <Input
              value={form.db || DEFAULT_DB}
              placeholder="Database"
              onChange={({ target }) => onChange('db', target.value)}
            />
          </Form.Field>
        </Grid.Column>
      </Grid>
    </React.Fragment>
  );
};

export default AddRedisConnection;
