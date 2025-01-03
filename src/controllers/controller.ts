import { Request, Response } from "express";
import projectService from "../services/projectService.js";

const sendProjectInfo = (_: Request, res: Response) => {
  const projectInfo = projectService.getInfo();
  res.ok(projectInfo);
};

export default sendProjectInfo;
