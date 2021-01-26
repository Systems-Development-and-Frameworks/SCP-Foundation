import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import ItemComponent from "./item-component.vue";
import Item from "../../classes/item.js";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("item-component", () => {
  let wrapper;
  let authActions;
  let authGetters;
  let postsActions;
  let postsGetters;
  let store;

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
    return shallowMount(ItemComponent, {
      store,
      localVue,
      propsData: {
        item: new Item(1, "Eintrag2", 2, { id: "1" })
      }
    });
  };

  beforeEach(() => {
    authGetters = {
      loggedIn: () => true,
      currentUserId: () => "1"
    };
  });

  it("contains item title and votes Expected --> Eintrag (2)", () => {
    wrapper = setupWrapper();
    expect(wrapper.text()).toContain("Eintrag2 (2)");
  });

  it("doesn't show the remove button due to not being the owner", () => {
    authGetters = {
      loggedIn: () => true,
      currentUserId: () => "2"
    };
    wrapper = setupWrapper();
    expect(wrapper.find(".remove-button").exists()).toBeFalsy();
  });

  it("doesn't show the remove button due to not being logged in", () => {
    authGetters = {
      loggedIn: () => false,
    };
    wrapper = setupWrapper();
    expect(wrapper.find(".remove-button").exists()).toBeFalsy();
  });

  it("emits remove event", async () => {
    wrapper = setupWrapper();
    const removeButton = wrapper.find(".remove-button");
    await removeButton.trigger("click");
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted().removeEvent).toBeTruthy();
  });

  it("emits update event +1", async () => {
    postsActions = {
      vote: jest.fn().mockResolvedValue({vote: {voteResult: 3}})
    };
    wrapper = setupWrapper();
    const upvoteButton = wrapper.find(".upvote-button");
    await upvoteButton.trigger("click");
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted().updateEvent).toBeTruthy();
  });

  it("emits update event -1", async () => {
    postsActions = {
      vote: jest.fn().mockResolvedValue({vote: {voteResult: 1}})
    };
    wrapper = setupWrapper();
    const downvoteButton = wrapper.find(".downvote-button");
    await downvoteButton.trigger("click");
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted().updateEvent).toBeTruthy();
  });

  it("updates votes +1", async () => {
    postsActions = {
      vote: jest.fn().mockResolvedValue({vote: {voteResult: 3}})
    };
    wrapper = setupWrapper();
    const upvoteButton = wrapper.find(".upvote-button");
    await upvoteButton.trigger("click");
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted().updateEvent[0][0].votes).toEqual(3);
  });

  it("updates votes -1", async () => {
    postsActions = {
      vote: jest.fn().mockResolvedValue({vote: {voteResult: 1}})
    };
    wrapper = setupWrapper();
    const downvoteButton = wrapper.find(".downvote-button");
    await downvoteButton.trigger("click");
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted().updateEvent[0][0].votes).toEqual(1);
  });

  it("emits remove event with correct item", async () => {
    wrapper = setupWrapper();
    const removeButton = wrapper.find(".remove-button");
    await removeButton.trigger("click");
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted().removeEvent[0][0]).toEqual({
      id: 1,
      title: "Eintrag2",
      votes: 2,
      author: {
        id: "1"
      }
    });
  });
});
