// <script src="http://192.168.1.214:8097"></script>
import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Provider} from "./components/ui/provider.jsx";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Provider>
            <App/>
        </Provider>
    </StrictMode>,
)
