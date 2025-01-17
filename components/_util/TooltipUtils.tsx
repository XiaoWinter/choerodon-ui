import { Tooltip } from 'choerodon-ui/pro/lib/core/enum';
import { getConfig, TooltipTarget } from '../configure';

function getTooltipPolyfill(target?: TooltipTarget): Tooltip | undefined {
  switch (target) {
    case 'table-cell':
      return getConfig('tableColumnTooltip');
    case 'button':
      return getConfig('buttonTooltip');
    case 'select-option':
      return getConfig('selectOptionTooltip');
    case 'label':
      return getConfig('labelTooltip');
    default:
  }
}

export function getTooltip(target?: TooltipTarget): Tooltip | undefined {
  const tooltip = getConfig('tooltip');
  if (typeof tooltip === 'function') {
    return tooltip(target);
  }
  return getTooltipPolyfill(target) || tooltip;
}

export function getTooltipTheme(target?: TooltipTarget) {
  const tooltipTheme = getConfig('tooltipTheme');
  if (typeof tooltipTheme === 'function') {
    return tooltipTheme(target);
  }
  if (target === 'validation') {
    const validationTooltipTheme = getConfig('validationTooltipTheme');
    if (validationTooltipTheme) {
      return validationTooltipTheme;
    }
  }
  return tooltipTheme;
}
