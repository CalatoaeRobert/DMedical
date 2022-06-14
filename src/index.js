import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css'
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from 'web3uikit'
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
    <MoralisProvider appId='L1N8KnhXQYCKoJyeRd95qZf1will3QM0DE8YzlJS' serverUrl='https://y6jxsxjnbbo1.usemoralis.com:2053/server'>
        <NotificationProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </NotificationProvider>
    </MoralisProvider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
