import React from 'react';
import PropTypes from 'prop-types';
import { Table, Input } from 'semantic-ui-react';

import styles from './FilterList.module.css';


const FilterList = ({
  children, items, columns, active, filter = '', onChange, onFilter
}) => {
  return (
    <div className={styles.FilterList}>
      <div className={styles.heading}>
        <Input
          icon="search"
          className={styles.search}
          placeholder="Filter"
          value={filter}
          onChange={({ target }) => onFilter(target.value)}
        />
        {children && (
          <div className={styles.actions}>
            {children}
          </div>
        )}
      </div>

      <div className={styles.items}>
        <Table celled selectable>
          <Table.Header>
            <Table.Row>
              {columns.map(column => (
                <Table.HeaderCell>{column}</Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {items.map(item => (
              <Table.Row
                key={item[0]}
                style={{ cursor: 'pointer' }}
                active={item[0] === active}
                onClick={() => onChange(item)}
              >
                {item.map(value => <Table.Cell>{value}</Table.Cell>)}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
};

FilterList.propTypes = {
  items: PropTypes.array,
  columns: PropTypes.array,
  filter: PropTypes.string,
  active: PropTypes.string,
  children: PropTypes.oneOfType(PropTypes.element, PropTypes.array),
  onChange: PropTypes.func.isRequired,
  onFilter: PropTypes.func.isRequired,
};

export default FilterList;
