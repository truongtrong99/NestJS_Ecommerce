import { IsString, IsOptional } from 'class-validator';

export class CreateElectronicDto {
    @IsString()
    manufacturer: string;

    @IsOptional()
    @IsString()
    model?: string;

    @IsOptional()
    @IsString()
    color?: string;
}
