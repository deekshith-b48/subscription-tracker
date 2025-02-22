import { Router } from "express";

// Create an instance of the Express Router
const workflowRouter = Router();

/**
 * GET / (Root Route)
 * Description: A simple health check or status endpoint.
 */
workflowRouter.get('/', (req, res) => {
    try {
        // Respond with a success message or status
        res.status(200).json({
            status: "success",
            message: "Workflow service is running.",
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        // Handle unexpected errors
        console.error("Error in GET / route:", error.message);
        res.status(500).json({
            status: "error",
            message: "An unexpected error occurred."
        });
    }
});

/**
 * Example: Additional Routes for Workflow Management
 */

// Route to trigger a specific workflow
workflowRouter.post('/trigger/:workflowId', async (req, res) => {
    try {
        const { workflowId } = req.params;

        if (!workflowId) {
            return res.status(400).json({
                status: "error",
                message: "Missing workflow ID."
            });
        }

        // Simulate triggering a workflow (replace with actual logic)
        console.log(`Triggering workflow with ID: ${workflowId}`);
        res.status(200).json({
            status: "success",
            message: `Workflow ${workflowId} triggered successfully.`,
            workflowId
        });
    } catch (error) {
        console.error("Error in POST /trigger/:workflowId route:", error.message);
        res.status(500).json({
            status: "error",
            message: "Failed to trigger workflow."
        });
    }
});

// Export the router
export default workflowRouter;