import React from 'react';
import PropTypes from 'prop-types';

import ActionInput from 'ui/components/ActionInput';
import KeyActions from 'ui/components/KeyActions';
import { Dropdown, Form, Grid } from 'semantic-ui-react';

class KeyEditor extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      form: {
        key: props.keyInfo.key,
        ttl: props.keyInfo.ttl,
      },
    };

    this.typeOptions = [
      {
        text: 'String',
        value: 'string',
      },
      {
        text: 'Set',
        value: 'set',
      },
      {
        text: 'List',
        value: 'list',
      },
      {
        text: 'Hash',
        value: 'hash',
      },
      {
        text: 'ZSet',
        value: 'zset',
      }
    ];

    this.handleChange = this.handleChange.bind(this);
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

  render () {
    const {
      keyInfo, onUpdateTTL, onRenameKey, onAction
    } = this.props;
    const { form } = this.state;

    return (
      <Form>
        <Grid divided columns={5}>
          <Grid.Column width={2}>
            <Form.Field>
              <label>Type</label>
              <Dropdown
                disabled={Boolean(keyInfo.key)}
                options={this.typeOptions}
                value={keyInfo.type || 'string'}
                selection
                fluid
              />
            </Form.Field>
          </Grid.Column>
          <Grid.Column width={6}>
            <Form.Field>
              <label>Key</label>
              <ActionInput
                value={form.key}
                onChange={evt => this.handleChange('key', evt)}
                onClick={() => onRenameKey(keyInfo.key, form.key)}
                actionLabel="Rename"
                actionDisabled={form.key === keyInfo.key}
              />
            </Form.Field>
          </Grid.Column>

          <Grid.Column width={4}>
            <Form.Field>
              <label>TTL (seconds)</label>
              <ActionInput
                value={form.ttl}
                onChange={evt => this.handleChange('ttl', evt)}
                onClick={() => onUpdateTTL(keyInfo.key, form.ttl)}
                actionLabel="Update"
                actionDisabled={form.ttl === keyInfo.ttl}
              />
            </Form.Field>
          </Grid.Column>

          <Grid.Column width={4}>
            <KeyActions
              onAction={onAction}
            />
          </Grid.Column>
        </Grid>
      </Form>
    );
  }
}

KeyEditor.propTypes = {
  onRenameKey: PropTypes.func,
  onAction: PropTypes.func,
  onUpdateTTL: PropTypes.func,
  keyInfo: PropTypes.object,
};

export default KeyEditor;
