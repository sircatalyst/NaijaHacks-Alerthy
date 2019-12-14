module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      first_name: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      last_name: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      gender: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      reset_password: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      phone: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      is_admin: {
        type: DataTypes.INTEGER(11),
        allowNull: true
      },
      is_verified: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      avatar: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      password_expire: {
        type: DataTypes.BIGINT(11),
        allowNull: true
      }
    },
    {
      tableName: 'Users'
    }
  );
};
