import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Nutrition } from './nutrition.entity';

@Entity('nutritions_ingredients')
export class NutritionIngredient {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    name: 'per_gram',
    type: 'varchar',
    nullable: true,
  })
  perGram: string;

  @Column({
    name: 'ingredient_id',
    type: 'int',
    nullable: true,
  })
  ingredientId: number;

  @ManyToOne(() => Nutrition, {
    nullable: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ referencedColumnName: 'id', name: 'nutrition_id' })
  nutrition: Nutrition;

  @CreateDateColumn({ name: 'created_at' })
  createAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
