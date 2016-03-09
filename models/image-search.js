module.exports = function(sequelize, DataTypes) {
	return sequelize.define('image-search', {
		searchString: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1, 250]
			}
		}		
	});
};

//the model defines the database parameters