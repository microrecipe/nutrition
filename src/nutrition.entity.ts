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
}
