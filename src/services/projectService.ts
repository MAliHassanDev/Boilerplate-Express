class ProjectService {
  public getInfo = () => {
    const projectInfo = {
      name: "Express-Boilerplate",
      description:
        "A TypeScript-based Express API template featuring setup with Jest for testing, MongoDB and Mongoose for data management, and ESLint for code quality and  GitHub Actions CI/CD pipeline for automated testing and deployment workflows.",
      technologies: [
        "express",
        "jest",
        "mongoose",
        "typescript",
        "eslint",
        "github-actions",
      ],
      responseType: "json",
      responseFormat: {
        status: "success | fail | error",
        code: "NOT_FOUND | BAD_REQUEST | CREATED | OK ...",
        message: "string",
        data: "any | null",
      },
    };
    return projectInfo;
  };
}

export default new ProjectService();
