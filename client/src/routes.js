import { MASTER_ROUTE, CLIENT_ROUTE, LOGIN_ROUTE, REG_ROUTE, MAIN_ROUTE } from "./utils/consts"

import Master from "./pages/Master"
import Client from "./pages/Client"
import Auth from "./pages/Auth"
import Main from "./pages/Main"

// список маршрутов к которым имеет доступ авторизованный пользователь
export const authRoutes = [
    {
        path: MASTER_ROUTE,
        Component: Master
    },
    {
        path: CLIENT_ROUTE,
        Component: Client
    }
]

export const publicRoutes = [
    {
        path: LOGIN_ROUTE,
        Component: Auth
    },
    {
        path: REG_ROUTE,
        Component: Auth
    },
    {
        path: MAIN_ROUTE,
        Component: Main
    }
]