// a lot of layers starting from this index
// ask agent for a broader map of this fullstack project
const app = require("./src/app");
const logger = require("./src/utils/logger");

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	logger.info(`Server running on port ${PORT}`);
});
