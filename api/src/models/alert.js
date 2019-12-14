module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
      'Alert',
      {
        id: {
          type: DataTypes.INTEGER(11),
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
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
        trigger_interval: {
          type: DataTypes.INTEGER(11),
          allowNull: false
        },
        trigger_job: {
          type: DataTypes.INTEGER(11),
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
