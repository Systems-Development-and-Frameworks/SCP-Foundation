import { mount } from '@vue/test-utils'
import ItemComponent from 'components/item-component/item-component.vue'
import Item from 'classes/item.js'

describe('item-component', () => {
let component

    beforeEach(() => {
        component = mount(ItemComponent, {
            propsData: {
                item : new Item(1, "Eintrag2", 2)
            }
        });
    })

    it('contains item title and votes Expected --> Eintrag (2)', () => {
        expect(component.text()).toContain('Eintrag2 (2)')
    })

    it('emits remove event', async () => {
        const removeButton = component.find('.remove-button')
        removeButton.trigger('click')
        await component.vm.$nextTick()
        expect(component.emitted().removeEvent).toBeTruthy()
    })

    it('emits update event +1', async () => {
        const upvoteButton = component.find('.upvote-button')
        upvoteButton.trigger('click')
        await component.vm.$nextTick()
        expect(component.emitted().updateEvent).toBeTruthy()
    })

    it('emits update event -1', async () => {
        const downvoteButton = component.find('.downvote-button')
        downvoteButton.trigger('click')
        await component.vm.$nextTick()
        expect(component.emitted().updateEvent).toBeTruthy()
    })

    it('updates votes +1', async () => {
        const upvoteButton = component.find('.upvote-button')
        upvoteButton.trigger('click')
        await component.vm.$nextTick()
        expect(component.emitted().updateEvent[0][0].votes).toEqual(3)
    })

    it('updates votes -1', async () => {
        const downvoteButton = component.find('.downvote-button')
        downvoteButton.trigger('click')
        await component.vm.$nextTick()
        expect(component.emitted().updateEvent[0][0].votes).toEqual(1)
    })

    it('emits remove event with correct item', async () => {
        const removeButton = component.find('.remove-button')
        removeButton.trigger('click')
        await component.vm.$nextTick()
        expect(component.emitted().removeEvent[0][0]).toEqual({id: 1, title: 'Eintrag2', votes: 2})
    })
})