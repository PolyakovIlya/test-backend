import { Model, DataTypes } from 'sequelize';

class User extends Model {
    static init(sequelize) {
        return super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false,
                    field: 'id'
                },
                username: {
                    type: DataTypes.STRING,
                    unique: true,
                    allowNull: false,
                    field: 'username'
                },
                email: {
                    type: DataTypes.STRING,
                    unique: true,
                    allowNull: false,
                    field: 'email'
                },
                password: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    field: 'password'
                },
                salt: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    field: 'salt'
                },
                isAdmin: {
                    type: DataTypes.BOOLEAN,
                    field: 'is_admin',
                    default: false
                }
            },
            { sequelize }
        );
    }
}

export default User;
