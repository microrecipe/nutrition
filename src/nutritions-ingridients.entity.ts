import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Nutrition } from './nutrition.entity';

@Entity('nutritions_ingridients')
export class NutritionIngridient {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    name: 'per_gram',
    type: 'varchar',
    nullable: true,
  })
  perGram: string;

  @Column({
    name: 'ingridient_id',
    type: 'int',
    nullable: true,
  })
  ingridientId: number;

  @ManyToOne(() => Nutrition, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ referencedColumnName: 'id', name: 'nutrition_id' })
  nutrition: Nutrition;
}
