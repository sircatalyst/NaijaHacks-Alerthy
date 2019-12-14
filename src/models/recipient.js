module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'Recipient',
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      recipient_phone: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      recipient_email: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      first_name: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      last_name: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      user_id: {
        type: DataTypes.INTEGER(11),
        references: {
          model: 'users',
          key: 'id'
        }
      }
    },
    {
      tableName: 'Recipients'
    }
  );
};
