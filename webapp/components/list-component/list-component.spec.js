import { shallowMount, createLocalVue, mount } from "@vue/test-utils";
import Vuex from "vuex";
import ListComponent from "./list-component.vue";
import Item from "../../classes/item.js";
import ItemComponent from "../item-component/item-component.vue";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("list-component", () => {
  let wrapper;
  let authActions;
  let authGetters;
  let postsActions;
  let postsGetters;
  let store;
  let itemList = [];

  const setupWrapper = () => {
    store = new Vuex.Store({
      modules: {
        auth: {
          namespaced: true,
          state: () => ({
            loading: false,
            currentUser: "1",
            token: "SomeRandomToken"
          }),
          actions: authActions,
          getters: authGetters
        },
        posts: {
          namespaced: true,
          state: () => ({
            loading: false
          }),
          actions: postsActions,
          getters: postsGetters
        }
      }
    });
    return mount(ListComponent, {
      store,
      localVue,
      data() {
        return {
          itemList: itemList,
        };
      }
    });
  };


  describe("item list", () => {
    describe("empty", () => {
      it('shows message "The list is empty!"', async () => {
        postsActions = {
          getPosts: jest.fn().mockResolvedValue({})
        };
        authGetters = {
          loggedIn: () => true,
          currentUserId: () => "1"
        };
        wrapper = setupWrapper();
        const h2Element = wrapper.find(".list-empty");
        expect(h2Element.text()).toEqual("The list is empty!");
      });
    });

    describe("not empty", () => {
      beforeEach(() => {
        postsActions = {
          getPosts: jest.fn().mockResolvedValue({
            posts: [
              { id: 1, title: "Eintrag1", voteResult: 5, author: { id: "1" } },
              { id: 2, title: "Eintrag2", voteResult: 2, author: { id: "1" } },
              { id: 3, title: "Eintrag3", voteResult: -2, author: { id: "1" } }
            ]
          })
        };

        authGetters = {
          loggedIn: () => true,
          currentUserId: () => "1"
        };

        itemList = [
          new Item(1, "Eintrag1", 5, { id: "1" }),
          new Item(2, "Eintrag2", 2, { id: "1" }),
          new Item(3, "Eintrag3", -2, { id: "1" })
        ];
      });

      describe("renders ItemComponent for each item", () => {
        it("renders 3 components", async () => {
          wrapper = setupWrapper();
          const itemComponents = await wrapper.findAllComponents(ItemComponent);
          expect(itemComponents.length).toBe(3);
        });
      });

      describe("receives remove event for item 1", () => {
        it("removes item 1", async () => {
          wrapper = setupWrapper();
          await wrapper.findComponent(ItemComponent).vm.$emit("removeEvent", {
            id: 1,
            title: "Eintrag1",
            votes: 5,
            author: {id: "1"}
          });
          await wrapper.vm.$nextTick();
          console.log(wrapper.vm.$data.itemList)
          expect(
            wrapper.vm.$data.itemList.some(
              item =>
                item.id == 1 && item.title == "Eintrag1" && item.votes == 5
            )
          ).toBe(false);
        });

        it("does not remove item 2", async () => {
          wrapper = setupWrapper();
          wrapper.findComponent(ItemComponent).vm.$emit("removeEvent", {
            id: 1,
            title: "Eintrag1",
            votes: 5
          });
          await wrapper.vm.$nextTick();
          expect(
            wrapper.vm.$data.itemList.some(
              item =>
                item.id == 2 && item.title == "Eintrag2" && item.votes == 2
            )
          ).toBe(true);
        });

        it("does not remove item 3", async () => {
          wrapper = setupWrapper();
          wrapper.findComponent(ItemComponent).vm.$emit("removeEvent", {
            id: 1,
            title: "Eintrag1",
            votes: 5
          });
          await wrapper.vm.$nextTick();
          expect(
            wrapper.vm.$data.itemList.some(
              item =>
                item.id == 3 && item.title == "Eintrag3" && item.votes == -2
            )
          ).toBe(true);
        });
      });

      describe("receives update event for item 1", () => {
        it("removes old item 1", async () => {
          wrapper = setupWrapper();
          wrapper
            .findComponent(ItemComponent)
            .vm.$emit("updateEvent", new Item(1, "Eintrag1", 6, {id: 1}));
          await wrapper.vm.$nextTick();
          expect(
            wrapper.vm.$data.itemList.some(
              item =>
                item.id == 1 && item.title == "Eintrag1" && item.votes == 5
            )
          ).toBe(false);
        });

        it("adds new item 1", async () => {
          wrapper = setupWrapper();
          wrapper
            .findComponent(ItemComponent)
            .vm.$emit("updateEvent", new Item(1, "Eintrag1", 6, {id: 1}));
          await wrapper.vm.$nextTick();
          expect(
            wrapper.vm.$data.itemList.some(
              item =>
                item.id == 1 && item.title == "Eintrag1" && item.votes == 6
            )
          ).toBe(true);
        });

        it("does not remove item 2", async () => {
          wrapper = setupWrapper();
          wrapper
            .findComponent(ItemComponent)
            .vm.$emit("updateEvent", new Item(1, "Eintrag1", 6, {id: 1}));
          await wrapper.vm.$nextTick();
          expect(
            wrapper.vm.$data.itemList.some(
              item =>
                item.id == 2 && item.title == "Eintrag2" && item.votes == 2
            )
          ).toBe(true);
        });

        it("does not remove item 3", async () => {
          wrapper = setupWrapper();
          wrapper
            .findComponent(ItemComponent)
            .vm.$emit("updateEvent", new Item(1, "Eintrag1", 6, {id: 1}));
          await wrapper.vm.$nextTick();
          expect(
            wrapper.vm.$data.itemList.some(
              item =>
                item.id == 3 && item.title == "Eintrag3" && item.votes == -2
            )
          ).toBe(true);
        });
      });

      describe("toggle order button clicked", () => {
        it("was ascending, now descending", async () => {
          wrapper = setupWrapper();
          const toggleButton = wrapper.find(".toggle-btn");
          toggleButton.trigger("click");
          await wrapper.vm.$nextTick();
          const firstElement = wrapper.findComponent(ItemComponent);
          expect(firstElement.text()).toContain("Eintrag3");
        });

        it("was descending, now ascending", async () => {
          wrapper = setupWrapper();
          const toggleButton = wrapper.find(".toggle-btn");
          toggleButton.trigger("click");
          await wrapper.vm.$nextTick();
          toggleButton.trigger("click");
          await wrapper.vm.$nextTick();
          const firstElement = wrapper.findComponent(ItemComponent);
          expect(firstElement.text()).toContain("Eintrag1");
        });
      });
    });
  });
});
