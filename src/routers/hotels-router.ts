import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getHotels, getHotelById } from "@/controllers";

const hotelsRouter = Router();

hotelsRouter
  .all("/*", authenticateToken)
  .get("/", getHotels)
  .get("/:hotelId", getHotelById)

export { hotelsRouter };