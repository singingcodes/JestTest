import express from "express"
import createError from "http-errors"
import ProductsModel from "./model.js"

const productsRouter = express.Router()

productsRouter.post("/", async (req, res, next) => {
  try {
    const newUser = new ProductsModel(req.body)
    const { _id } = await newUser.save()
    res.status(201).send({ _id })
  } catch (error) {
    next(error)
  }
})

productsRouter.get("/", async (req, res, next) => {
  try {
    const users = await ProductsModel.find()
    res.send(users)
  } catch (error) {
    next(error)
  }
})

productsRouter.get("/:productId", async (req, res, next) => {
  try {
    const user = await ProductsModel.findById(req.params.productId)
    if (user) {
      res.send(user)
    } else {
      next(createError(404, `User with id ${req.params.productId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

productsRouter.put("/:productId", async (req, res, next) => {
  try {
    const updatedUser = await ProductsModel.findByIdAndUpdate(req.params.productId, req.body, { new: true, runValidators: true })
    if (updatedUser) {
      res.send(updatedUser)
    } else {
      next(createError(404, `User with id ${req.params.productId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

productsRouter.delete("/:productId", async (req, res, next) => {
  try {
    const deletedUser = await ProductsModel.findByIdAndUpdate(req.params.productId)
    if (deletedUser) {
      res.status(204).send()
    } else {
      next(createError(404, `User with id ${req.params.productId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

export default productsRouter
