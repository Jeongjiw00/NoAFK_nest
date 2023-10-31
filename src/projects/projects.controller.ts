import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Projects } from 'src/entities/projects.entity';
import { title } from 'process';

@Controller('/api/projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

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
}
