const express = require("express");
const app = express();
app.use(express.json());
const loginMiddleware = (req, res, next) => {
  console.log(`${req.method} - ${req.url}`);
  next();
};
// app.use(loginMiddleware);
const PORT = process.env.PORT || 3000;
const mockUsers = [
  { id: 1, username: "anson", displayName: "Anson" },
  { id: 2, username: "jack", displayName: "Jack" },
  { id: 3, username: "adam", displayName: "Adam" },
  { id: 4, username: "tina", displayName: "Tina" },
  { id: 5, username: "jason", displayName: "Jason" },
  { id: 6, username: "henry", displayName: "Henry" },
  { id: 7, username: "marilyn", displayName: "Marilyn" },
];
app.get("/", (req, res) => {
  res.status(201).send({ msg: "Hello, World!" });
});

// app.use(loginMiddleware, (req, res, next) => {
//   console.log("finished logging...");
//   next();
// });

app.get("/api/users", (req, res) => {
  const {
    query: { filter, value },
  } = req;
  //when filter and value are undefiend
  if (!filter && value) return res.send(mockUsers);
  if (filter && value)
    return res.send(mockUsers.filter((user) => user[filter].includes(value)));
});

app.post("/api/users", (req, res) => {
  console.log(req.body);
  const { body } = req;
  const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...body };
  mockUsers.push(newUser);
  return res.status(201).send(newUser);
});

app.get("/api/products", (req, res) => {
  res.send([{ id: 123, name: "chicken breast", price: 12.99 }]);
});

app.get("/api/users/:id", (req, res) => {
  const parsedId = parseInt(req.params.id);
  console.log(parsedId);
  if (isNaN(parsedId)) {
    return res.status(400).send({ msg: "Bad Request,invalid ID" });
  }
  const findUsers = mockUsers.find((user) => user.id === parsedId);
  if (!findUsers) return res.sendStatus(404);
  return res.send(findUsers);
});

app.put("/api/users/:id", (req, res) => {
  const {
    body,
    params: { id },
  } = req;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return res.sendStatus(400);

  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
  if (findUserIndex === -1) return res.sendStatus(404);
  mockUsers[findUserIndex] = { id: parsedId, ...body };
  return req.sendStatus(200);
});

app.patch("/api/users/:id", (req, res) => {
  const {
    body,
    params: { id },
  } = req;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return res.sendStatus(400);
  if (findUserIndex === -1) return res.sendStatus(404);
  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  return res.sendStatus(200);
});

app.delete("/api/users/:id", (req, res) => {
  const {
    params: { id },
  } = req;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return res.sendStatus(400);
  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
  if (findUserIndex === -1) return res.sendStatus(404);
  mockUsers.splice(findUserIndex, 1);
  return res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(` running on port ${PORT}`);
});
