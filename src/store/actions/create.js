import {CREATE_QUIZ_QUESTION, RESET_QUIZ_CREATION, CREATE_QUIZ_ERROR} from './actionTypes';
import axios from '../../axios/axios-quiz';

export function createQuizQuestion(item) {
    return {
        type: CREATE_QUIZ_QUESTION,
        item,
    };
}

export function resetQuizCreation() {
    return {
        type: RESET_QUIZ_CREATION,
    };
}

export function finishCreateQuiz() {
    return async (dispatch, getState) => {
        try {
            await axios.post('/quizes.json', getState().create.quiz);
            dispatch(resetQuizCreation());
        } catch (e) {
            dispatch(createQuizError(e));
        }
    };
}

export function createQuizError(e) {
    return {
        type: CREATE_QUIZ_ERROR,
        error: e
    }
}