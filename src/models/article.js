import { Model, DataTypes } from 'sequelize';

class Article extends Model {
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
                title: {
                    type: DataTypes.STRING,
                    allowNull: true,
                    field: 'title'
                },
                url: {
                    type: DataTypes.STRING,
                    allowNull: true,
                    field: 'url'
                },
                paragraphs: {
                    type: DataTypes.JSONB,
                    allowNull: true,
                    field: 'paragraphs'
                }
            },
            { sequelize }
        );
    }

    static associate(models) {
        models.Article.hasMany(models.Suggestion, { onDelete: 'cascade' });
    }
}

export default Article;
