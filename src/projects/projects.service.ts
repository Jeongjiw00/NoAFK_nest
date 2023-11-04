import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Projects } from 'src/entities/projects.entity';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Projects)
    private projectRepository: Repository<Projects>,
  ) {}

  async createProject(userId: number, projectInfo: CreateProjectDto) {
    return await this.projectRepository.save({ userId, ...projectInfo });
  }

  async getAllProjects(): Promise<Projects[]> {
    return await this.projectRepository.find({
      select: ['projectId', 'title', 'view', 'status', 'createdAt'],
      relations: ['Users', 'Likes'],
    });
  }

  async existProject(projectId: number): Promise<boolean> {
    return await this.projectRepository.exist({
      where: { projectId },
    });
  }

  async getUserIdById(projectId: number): Promise<number> {
    const [project] = await this.projectRepository.find({
      where: { projectId },
    });

    return project.userId;
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

  async deleteProject(projectId: number) {
    return await this.projectRepository.delete(projectId);
  }

  async updateProject(projectId: number, updateInfo: UpdateProjectDto) {
    return await this.projectRepository.update(projectId, { ...updateInfo });
  }
}
