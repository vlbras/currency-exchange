import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('currencies')
export class Currency {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ unique: true})
  name: string;
}
