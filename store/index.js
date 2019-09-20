import config from "~/nuxt.config"
import _get from "lodash/get"

// Define State defaults
export const state = () => ({
    siteMeta: {},
    menuOpened: false,
    breakpoint: "desktop",
    sTop: 0,
    winHeight: 0,
    winWidth: 0
})

// Define mutations
export const mutations = {
    SET_BREAKPOINT(state, breakpoint) {
        state.breakpoint = breakpoint
    },
    OPEN_MENU(state) {
        state.menuOpened = true
    },
    CLOSE_MENU(state) {
        state.menuOpened = false
    },
    SET_S_TOP(state, pos) {
        state.sTop = pos
    },
    SET_WIN_DIMENSIONS(state, dimensions) {
        state.winHeight = dimensions.height
        state.winWidth = dimensions.width
    },
    SET_SITE_META(state, data) {
        state.siteMeta = data
    }
}

// Define actions
export const actions = {
    async nuxtServerInit(store, context) {}
}
