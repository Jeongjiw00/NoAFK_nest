import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { ProjectsService } from 'src/projects/projects.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('/api/comments')
export class CommentsController {
  constructor(
    private commentService: CommentsService,
    private readonly projectService: ProjectsService,
  ) {}

  // 프로젝트 별 댓글 불러오기
  @Get('/:projectId')
  async getComments(@Param('projectId') projectId: number) {
    const project = await this.projectService.existProject(projectId);

    if (!project) {
      throw new NotFoundException('게시글이 존재하지 않습니다.');
    }

    return await this.commentService.getComments(projectId);
  }

  @UseGuards(AuthGuard)
  @Post('/:projectId')
  async createComment(
    @Param('projectId') projectId: number,
    @Body() commentInfo: CreateCommentDto,
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

    await this.commentService.createComment(
      projectId,
      userId,
      commentInfo.comment,
    );

    return res.send();
  }

  @UseGuards(AuthGuard)
  @Delete('/:projectId/:commentId')
  async deleteComment(
    @Param('projectId') projectId: number,
    @Param('commentId') commentId: number,
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

    const userIdByComment = await this.commentService.getUserIdById(commentId);

    if (userIdByComment !== userId) {
      throw new UnauthorizedException('작성자가 아닙니다.');
    }

    await this.commentService.deleteComment(commentId);

    return res.send();
  }

  @UseGuards(AuthGuard)
  @Patch('/:projectId/:commentId')
  async updateProject(
    @Param('projectId') projectId: number,
    @Param('commentId') commentId: number,
    @Body() updateInfo: CreateCommentDto,
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

    const userIdByComment = await this.commentService.getUserIdById(commentId);

    if (userIdByComment !== userId) {
      throw new UnauthorizedException('작성자가 아닙니다.');
    }

    await this.commentService.updateComment(commentId, updateInfo);

    return res.send();
  }
}
