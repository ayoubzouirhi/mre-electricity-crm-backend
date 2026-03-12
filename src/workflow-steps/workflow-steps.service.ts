import {
  Injectable,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { CreateWorkflowStepInput } from './dto/create-workflow-step.input';
import { UpdateWorkflowStepInput } from './dto/update-workflow-step.input';
import { GqlAuthGuard } from 'src/auth/guard/gql-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WorkflowStepsService {
  constructor(private prisma: PrismaService) {}
  async create(
    createWorkflowStepInput: CreateWorkflowStepInput,
    envId: number,
  ) {
    const envIdExist =
      await this.prisma.environment.findUnique({
        where: { id: envId },
      });
    if (!envIdExist) {
      throw new NotFoundException(
        `Environment ID: ${envId} does not exist`,
      );
    }
    const stepNameExist =
      await this.prisma.workflowStep.findFirst({
        where: {
          name: createWorkflowStepInput.name,
          environmentId: envId,
        },
      });
    if (stepNameExist) {
      throw new NotFoundException(
        `Workflow Step Name: ${createWorkflowStepInput.name} already exist `,
      );
    }
    return await this.prisma.workflowStep.create({
      data: {
        ...createWorkflowStepInput,
        environmentId: envId,
      },
    });
  }

  async findAll(envId: number) {
    const envIdExist =
      await this.prisma.environment.findUnique({
        where: { id: envId },
      });
    if (!envIdExist) {
      throw new NotFoundException(
        `Environment ID: ${envId} does not exist`,
      );
    }
    return this.prisma.workflowStep.findMany({
      where: {
        environmentId: envId,
      },
    });
  }

  async findOne(stepId: number, envId?: number) {
    const envIdExist =
      await this.prisma.environment.findUnique({
        where: { id: envId },
      });
    if (!envIdExist) {
      throw new NotFoundException(
        `Environment ID: ${envId} does not exist`,
      );
    }
    const stepIdExist =
      await this.prisma.workflowStep.findFirst({
        where: {
          id: stepId,
          ...(envId !== undefined && {
            environmentId: envId,
          }),
        },
      });
    if (!stepIdExist) {
      throw new NotFoundException(
        `Workflow Step ID: ${stepId} does not exist in Environment ID: ${envId} or does not exist at all `,
      );
    }
    return stepIdExist;
  }

  async update(
    updateWorkflowStepInput: UpdateWorkflowStepInput,
    stepId: number,
    envId: number,
  ) {
    const envIdExist =
      await this.prisma.environment.findUnique({
        where: { id: envId },
      });
    if (!envIdExist) {
      throw new NotFoundException(
        `Environment ID: ${envId} does not exist`,
      );
    }
    const stepIdExist =
      await this.prisma.workflowStep.findUnique({
        where: {
          id: stepId,
        },
      });
    if (!stepIdExist) {
      throw new NotFoundException(
        `Workflow Step ID: ${stepId} does not exist `,
      );
    }
    const stepNameExist =
      await this.prisma.workflowStep.findFirst({
        where: {
          name: updateWorkflowStepInput.name,
          environmentId: envId,
        },
      });
    if (
      stepNameExist &&
      stepNameExist?.id !== stepId
    ) {
      throw new NotFoundException(
        `Workflow Step Name: ${updateWorkflowStepInput.name} already exist `,
      );
    }

    return await this.prisma.workflowStep.update({
      where: {
        id: stepId,
      },
      data: {
        ...updateWorkflowStepInput,
      },
    });
  }

  async remove(
    removeStep: number,
    envId: number,
  ) {
    const envIdExist =
      await this.prisma.environment.findUnique({
        where: { id: envId },
      });
    if (!envIdExist) {
      throw new NotFoundException(
        `Environment ID: ${envId} does not exist`,
      );
    }
    const stepIdExist =
      await this.prisma.workflowStep.findUnique({
        where: {
          id: removeStep,
        },
      });
    if (!stepIdExist) {
      throw new NotFoundException(
        `Workflow Step ID: ${removeStep} does not exist `,
      );
    }
    return await this.prisma.workflowStep.delete({
      where: {
        id: removeStep,
      },
    });
    
  }
}
