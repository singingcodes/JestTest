import mongoose from "mongoose"
import listEndpoints from "express-list-endpoints"
import server from "./server.js"

const port = process.env.PORT || 3001

mongoose.connect(process.env.MONGO_URL)

mongoose.connection.on("connected", () => {
  // If we execute the server here, JEST will not run properly and it will try to start the server over and over again, in particular when we gonna restart the tests, we gonna get PORT ALREADY IN USE errors
  server.listen(port, () => {
    console.table(listEndpoints(server))
  })
})
