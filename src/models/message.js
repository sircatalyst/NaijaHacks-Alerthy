module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
      'Message',
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
        subject: {
          type: DataTypes.STRING(255),
          allowNull: false
        },
        is_main: {
          type: DataTypes.INTEGER(11),
          allowNull: false
        },
        // user_id: {
        //   type: DataTypes.INTEGER(11),
        //   references: {
        //     model: 'users',
        //     key: 'id'
        //   }
        // }
      },
      {
        tableName: 'Messages'
      }
    );
  };
  