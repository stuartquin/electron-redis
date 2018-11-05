import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

import styles from './SideMenu.module.css';

const SideMenu = ({ onDatabases }) => {
  return (
    <React.Fragment>
      <div className={styles.SideMenu}>
        <div className={styles.logo}>
          <Icon size="big" name="key" color="black" />
        </div>

        <a className={styles.add} onClick={() => onDatabases()}>
          <Icon size="large" name="database" />
        </a>
      </div>
    </React.Fragment>
  );
};

SideMenu.propTypes = {
  onDatabases: PropTypes.func.isRequired
};

export default SideMenu;
