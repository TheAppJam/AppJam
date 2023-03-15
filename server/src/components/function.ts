export const functionTemplate = (queries) => {
  const functions = queries.map((query) => {
    if (!query.options.runOnPageLoad) return;
    return `${query.name}()`;
  });
  return `useEffect(() => {${functions.join('\n')}}, []);`;
};
