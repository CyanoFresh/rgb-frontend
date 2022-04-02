/* config-overrides.js */
/* eslint-disable react-hooks/rules-of-hooks */
const { useBabelRc, override, fixBabelImports } = require('customize-cra');

module.exports = override(
  useBabelRc(),
  fixBabelImports('@mui/material', {
    libraryDirectory: '',
    camel2DashComponentName: false,
  }),
  fixBabelImports('@mui/icons-material', {
    libraryDirectory: '',
    camel2DashComponentName: false,
  }),
);
