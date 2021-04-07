import axios from 'axios';
import {AUTH_SUCCESS, AUTH_LOGOUT, AUTH_ERROR} from './actionTypes';

export function auth(email, password, isLogin) {
    return async dispatch => {
        const apiKey = 'AIzaSyBULjhi0T98lyrjHdPiNN27rlDH_6AVBWo';
        const authData = {
            email,
            password,
            returnSecureToken: true,
        };

        let url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`;

        if (isLogin) {
            url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;
        }

        try {
            const response = await axios.post(url, authData);
            const data = response.data;
            const expirationDate = new Date(new Date().getTime() + data.expiresIn * 1000);

            localStorage.setItem('token', data.idToken);
            localStorage.setItem('userId', data.localId);
            localStorage.setItem('expirationDate', expirationDate);

            dispatch(authSuccess(data.idToken));
            dispatch(autoLogout(data.expiresIn));
        } catch (e) {
            dispatch(authError(e));
        }
    };
}

export function autoLogout(time) {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, time * 1000);
    };
}

export function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('expirationDate');
    return {
        type: AUTH_LOGOUT,
    };
}

export function autoLogin() {
    return dispatch => {
        const token = localStorage.getItem('token');
        if (!token) {
            dispatch(logout());
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if (expirationDate <= new Date()) {
                dispatch(logout());
            } else {
                dispatch(authSuccess(token));
                dispatch(autoLogout((expirationDate.getTime() - new Date().getTime()) / 1000));
            }
        }
    };
}

export function authSuccess(token) {
    return {
        type: AUTH_SUCCESS,
        token,
    };
}

export function authError(e) {
    return {
        type: AUTH_ERROR,
        error: e,
    };
}
