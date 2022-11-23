import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('nutritions')
export class Nutrition {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    name: 'name',
    type: 'varchar',
    nullable: true,
  })
  name: string;

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
}
