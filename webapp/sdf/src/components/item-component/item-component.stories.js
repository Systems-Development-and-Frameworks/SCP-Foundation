import ItemComponent from "./item-component.vue";
import Item from "../../classes/item";

export default {
    title: 'ItemComponent',
    component: ItemComponent,
    argTypes: {
      removeItem: { action: "Delete Item"},
      updateItem: { action: "Update Item"}
    },
  };

  const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { ItemComponent },
    template: '<ItemComponent :item="$props.item" @removeEvent="removeItem" @updateEvent="updateItem"/>',
    
});
  
  export const Base = Template.bind({});
  Base.args = {
      item: new Item(1, 'VueJS', 3)
  };