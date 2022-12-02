import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
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
}
