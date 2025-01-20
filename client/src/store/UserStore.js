import {makeAutoObservable} from "mobx";

export default class UserStore {
    constructor() {
        // не изменяемая переменная - _
        this._isAuth = false;
        this._user = {};

        // применяем MobX для автоматического отслеживания изменений
        makeAutoObservable(this);
    }

    // экшен = изменяет состояние
    setIsAuth(bool) {
        this._isAuth = bool; // установить статус аутентификации
    }
    setUser(user) {
        this._user = user; // установить информацию о пользователе
    }

    // компьютед функции - вызываются только в том случае, если переменная внутри была изменена
    get isAuth() {
        return this._isAuth; // возвращает статус аутентификации
    }
    get user() {
        return this._user; // возвращает информацию о пользователе
    }
}