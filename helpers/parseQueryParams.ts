export const parseQueryParams = (
  param?: string | string[],
): [string, string[]] => {
  if (param === undefined) {
    return ['', []];
  }

  if (Array.isArray(param)) {
    return ['', param];
  }

  return [param, [param]];
};
