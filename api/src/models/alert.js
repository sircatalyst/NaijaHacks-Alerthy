export default (sequelize, DataTypes) => {
  return sequelize.define(
    'Alert',
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      message: {
        type: DataTypes.TEXT(),
        allowNull: false
      },
      recipient_phone: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      recipient_email: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      subject: {
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
      test_send: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      location: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      trigger_time: {
        type: DataTypes.STRING(255),
        allowNull: true
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
      tableName: 'Alerts'
    }
  );
};
