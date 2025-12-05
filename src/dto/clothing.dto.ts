import { IsString, IsOptional } from 'class-validator';

export class CreateClothingDto {
    @IsString()
    brand: string;

    @IsOptional()
    @IsString()
    size?: string;

    @IsOptional()
    @IsString()
    material?: string;
}
