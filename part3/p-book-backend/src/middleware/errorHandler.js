// global error handling
const errorHandler = (error, _request, response, _next) => {
	// console.error("Full error:", error);
	console.error(error.message);

	// pg unique constraint violation (duplicate name)
	if (error.code === "23505") {
		return response.status(400).json({ error: "name must be unique" });
	}
	// pg not-null constraint violation
	if (error.code === "23502") {
		return response.status(400).json({ error: "missing required field" });
	}
	// pg invalid data format
	if (error.code === "22P02") {
		return response.status(400).json({ error: "invalid data format" });
	}
	// Connection failure
	if (error.code === "08006") {
		return response.status(503).json({ error: "database unavailable" });
	}
	// check_violation
	if (error.code === "23514") {
		return response.status(400).json({ error: "phone number format invalid" });
	}
	// Default: 500 internal server error
	response.status(500).json({ error: "internal server error" });
};

module.exports = errorHandler;
