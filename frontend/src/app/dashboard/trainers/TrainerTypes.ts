// app/trainers/TrainerTypes.ts
export interface Trainer {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    dp_link?: string;
    state: string;
    zip: string;
    created_at: string;
    gym_id: number;
  }
  