import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const mealSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  calories_count: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
}, {
  toObject: {virtuals: true},
});

mealSchema.plugin(mongoosePaginate);

mongoose.model('Meal', mealSchema);

