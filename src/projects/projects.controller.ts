import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('/api/projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @UseGuards(AuthGuard)
  @Post('/')
  async createProject(@Req() req, @Body() projectInfo: CreateProjectDto) {
    const { isLoggedIn, userId } = req.auth;

    // 이미 로그아웃 상태라면 불가능한 기능
    if (!isLoggedIn) {
      throw new UnauthorizedException('로그인 중이 아닙니다.');
    }
    return await this.projectsService.createProject(userId, projectInfo);
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

  @UseGuards(AuthGuard)
  @Delete('/:projectId')
  async deleteProject(
    @Param('projectId') projectId: number,
    @Req() req,
    @Res() res,
  ) {
    const { isLoggedIn, userId } = req.auth;

    if (!isLoggedIn) {
      throw new UnauthorizedException('로그인 중이 아닙니다.');
    }

    const userIdByProject = await this.projectsService.getUserIdById(projectId);

    if (userIdByProject !== userId) {
      throw new UnauthorizedException('작성자가 아닙니다.');
    }

    await this.projectsService.deleteProject(projectId);

    return res.send();
  }

  @UseGuards(AuthGuard)
  @Patch('/:projectId')
  async updateProject(
    @Param('projectId') projectId: number,
    @Body() updateInfo: UpdateProjectDto,
    @Req() req,
    @Res() res,
  ) {
    const { isLoggedIn, userId } = req.auth;

    if (!isLoggedIn) {
      throw new UnauthorizedException('로그인 중이 아닙니다.');
    }

    const userIdByProject = await this.projectsService.getUserIdById(projectId);

    if (userIdByProject !== userId) {
      throw new UnauthorizedException('작성자가 아닙니다.');
    }

    await this.projectsService.updateProject(projectId, updateInfo);

    return res.send();
  }
}
