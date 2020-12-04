/* Seperate script to clear/import into the database */
/* DO NOT RUN ONCE PROJECT IS UP AND RUNNING, WILL FUCK EVERYTHING. PROBABLY SHOULD DELETE THIS LATER */

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import colors from 'colors'
import users from './data/users.js'
import products from './data/products.js'
import User from './models/usermodel.js'
import Product from './models/productmodel.js'
import Order from './models/ordermodel.js'
import connectDB from './config/db.js'

dotenv.config()

connectDB()

const importData = async () => {
  try {
    /* Promise to delete database entries in our lists */
    await Order.deleteMany()
    await Product.deleteMany()
    await User.deleteMany()

    /* CreatedUsers set equal to the new list of users, admin is first list in user(based on this implementation) */
    const createdUsers = await User.insertMany(users)
    const adminUser = createdUsers[0]._id

    /* sampleProducts set equal to procuts passed in, plus a field user, set to our admin user above */
    const sampleProducts = products.map((product) => {
      return {
        ...product,
        user: adminUser,
      }
    })

    /* Insert Products with admin user field attached */
    await Product.insertMany(sampleProducts)
    console.log('Data Imported'.green.inverse)
    process.exit()
  } catch (error) {
    console.log(`${error}`.red.inverse)
    process.exit(1)
  }
}

const destroyData = async () => {
  try {
    /* Promise to delete database entries */
    await Order.deleteMany()
    await Product.deleteMany()
    await User.deleteMany()

    console.log('Data Destroyed'.red.inverse)
    process.exit()
  } catch (error) {
    console.log(`${error}`.red.inverse)
    process.exit(1)
  }
}

/* Process.argv is commandline argument, if -d flag is typed, queue datadestroy, otherwise run script with update. */
if (process.argv[2] === '-d') {
  destroyData()
} else {
  importData()
}
