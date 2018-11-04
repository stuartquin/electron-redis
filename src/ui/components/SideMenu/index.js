import React from 'react';
import { Icon } from 'semantic-ui-react';

import styles from './SideMenu.module.css';

const SideMenu = ({ isAddVisible, onAdd }) => {
  return (
    <React.Fragment>
      <div className={styles.SideMenu}>
        <div className={styles.logo}>
          <Icon size="big" name="key" color="black" />
        </div>

        <a className={styles.add} onClick={() => onAdd()}>
          <Icon size="large" name="plus" />
        </a>
      </div>
    </React.Fragment>
  );
};

export default SideMenu;
