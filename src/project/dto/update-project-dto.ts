import { IsOptional, IsString, IsUUID, IsEnum } from 'class-validator';

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['PLANNED', 'ONGOING', 'COMPLETED'])
  status?: 'PLANNED' | 'ONGOING' | 'COMPLETED';

  @IsOptional()
  @IsUUID()
  userId?: string; // Optional if the user associated with the project might change
}
