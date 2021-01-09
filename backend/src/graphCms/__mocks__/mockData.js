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
    password: "$2b$10$5ds53bcFtQqj3I3JfKFKPO48WRRaV/Ozc1PRVnD4DE0.VGvqdCVBy" //literally "password"
  }),

//   Query:() => ({
//       person: () => null
//   })
};
