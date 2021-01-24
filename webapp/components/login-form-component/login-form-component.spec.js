import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import LoginFormComponent from './login-form-component.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('LoginFormComponent', () => {
    let actions
    let getters
    let store

    const setupWrapper = () => {
        store = new Vuex.Store({
            modules: {
                auth: {
                    namespaced: true,
                    state: () => ({
                        loading: false,
                        currentUser: null,
                        token: null,
                    }),
                    actions,
                    getters,
                },
            },
        })
        return shallowMount(LoginFormComponent, { store, localVue })
    }

    const login = async (wrapper) => {
        wrapper.find('input#email').setValue('somebody@example.org')
        wrapper.find('input#password').setValue('12341234')
        await wrapper.find('form').trigger('submit')
    }

    beforeEach(() => {
        getters = {
            loggedIn: () => false,
        }
        actions = {
            login: jest.fn().mockResolvedValue(true),
        }
    })

    describe('Valid credentials', () => {
        it('Shows no error', async () => {
            const wrapper = setupWrapper()
            await login(wrapper)
            expect(wrapper.find('.error').exists()).toBe(false)
        })
    })

    describe('Invalid credentials', () => {
        beforeEach(() => {
            actions.login = jest.fn().mockResolvedValue(false)
        })

        it('Shows wrong credentials message', async () => {
            const wrapper = setupWrapper()
            await login(wrapper)
            await localVue.nextTick()
            expect(wrapper.find('.error').text()).toContain(
                'Email or password incorrect.'
            )
        })
    })

    describe('In case of any other error', () => {
        beforeEach(() => {
            actions.login = jest.fn().mockRejectedValue(new Error('Ouch!'))
        })

        it('Shows error message', async () => {
            const wrapper = setupWrapper()
            await login(wrapper)
            await localVue.nextTick()
            expect(wrapper.find('.error').text()).toContain(
                'Oops! Something went wrong.'
            )
        })
    })
})
