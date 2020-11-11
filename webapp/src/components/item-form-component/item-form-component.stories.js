import ItemFormComponent from "./item-form-component.vue";

export default {
    title: 'ItemFormComponent',
    component: ItemFormComponent,
    argTypes: {
      onSubmit: { action: "Create Item"},
    },
  };

  const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { ItemFormComponent },
    template: '<ItemFormComponent @submitEvent="onSubmit"/>',
    
});
  
  export const Base = Template.bind({});