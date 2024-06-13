import mongoose from 'mongoose'


const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },

  role: {
    type: String,
    default: 'reader' },


  
},
{
  timeStamps: true
}
);




const User = mongoose.model('User',userSchema)
export default User