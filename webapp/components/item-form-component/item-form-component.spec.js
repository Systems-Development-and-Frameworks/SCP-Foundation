import { mount } from '@vue/test-utils'
import ItemFormComponent from './item-form-component.vue'

describe('item-form-component', () => {
    let component

    beforeEach(() => {
        component = mount(ItemFormComponent, {
            data() {return {
                title: "test"
            }}
        })
    })

    it('emits submit event', async () => {
        const submitButton = component.find('.submit-button')
        submitButton.trigger('submit')
        await component.vm.$nextTick()
        expect(component.emitted().submitEvent).toBeTruthy()
    })

    it('submit event title == "test"', async () => {
        const submitButton = component.find('.submit-button')
        submitButton.trigger('submit')
        await component.vm.$nextTick()
        expect(component.emitted().submitEvent[0]).toEqual(["test"])
    })

    it('submit event not emitted when title == ""', async () => {
        await component.setData({title:""})
        const submitButton = component.find('.submit-button')
        submitButton.trigger('submit')
        await component.vm.$nextTick()
        expect(component.emitted().submitEvent).not.toBeTruthy()
    })
})
