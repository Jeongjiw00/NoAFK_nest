import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Res,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Controller('/api/projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Post('/')
  async createProject(@Body() projectInfo: CreateProjectDto) {
    //<todo> 로그인 후 user_id값 넘겨주도록
    return await this.projectsService.createProject(projectInfo);
  }

  @Get('/')
  async getAllProjects() {
    const projects = await this.projectsService.getAllProjects();

    return projects.map((project) => ({
      projectId: project.projectId,
      title: project.title,
      view: project.view,
      status: project.status,
      createdAt: project.createdAt,
      nickname: project.Users.nickname,
      likes: project.Likes.length,
    }));
  }

  @Get('/:projectId')
  async getProjectById(@Param('projectId', ParseIntPipe) projectId: number) {
    const project = await this.projectsService.getProjectById(projectId);

    return {
      projectId: project.projectId,
      title: project.title,
      content: project.content,
      view: project.view,
      status: project.status,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      nickname: project.Users.nickname,
      likes: project.Likes.length,
    };
  }

  @Delete('/:projectId')
  async deleteProject(@Param('projectId') projectId: number, @Res() res) {
    await this.projectsService.deleteProject(projectId);

    return res.send();
  }
}
