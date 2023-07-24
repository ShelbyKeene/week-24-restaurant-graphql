var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');

var restaurants = [
  {
    id: 1,
    name: "New Restaurant 1",
    description: "This is a new restaurant with some delicious dishes.",
    dishes: [
      {
        name: "New Dish 1",
        price: 10,
      },
      {
        name: "New Dish 2",
        price: 15,
      },
    ],
  },
  {
    id: 2,
    name: "New Restaurant 2",
    description: "A trendy restaurant with a unique atmosphere.",
    dishes: [
      {
        name: "Trendy Dish",
        price: 20,
      },
    ],
  },
  {
    id: 3,
    name: "New Restaurant 3",
    description: "Serving exotic cuisine from around the world.",
    dishes: [
      {
        name: "Exotic Dish 1",
        price: 25,
      },
      {
        name: "Exotic Dish 2",
        price: 30,
      },
      {
        name: "Exotic Dessert",
        price: 12,
      },
    ],
  },
];

var schema = buildSchema(`
  type Query {
    restaurant(id: Int): restaurant
    restaurants: [restaurant]
  }

  type restaurant {
    id: Int
    name: String
    description: String
    dishes: [Dish]
  }

  type Dish {
    name: String
    price: Int
  }

  input restaurantInput {
    name: String
    description: String
  }

  type DeleteResponse {
    ok: Boolean!
  }
  

  type Mutation {
    setrestaurant(input: restaurantInput): restaurant
    deleterestaurant(id: Int!): DeleteResponse
    editrestaurant(id: Int!, name: String, description: String): restaurant
  }
`);

var root = {
  restaurant: ({ id }) => restaurants.find(restaurant => restaurant.id === id),
  restaurants: () => restaurants,
  setrestaurant: ({ input }) => {
    const newRestaurant = {
      id: restaurants.length + 1,
      name: input.name,
      description: input.description,
      dishes: [],
    };
    restaurants.push(newRestaurant);
    return newRestaurant;
  },

  deleterestaurant: ({ id }) => {
    const index = restaurants.findIndex(restaurant => restaurant.id === id);
    if (index === -1) {
      throw new Error("Restaurant not found");
    }

    restaurants.splice(index, 1);
    return { ok: true };
  },




  editrestaurant: ({ id, ...restaurant }) => {
    const index = restaurants.findIndex(restaurant => restaurant.id === id);
    if (index === -1) {
      throw new Error("Restaurant not found");
    }

    const updatedRestaurant = {
      ...restaurants[index],
      ...restaurant,
    };
    restaurants[index] = updatedRestaurant;
    return updatedRestaurant;
  },
};

var app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);


app.listen(5050);
console.log('Running a GraphQL API server at http://localhost:5050/graphql');


