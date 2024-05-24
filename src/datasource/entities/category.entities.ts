import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BlogCategory, AppCategory } from 'src/types/category';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'jsonb', nullable: false })
  category: BlogCategory | AppCategory;
}