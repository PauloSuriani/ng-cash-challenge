var { Model, DataTypes } = require('sequelize');
class Transaction extends Model {
	static init(sequelize: any) {
		super.init({
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				allowNull: false,
				autoIncrement: true,
			},
			debitedAccountId: {
				type: DataTypes.INTEGER,
				foreignKey: true,
			},
			creditedAccountId: {
				type: DataTypes.INTEGER,
				foreignKey: true,
			},
			value: DataTypes.DECIMAL
		}, {
			sequelize,
			timestamps: true,
			tableName: 'transactions',
		});
		Transaction.associate = (models: any) => {
			Transaction.belongsTo(models.Account, { foreignKey: "id" });
		};
	}
}

module.exports = Transaction;