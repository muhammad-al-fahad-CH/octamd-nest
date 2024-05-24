import { Files } from 'src/types/blog';
import { AppCategory, BlogCategory } from 'src/types/category';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum StatusEnum {
  ACTIVE = 'active',
  IN_ACTIVE = 'in_active',
  SCHEDULE = 'schedule',
  DELETE = 'delete',
  IN_REVIEW = 'in_review'
}

@Entity()
export class Blog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  short_description: string;

  @Column({ type: 'jsonb', nullable: false })
  app_category: AppCategory['id'];

  @Column({ type: 'jsonb', nullable: false })
  blog_category: BlogCategory['id'];

  @Column({ type: 'jsonb', nullable: false })
  mainBanner: Files[];

  @Column({ type: 'enum', enum: StatusEnum, nullable: false })
  status: StatusEnum;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'timestamp', nullable: false })
  publishedAt: Date;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}