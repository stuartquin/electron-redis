import React from 'react';
import PropTypes from 'prop-types';
import { Input, Button } from 'semantic-ui-react';

const ActionInput = ({
  color = 'green', actionLabel, actionDisabled, onClick, ...rest
}) => {
  return (
    <Input {...rest} action>
      <input />
      <Button disabled={actionDisabled} color={color} onClick={onClick}>
        {actionLabel}
      </Button>
    </Input>
  );
};

ActionInput.propTypes = {
  color: PropTypes.string,
  actionLabel: PropTypes.string,
  actionDisabled: PropTypes.bool,
  onClick: PropTypes.func,
};

export default ActionInput;
