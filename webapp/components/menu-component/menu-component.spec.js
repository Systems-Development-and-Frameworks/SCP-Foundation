import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import MenuComponent from "./menu-component";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("MenuComponent", () => {
  let actions;
  let getters;
  let store;

  const setupWrapper = () => {
    store = new Vuex.Store({
      modules: {
        auth: {
          namespaced: true,
          state: () => ({
            loading: false,
            currentUser: null,
            token: "SomeRandomToken"
          }),
          actions,
          getters
        }
      }
    });
    return shallowMount(MenuComponent, {
      store,
      localVue,
      stubs: {
        NuxtLink: true
      }
    });
  };

  beforeEach(() => {
    getters = {
      loggedIn: () => false
    };
  });

  describe("Menu Button", () => {
    it("Shows the Login button", async () => {
      getters = {
        loggedIn: () => false
      };
      const wrapper = setupWrapper();

      expect(wrapper.find("#loginButton").exists()).toBe(true);
    });

    it("Shows the Login button", async () => {
      getters = {
        loggedIn: () => true
      };
      const wrapper = setupWrapper();

      expect(wrapper.find("#logoutButton").exists()).toBe(true);
    });
  });
});
