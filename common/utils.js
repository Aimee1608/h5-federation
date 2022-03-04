import { PAGE_STATE_VAR_TAG_REGEX, PROJECT_VARIABLE_REGEX } from 'common/constant';

export function hasVariable(value) {
  if (typeof value == 'string') {
    return (
        new RegExp(PAGE_STATE_VAR_TAG_REGEX).test(value) ||
        new RegExp(PROJECT_VARIABLE_REGEX).test(value)
    );
  }
  return false;
}
