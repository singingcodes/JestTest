import mongoose from "mongoose"
import supertest from "supertest"
import dotenv from "dotenv"
import server from "../src/server.js"
import ProductsModel from "../src/api/products/model.js"

dotenv.config() // This command forces .env variables to be loaded into process.env. It is the way to go when you cannot do -r dotenv/config

const client = supertest(server) // Supertest is capable of running server.listen and gives us back a client to be used to run http requests against our server

beforeAll(async () => {
  // Before all hook could be used to connect to mongo and also do some initial setup (like inserting some mock data)
  await mongoose.connect(process.env.MONGO_TESTDB_URL) // DO NOT FORGET TO CONNECT TO MONGO! OTHERWISE YOU GONNA GET SOME TIMEOUT ERRORS
  const newProduct = new ProductsModel(validProduct)
  await newProduct.save()
})

afterAll(async () => {
  // After all hook could be used to close the connection to mongo in the proper way and to clean up db/collections
  await ProductsModel.deleteMany()
  await mongoose.connection.close()
})

const validProduct = {

  name: "test",
  description: "bla bla bla",
  price: 10,
}

const invalidProduct = {
  name: "Invalid product",
}
const validId = "5e8f8f8f8f8f8f8f8f8f8f8"
const invalidId = ""


describe("Testing the server", () => {
  test("Should test that GET /products returns a success status code and a body", async () => {
    const response = await client.get("/products").expect(200)
    console.log(response.body)
    // expect(response.body)
  })

  test("Should test that POST /products returns a valid _id and 201", async () => {
    const response = await client.post("/products").send(validProduct).expect(201)
    expect(response.body._id).toBeDefined()
  })

  test("Should test that POST /products returns a valid 400 in case of not valid product", async () => {
    const response = await client.post("/products").send(invalidProduct).expect(400)
  })

  test("should test the GET /products/:id", async () => {
    const response = await client.get(`/products/${validId}`).response
    expect(200)
  })
  test("should return a 404 when trying to get a product with an invalid id", async () => {
    const response = await client.get(`/products/invalidId`).response
    expect(404)
  })
  test("should DELETE /products/:id", async () => {
    const response = await client.delete(`/products/${validId}`)
    expect(204) 
  })
  test("should return a 404 when trying to delete a product with an invalid id", async () => {
    const response = await client.delete(`/products/invalidId`)
    expect(404)
  })
  test("should PUT /products/:id", async () => {
    const response = await client.put(`/products/${validId}`).send(validProduct)
    expect(200)
  })
  test("should return a 404 when trying to update a product with an invalid id", async () => {
    const response = await client.put(`/products/invalidId`).send(validProduct)
    expect(404)
  })
  test("should return a 400 when trying to update a product with invalid data", async () => {
    const response = await client.put(`/products/${validId}`).send(invalidProduct)
    expect(400)
  }
  )
})
