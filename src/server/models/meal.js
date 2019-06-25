import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  calories_count: {
    type: Number,
    required: true,
  },
  date: {         //timestamp
    type: Number,
    required: true,
  },
}, {
  toObject: {virtuals: true},
});


mongoose.model('Meal', mealSchema);

