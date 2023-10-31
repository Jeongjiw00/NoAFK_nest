import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Projects } from 'src/entities/projects.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Projects)
    private projectRepository: Repository<Projects>,
  ) {}

  async getAllProjects(): Promise<Projects[]> {
    return await this.projectRepository.find({
      select: ['projectId', 'title', 'view', 'status', 'createdAt'],
      relations: ['Users', 'Likes'],
    });
  }

  async getProjectById(projectId: number): Promise<Projects> {
    const project = await this.projectRepository.findOne({
      select: [
        'projectId',
        'title',
        'content',
        'view',
        'status',
        'createdAt',
        'updatedAt',
      ],
      relations: ['Users', 'Likes'],
      where: { projectId },
    });

    if (!project) {
      throw new NotFoundException('게시글이 존재하지 않습니다.');
    }

    try {
      await this.projectRepository.increment({ projectId }, 'view', 1);
      ++project.view;

      return project;
    } catch (error) {
      throw error;
    }
  }
}
