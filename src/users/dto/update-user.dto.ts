// import { PartialType } from '@nestjs/mapped-types';
import { PartialType } from '@nestjs/swagger';
// import { CreateUserDto } from './create-user.dto.js';
import { RegisterUserDto } from './register-user.dto.js';

export class UpdateUserDto extends PartialType(RegisterUserDto) {
    headPic: string;
}
