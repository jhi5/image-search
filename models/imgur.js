module.exports = function(sequelize, DataTypes) {
	return sequelize.define('shortener', {
		url: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1, 250]
			}
		},
		shortUrl: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: false
		}
	});
};

//the model defines the database parameters