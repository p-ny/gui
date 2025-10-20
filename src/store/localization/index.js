// import * as ru from './utils/ru.json';
import * as lang from './utils/en.json';
// import * as list from './utils/list.json';

export default {
    namespaced: true,
    state: {
        local: null,
        apiURL: 'http://127.0.0.1/api/localize/', //https://translate.mikzzz.ru/api/localize/
        listUrl: 'http://127.0.0.1/api/localize/list',
        langs: {
            list: null,
            cur: 'no'
        }
    },
    actions: {
        translateAction({ getters }, { id, msg }) {
            window.mp.trigger('tag:add:action', id, getters['loc'](msg));
        },
        setLang({ state, dispatch }, lang) {
            window.mp.trigger('language:save', lang);
            if (lang === state.langs.cur) return;
            state.langs.cur = lang;
            //document.getElementsByTagName("html")[0].lang = state.langs.cur;
            dispatch('loadLanguage');
        },
        async loadLanguage({ state, dispatch }) {
            state.local = lang;
            // switch (state.langs.cur) {
            //     case 'ru':
            //         state.local = ru;
            //         break;
            //     case 'en':
            //         state.local = en;
            //         break;
            //     default:
            //         state.local = ru;
            // }

            if (state.langs.cur === 'no') {
                setTimeout(() => {
                    dispatch('loadLanguage');
                }, 1000);
            }

            // if (!ru || !en) {
            //     setTimeout(() => {
            //         dispatch('loadLanguage');
            //     }, 1000);
            // }

            // let response = await window.fetch(state.apiURL + state.langs.cur);
            // if(response.ok){
            //     state.local = await response.json();
            // }else{
            //     setTimeout(()=>{
            //         dispatch("loadLanguage");
            //     }, 1000)
            // }
        },
        async loadLangs({ state }) {
            // state.langs.list = list;
            state.langs.list = { 'ru': 'Russian', 'en': 'English' };

            // if (!list) {
            //     state.langs.list = { 'ru': 'Russian', 'en': 'English' };
            // }

            // let response = await window.fetch(state.listUrl);
            // if(response.ok){
            //     state.langs.list = await response.json();
            // }else{
            //     state.langs.list = {"ru":"Russian"};
            // }
        }
    },
    modules: {},
    getters: {
        loc: state => msg => {
            if (state.local === null || typeof msg !== 'string') return msg;
            const array = msg.split('@');
            let key = array[0];
            if (state.local[key] === undefined) {
                if (process.env.NODE_ENV == 'development') window.console.log(`Key ${key} don't have value`);
                return key;
            } else {
                let message = state.local[key];
                const params = array.slice(1);
                if (params.length > 0) {
                    for (let index = 0; index < params.length; index++) {
                        const param = params[index];
                        if (message.indexOf(`{${index}}`) === -1)
                            message += ` ${state.local[param] ? state.local[param] : param}`;
                        else
                            message = message.replace(`{${index}}`, state.local[param] ? state.local[param] : param);
                    }
                }
                return message;
            }

        },
        font(state) {
            switch (state.langs.cur) {
                case 'ge':
                    return 'Georgian';
                default:
                    return 'Russian';
            }
        }
    }
};