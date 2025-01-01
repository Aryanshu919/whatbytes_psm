import { IsOptional, IsString, IsUUID, IsEnum } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['TODO', 'IN_PROGRESS', 'DONE'])
  status?: 'TODO' | 'IN_PROGRESS' | 'DONE';

  @IsOptional()
  @IsUUID()
  assignedUserId?: string;
}
