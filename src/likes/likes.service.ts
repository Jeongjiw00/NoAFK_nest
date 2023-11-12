import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Likes } from '../../src/entities/likes.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Likes) private likeRepository: Repository<Likes>,
  ) {}

  // 프로젝트 별 좋아요 수 보기
  async getLikes(projectId: number) {
    try {
      return await this.likeRepository.count({ where: { projectId } });
    } catch (error) {
      throw error;
    }
  }

  // 좋아요 하기 & 취소
  async likeUpDown(projectId: number, userId: number) {
    try {
      const alreadyLike = await this.likeRepository.findOne({
        where: { projectId, userId },
      });

      if (alreadyLike) {
        return await this.likeRepository.delete({ projectId, userId });
      }

      return await this.likeRepository.save({ projectId, userId });
    } catch (error) {
      throw error;
    }
  }
}
