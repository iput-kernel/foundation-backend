import { Router } from "express";
import httpStatus from "http-status";

const healthRoute = Router();

// health check
healthRoute.get("/", async (req, res) => {
    return res.status(httpStatus.OK).json("health check ok");
});

export default healthRoute;
