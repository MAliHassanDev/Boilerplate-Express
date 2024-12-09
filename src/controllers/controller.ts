import { Request, Response } from "express";
import apiResponse from "../utils/apiResponse.js";
import projectService from "../services/projectService.js";

const sendProjectInfo = (_: Request, res: Response) => {
  const projectInfo = projectService.getInfo();
  apiResponse.ok(res, projectInfo);
};

export default sendProjectInfo;
