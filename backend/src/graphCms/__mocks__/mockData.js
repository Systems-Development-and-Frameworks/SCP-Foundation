export const mocks = {
  Int: () => 6,
  Float: () => 22.1,
  String: () => "Hello",
  Post: () => ({
    id: "post id",
    title: "title",
  }),
  Person: () => ({
    id: "Person id",
    name: "Günther",
    email: "günther.jauch@aol.de",
  }),
};
