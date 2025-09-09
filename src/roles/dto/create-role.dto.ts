import {IsString, MaxLength} from 'class-validator'

export class CreateRoleDto {
  @IsString({message:'el rol debe de ser una cadena de texto'})
  @MaxLength(15,{message:'no debe de superar los 15 caracteres'})
  nombre_rol:string;
}