import { IsString, IsUUID, IsEnum, IsOptional } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(['TODO', 'IN_PROGRESS', 'DONE'])
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';

  @IsOptional()
  @IsUUID()
  assignedUserId?: string;
}
