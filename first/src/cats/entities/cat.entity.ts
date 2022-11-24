import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Word } from './word.entity';

@Entity() // sql table === 'cat'
export class Cat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  stupid: boolean;

  @Column()
  active: boolean;

  @Column({ default: 0 })
  recomendations: number;

  @JoinTable()
  @ManyToMany((type) => Word, (word) => word.cats, {
    cascade: true,
  })
  words: Word[];
}
