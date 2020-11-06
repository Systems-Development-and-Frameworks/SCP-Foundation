import { createWrapper, mount } from '@vue/test-utils'
import ItemFormComponent from 'components/item-form-component/item-form-component.vue'

describe('item-form-component', () => {
    let component

    beforeEach(() => {
        component = mount(ItemFormComponent)
    })

    it('emits submit event', async () => {
        const submitButton = component.find('.submit-button')
        submitButton.trigger('submit')
        await component.vm.$nextTick()
        expect(component.emitted().submitEvent).toBeTruthy()
    })

    it('submit event title == "test"', async () => {
        await component.setData({title:"test"})
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