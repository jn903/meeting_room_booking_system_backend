import { PartialType } from '@nestjs/mapped-types';
// import { CreateUserDto } from './create-user.dto.js';
import { RegisterUserDto } from './register-user.dto.js';

export class UpdateUserDto extends PartialType(RegisterUserDto) {
    headPic: string;
}
