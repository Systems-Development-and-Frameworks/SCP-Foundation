export const mocks = {
  Int: () => 6,
  Float: () => 22.1,
  String: () => "Hello",
  Post: () => ({
    title: "Post title",
    text: "Post text",
  }),
  Person: () => ({
    name: "Günther",
    email: "günther.jauch@aol.de",
    password: "$2b$10$5ds53bcFtQqj3I3JfKFKPO48WRRaV/Ozc1PRVnD4DE0.VGvqdCVBy" //literally "password"
  }),
};
