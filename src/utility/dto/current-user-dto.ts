import {
  IsString,
  IsEmail,
  IsUUID,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class CurrentUserDTO {
  @IsOptional()
  @IsUUID()
  id: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsDateString()
  createdAt: string;
}
