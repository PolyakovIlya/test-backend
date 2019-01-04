import { Model, DataTypes } from 'sequelize';

class Suggestion extends Model {
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
                text: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    field: 'text'
                },
                status: {
                    type: DataTypes.ENUM('pending', 'approved', 'declined'),
                    allowNull: true,
                    defaultValue: 'pending',
                    field: 'status'
                },
                paragraph_id: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    field: 'paragraph_id'
                }
            },
            { sequelize }
        );
    }

    static associate(models) {
        models.Suggestion.belongsTo(models.Article);
    }
}

export default Suggestion;
