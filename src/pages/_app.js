import React from 'react';
import { ConfigProvider } from 'antd';
import '../../public/react-min-package/react.min';
import '../../public/react-min-package/react-dom.min.js';
import theme from '../theme/themeConfig';

const App = ({ Component, pageProps }) => (
  <ConfigProvider theme={theme}>
    <Component {...pageProps} />
  </ConfigProvider>
);

export default App;
