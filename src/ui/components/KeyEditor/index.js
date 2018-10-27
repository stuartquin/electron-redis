import React from 'react';

import { Input } from 'semantic-ui-react';

class KeyEditor extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      value: props.selectedKey
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange({ target }) {
    this.setState({ value: target.value });
  }

  render () {
    const { value } = this.state;
    const { selectedKey } = this.props;

    return (
      <div>
        <Input
          defaultValue={selectedKey}
          value={value}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

export default KeyEditor;
