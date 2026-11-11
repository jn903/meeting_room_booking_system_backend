import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class PositiveIntPipe implements PipeTransform<string, number> {
  constructor(private readonly name: string) {}

  transform(value: string): number {
    if (typeof value !== 'string' || !/^-?\d+$/.test(value.trim())) {
      throw new BadRequestException(`${this.name} 应该传数字`);
    }
    const num = parseInt(value, 10);
    if (num < 1) {
      throw new BadRequestException(`${this.name} 应该传正整数`);
    }
    return num;
  }
}

export const positiveIntPipe = (name: string) => new PositiveIntPipe(name);