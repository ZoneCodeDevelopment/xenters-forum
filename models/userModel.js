const userSchema = ({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    invite: {
        type: String,
        required: true
    }

})

module.exports = userSchema