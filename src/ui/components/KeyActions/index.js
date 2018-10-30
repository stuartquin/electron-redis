import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

import styles from './KeyActions.module.css';

const KeyActions = ({ onAction }) => {
  return (
    <div className={styles.KeyActions}>
      <Button
        icon="refresh"
        color="olive"
        title="Reload Key"
        onClick={() => onAction('reload')}
      />
      <Button title="Move Key" onClick={() => onAction('move')}>
        Move
      </Button>
      <Button title="Dump Key" onClick={() => onAction('dump')}>
        Dump
      </Button>
      <Button
        title="Delete Key"
        color="red"
        onClick={() => onAction('delete')}
        icon="trash"
      />
    </div>
  );
};

KeyActions.propTypes = {
  onAction: PropTypes.func
};

export default KeyActions;
