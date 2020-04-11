// Requiring bcrypt for password hashing. Using the bcryptjs version as the regular bcrypt module sometimes causes errors on Windows machines
var bcrypt = require("bcryptjs");
// Creating our User model
module.exports = function(sequelize, DataTypes) {
  console.log("creating")
  var User = sequelize.define("User", {
    // The email cannot be null, and must be a proper email before creation
    user_name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    // The password cannot be null
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6, 12]
      }
    },
    user_dob: {
      type: DataTypes.DATE,
      // allowNull: false,
      default: "1999-01-01",
    },
    user_location: {
      type: DataTypes.STRING,
    },
    user_drinks: {
      type: DataTypes.STRING,
    },
    user_liked_drinks: {
      type: DataTypes.STRING,
    },
    user_disliked_drinks: {
      type: DataTypes.STRING,
    },
  });
  // Creating a custom method for our User model. This will check if an unhashed password entered by the user can be compared to the hashed password stored in our database
  User.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };
  // Hooks are automatic methods that run during various phases of the User Model lifecycle
  // In this case, before a User is created, we will automatically hash their password
  User.addHook("beforeCreate", function(user) {
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
  });
  return User;
};
