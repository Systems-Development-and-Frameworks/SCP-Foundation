import ListComponent from "./list-component.vue";

export default {
    title: 'ListComponent',
    component: ListComponent,
  };

  const Template = () => ({
    components: { ListComponent },
    template: '<ListComponent />',
    
});
  
  export const Base = Template.bind({});