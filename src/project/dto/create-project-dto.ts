import { IsString, IsUUID, IsEnum } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsEnum(['PLANNED', 'ONGOING', 'COMPLETED'])
  status: 'PLANNED' | 'ONGOING' | 'COMPLETED';

  @IsUUID()
  userId: string; // ID of the user creating the project
}
