import axios from 'axios'; // Axios - Библиотека для работы с сервером (ajax запросами) (Не обходимо установить как зависимость!).

export default axios.create({
    baseURL: 'https://react-quiz-wdr-default-rtdb.firebaseio.com/',
});
