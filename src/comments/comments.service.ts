import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comments } from 'src/entities/comments.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comments) private commentRepository: Repository<Comments>,
  ) {}

  // 댓글 userId 불러오기
  async getUserIdById(commentId: number): Promise<number> {
    const [comment] = await this.commentRepository.find({
      where: { commentId },
    });

    return comment.userId;
  }

  // 프로젝트 별 댓글 불러오기
  async getComments(projectId: number) {
    try {
      return await this.commentRepository.find({ where: { projectId } });
    } catch (error) {
      throw error;
    }
  }

  // 댓글 작성
  async createComment(projectId: number, userId: number, comment: string) {
    try {
      return await this.commentRepository.save({ projectId, userId, comment });
    } catch (error) {
      throw error;
    }
  }

  // 댓글 삭제
  async deleteComment(commentId: number) {
    return await this.commentRepository.delete(commentId);
  }

  // 댓글 수정
  async updateComment(commentId: number, updateInfo: CreateCommentDto) {
    return await this.commentRepository.update(commentId, { ...updateInfo });
  }
}
