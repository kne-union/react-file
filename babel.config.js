module.exports = api => {
  api.cache.using(() => process.env.NODE_ENV);

  return {
    presets: [require.resolve('babel-preset-react-app')]
  };
};
