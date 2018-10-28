import React from 'react';
import PropTypes from 'prop-types';

import { getKeyInfo, updateKeyTTL } from 'services/redis';
import ActionInput from 'ui/components/ActionInput';
import { Form, Input, Button } from 'semantic-ui-react';

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
    this.handleRenameKey = this.handleRenameKey.bind(this);
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

  handleRenameKey() {
    const { form, keyInfo } = this.state;
    console.log('Rename', form.key, keyInfo.key);
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
    const { form, keyInfo } = this.state;

    return (
      <Form>
        <Form.Field>
          <label>Key</label>
          <ActionInput
            value={form.key}
            onChange={evt => this.handleChange('key', evt)}
            onClick={this.handleRenameKey}
            actionLabel="Rename"
            actionDisabled={form.key === keyInfo.key}
          />
        </Form.Field>
        <Form.Field>
          <label>Key</label>
          <ActionInput
            value={form.ttl}
            onChange={evt => this.handleChange('ttl', evt)}
            onClick={this.handleUpdateTTL}
            actionLabel="Update"
            actionDisabled={form.ttl === keyInfo.ttl}
          />
        </Form.Field>
      </Form>
    );
  }
}

KeyEditor.propTypes = {
  selectedKey: PropTypes.string,
};

export default KeyEditor;
