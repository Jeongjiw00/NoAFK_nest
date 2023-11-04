import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ProjectsService } from 'src/projects/projects.service';

@Controller('/api/likes')
export class LikesController {
  constructor(
    private readonly likeService: LikesService,
    private readonly projectService: ProjectsService,
  ) {}

  @Get('/:projectId')
  async loadLikes(@Param('projectId') projectId: number) {
    const project = await this.projectService.existProject(projectId);

    if (!project) {
      throw new NotFoundException('게시글이 존재하지 않습니다.');
    }

    return await this.likeService.loadLikes(projectId);
  }

  @UseGuards(AuthGuard)
  @Post('/:projectId')
  async likeUpDown(
    @Param('projectId') projectId: number,
    @Req() req,
    @Res() res,
  ) {
    const { isLoggedIn, userId } = req.auth;

    if (!isLoggedIn) {
      throw new UnauthorizedException('로그인 중이 아닙니다.');
    }

    const project = await this.projectService.existProject(projectId);

    if (!project) {
      throw new NotFoundException('게시글이 존재하지 않습니다.');
    }

    await this.likeService.likeUpDown(projectId, userId);

    return res.send();
  }
}
