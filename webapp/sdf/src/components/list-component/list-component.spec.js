import { mount } from '@vue/test-utils'
import ListComponent from 'components/list-component/list-component.vue'
import Item from 'classes/item.js'
import ItemComponent from 'components/item-component/item-component.vue'

describe('list-component', () => {
    describe('item list', () => {
        describe('empty', () => {
            it ('shows message "The list is empty!"', async () => {
                let component = mount(ListComponent, {
                    data() { return {itemList: []}}
                })
                const h2Element = component.find('.list-empty')
                expect(h2Element.text()).toEqual("The list is empty!")
            })
        })

        describe('not empty', () => {
            let component

            beforeEach(() => {
                component = mount(ListComponent, {
                    data() { return {
                        itemList: [
                            new Item(1, "Eintrag1", 5),
                            new Item(2, "Eintrag2", 2),
                            new Item(3, "Eintrag3", -2)
                        ]
                    }}
                })
            })

            describe('renders ItemComponent for each item', () => {
                it('renders 3 components', async () => {
                    const itemComponents = component.findAllComponents(ItemComponent)
                    expect(itemComponents.length).toBe(3)
                })
            })

            describe('receives remove event for item 1', () => {
                it('removes item 1', async () => {
                    component.findComponent(ItemComponent).vm.$emit('removeEvent', {
                        id:1, title:"Eintrag1", votes:5
                    })
                    await component.vm.$nextTick()
                    expect(component.vm.$data.itemList.some(item =>
                        item.id == 1 &&
                        item.title =="Eintrag1" &&
                        item.votes == 5
                    )).toBe(false)
                })
            
                it('does not remove item 2', async () => {
                    component.findComponent(ItemComponent).vm.$emit('removeEvent', {
                        id:1, title:"Eintrag1", votes:5
                    })
                    await component.vm.$nextTick()
                    expect(component.vm.$data.itemList.some(item =>
                        item.id == 2 &&
                        item.title =="Eintrag2" &&
                        item.votes == 2
                    )).toBe(true)
                })
            
                it('does not remove item 3', async () => {
                    component.findComponent(ItemComponent).vm.$emit('removeEvent', {
                        id:1, title:"Eintrag1", votes:5
                    })
                    await component.vm.$nextTick()
                    expect(component.vm.$data.itemList.some(item =>
                        item.id == 3 &&
                        item.title =="Eintrag3" &&
                        item.votes == -2
                    )).toBe(true)
                })
            })

            describe('receives update event for item 1', () => {
                it('removes old item 1', async () => {
                    component.findComponent(ItemComponent).vm.$emit('updateEvent', new Item(1, "Eintrag1", 6))
                    await component.vm.$nextTick()
                    expect(component.vm.$data.itemList.some(item =>
                        item.id == 1 &&
                        item.title =="Eintrag1" &&
                        item.votes == 5
                    )).toBe(false)
                })
                
                it('adds new item 1', async () => {
                    component.findComponent(ItemComponent).vm.$emit('updateEvent', new Item(1, "Eintrag1", 6))
                    await component.vm.$nextTick()
                    expect(component.vm.$data.itemList.some(item =>
                        item.id == 1 &&
                        item.title =="Eintrag1" &&
                        item.votes == 6
                    )).toBe(true)
                })
                
                it('does not remove item 2', async () => {
                    component.findComponent(ItemComponent).vm.$emit('updateEvent', new Item(1, "Eintrag1", 6))
                    await component.vm.$nextTick()
                    expect(component.vm.$data.itemList.some(item =>
                        item.id == 2 &&
                        item.title =="Eintrag2" &&
                        item.votes == 2
                    )).toBe(true)
                })
            
                it('does not remove item 3', async () => {
                    component.findComponent(ItemComponent).vm.$emit('updateEvent', new Item(1, "Eintrag1", 6))
                    await component.vm.$nextTick()
                    expect(component.vm.$data.itemList.some(item =>
                        item.id == 3 &&
                        item.title =="Eintrag3" &&
                        item.votes == -2
                    )).toBe(true)
                })
            })

            describe('toggle order button clicked', () => {
                it('was ascending, now descending', async () => {
                    const toggleButton = component.find('.toggle-btn')
                    toggleButton.trigger('click')
                    await component.vm.$nextTick()
                    const firstElement = component.findComponent(ItemComponent)
                    expect(firstElement.text()).toContain('Eintrag3')
                })

                it('was descending, now ascending', async () => {
                    const toggleButton = component.find('.toggle-btn')
                    toggleButton.trigger('click')
                    await component.vm.$nextTick()
                    toggleButton.trigger('click')
                    await component.vm.$nextTick()
                    const firstElement = component.findComponent(ItemComponent)
                    expect(firstElement.text()).toContain('Eintrag1')
                })
            })
        })
    })
})