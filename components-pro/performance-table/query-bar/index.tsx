import React, { cloneElement, Component, isValidElement, ReactElement, ReactNode } from 'react';
import { observer } from 'mobx-react';
import isObject from 'lodash/isObject';
import { TableQueryBarType } from '../Table';
import { TableQueryBarProps, TableQueryBarHookProps } from '../Table.d';
import TableContext from '../TableContext';
import autobind from '../../_util/autobind';
import { getEditorByField, getPlaceholderByField } from '../../table/utils';
import TableProfessionalBar from './TableProfessionalBar';
import TableDynamicFilterBar from './TableDynamicFilterBar';

export type TableQueryBarHookCustomProps = object;
export type TableQueryBarHook = (props: TableQueryBarHookCustomProps & TableQueryBarHookProps) => ReactNode;

@observer
export default class PerformanceTableQueryBar extends Component<TableQueryBarProps> {
  static displayName = 'PerformanceTableQueryBar';

  static contextType = TableContext;

  static defaultProps = {
    queryFieldsLimit: 3,
  };

  @autobind
  handleQueryReset() {
    const {
      tableStore: {
        dataSet: { queryDataSet },
      },
    } = this.context;
    if (queryDataSet) {
      const { current } = queryDataSet;
      if (current) {
        current.reset();
      }
      this.handleQuery();
    }
  }

  @autobind
  handleQuery() {
    const {
      tableStore: { dataSet },
    } = this.context;
    return dataSet.query();
  }

  getQueryFields(): ReactElement<any>[] {
    const { tableStore: { dataSet, queryBar: { queryFields = {}, type } } } = this.context;
    const { queryDataSet } = dataSet;
    const result: ReactElement<any>[] = [];
    if (queryDataSet) {
      const { fields } = queryDataSet;
      return [...fields.entries()].reduce((list, [name, field]) => {
        if (!field.get('bind') && !name.includes('__tls')) {
          const element: ReactNode = queryFields![name];
          let filterBarProps = {};
          if (type === TableQueryBarType.filterBar) {
            const placeholder = isValidElement(element) && element.props.placeholder ? element.props.placeholder : getPlaceholderByField(field);
            filterBarProps = {
              placeholder,
            };
          }
          const props: any = {
            key: name,
            name,
            dataSet: queryDataSet,
            isFlat: type === TableQueryBarType.filterBar,
            ...filterBarProps,
          };
          list.push(
            isValidElement(element)
              ? cloneElement(element, props)
              : cloneElement(getEditorByField(field, type !== TableQueryBarType.professionalBar, type === TableQueryBarType.filterBar), {
                ...props,
                ...(isObject(element) ? element : {}),
              }),
          );
        }
        return list;
      }, result);
    }
    return result;
  }

  renderProfessionalBar(props: TableQueryBarHookProps) {
    const { tableStore: { prefixCls } } = this.context;
    return <TableProfessionalBar key="toolbar" prefixCls={prefixCls} {...props} />;
  }

  renderDynamicFilterBar(props: TableQueryBarHookProps) {
    const { tableStore: { prefixCls } } = this.context;
    return <TableDynamicFilterBar key="toolbar" prefixCls={prefixCls} {...props} />;
  }


  render() {
    const { tableStore: { queryBar, dataSet } } = this.context;
    if (dataSet) {
      const queryFields = this.getQueryFields();
      const { queryDataSet } = dataSet;
      const props: TableQueryBarHookProps = {
        ...queryBar,
        queryFields,
        queryDataSet,
      };

      if (typeof queryBar.renderer === 'function') {
        return (queryBar.renderer as TableQueryBarHook)(props);
      }
      switch (queryBar.type) {
        case TableQueryBarType.professionalBar:
          return this.renderProfessionalBar(props);
        case TableQueryBarType.filterBar:
          return this.renderDynamicFilterBar(props);
        default:
      }
    }
    return null;
  }
}
