import 'tailwindcss/tailwind.css'
import { ConfigProvider } from 'antd';
import { AuthProvider } from '../../contexts/AuthContext'
import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function MyApp({ Component, pageProps }: any) {
  return (
    <AuthProvider>
      <ToastContainer hideProgressBar={true} />
      <ConfigProvider>
        <Component {...pageProps} />
      </ConfigProvider>
    </AuthProvider>
  )
}

export default MyApp