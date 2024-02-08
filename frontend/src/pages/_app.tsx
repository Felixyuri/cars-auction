import 'tailwindcss/tailwind.css'
import { ConfigProvider } from 'antd';
import { AuthProvider } from '../../contexts/AuthContext'
import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';

function MyApp({ Component, pageProps }: any) {
  return (
    <AuthProvider>
      <ConfigProvider>
        <Component {...pageProps} />
      </ConfigProvider>
    </AuthProvider>
  )
}

export default MyApp