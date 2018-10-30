import React from 'react';
import PropTypes from 'prop-types';

import { getKeyInfo, updateKeyTTL } from 'services/redis';
import ActionInput from 'ui/components/ActionInput';
import KeyActions from 'ui/components/KeyActions';
import { Form, Grid } from 'semantic-ui-react';

class KeyEditor extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      form: {
        key: '',
        ttl: '',
      },
      keyInfo: {
        key: props.selectedKey,
      },
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleUpdateTTL = this.handleUpdateTTL.bind(this);
  }

  async componentDidMount() {
    this.fetchKeyInfo();
  }

  async componentDidUpdate(prevProps) {
    const { selectedKey } = this.props;
    if (prevProps.selectedKey !== selectedKey) {
      this.fetchKeyInfo();
    }
  }

  async fetchKeyInfo() {
    const { selectedKey } = this.props;
    const keyInfo = await getKeyInfo(selectedKey);
    this.setState({
      keyInfo,
      form: {
        key: keyInfo.key,
        ttl: keyInfo.ttl,
      },
    });
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

  async handleUpdateTTL() {
    const { form, keyInfo } = this.state;
    const success = await updateKeyTTL(keyInfo.key, form.ttl);

    if (success) {
      this.setState({
        keyInfo: {
          ...keyInfo,
          ttl: form.ttl
        }
      });
    }
  }

  render () {
    const { onRenameKey, onAction } = this.props;
    const { form, keyInfo } = this.state;

    return (
      <Form>
        <Grid columns={3} divided>
          <Grid.Row>
            <Grid.Column>
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

            <Grid.Column>
              <Form.Field>
                <label>TTL (seconds)</label>
                <ActionInput
                  value={form.ttl}
                  onChange={evt => this.handleChange('ttl', evt)}
                  onClick={this.handleUpdateTTL}
                  actionLabel="Update"
                  actionDisabled={form.ttl === keyInfo.ttl}
                />
              </Form.Field>
            </Grid.Column>

            <Grid.Column>
              <KeyActions
                onAction={onAction}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>
    );
  }
}

KeyEditor.propTypes = {
  selectedKey: PropTypes.string,
  onRenameKey: PropTypes.func,
  onAction: PropTypes.func,
};

export default KeyEditor;
