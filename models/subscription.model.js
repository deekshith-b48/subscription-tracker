import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,'Name is required'],
        trim: true,
        minLength: 3,
        maxLength: 100
    },
    price: {
        type: Number,
        required: [true,'Price is required'],
        min: 0
    },
    currency: { 
        type: String,
        required: [true,'Currency is required'],
        enum: ['USD', 'EUR', 'GBP'],
        trim: true,
        minLength: 3,
        maxLength: 3
    },
    frequency: {
        type: String,
        required: [true,'Frequency is required'],
        enum: ['monthly', 'quarterly', 'annually'],
        trim: true,
        minLength: 3,
        maxLength: 9
    },
    category:{
        type: String,
        required: [true,'Category is required'],
        enum: ['food', 'transport', 'housing', 'clothing', 'health', 'education', 'entertainment', 'other'],
        trim: true,
        minLength: 3,
        maxLength: 100
    },
    status:{
        type: String,
        required: [true,'Status is required'],
        enum: ['active', 'inactive'],
        trim: true,
        minLength: 3,
        maxLength: 100
    },
    startDate: {    
        type: Date,
        required: [true,'Start date is required'],
        validate: {
            validator: function(v) {
                return v instanceof Date;
            },
            message: props => `${props.value} is not a valid date!`
        }
    },
    renewalDate: {
        type: Date,
        required: [true,'Renewal date is required'],
        validate: {
            validator: function(v) {
                return v instanceof Date;
            },
            message: props => `${props.value} is not a valid date!`
        }
    },
    endDate: {
        type: Date,
        required: [true,'End date is required'],
        validate: {
            validator: function(v) {
                return v instanceof Date;
            },
            message: props => `${props.value} is not a valid date!`
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true,'User is required']
    }
}, {timestamps: true});

subscriptionSchema.pre('save', function(next) {
    if(!this.renewalDate){
        const renewalPeriods ={
            daily:1,
            weekly:7,
            monthly:30,
            yearly:365,
        };

        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate()+renewalPeriods[this.frequency]);
    }


    if(this.renewalDate < new Date()){
        this.status = 'expired';
    }

    next();
});

const Subscription = mongoose.model('Subscription',subscriptionSchema);

export default Subscription;
