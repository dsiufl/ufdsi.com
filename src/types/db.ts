export interface AdminInfo {
    id: string;
    first_name: string;
    last_name: string;
    displayName: string;
    role: string;
    pictureURL: string;
    account_setup: boolean;
    email: string;
}
export interface Symposium {
    id: string;
    keynote: number;
    date: Date;
    year: number;
}

export interface Article {
    id: number;
    title: string;
    created_at: Date;
    content: string;
    summary: string;
    category: string;
    cover: string;
    featured: boolean
}

export interface Workshop {
  id: number;
  created_at: Date;
  title: string;
  speaker: string;
  datetime: Date;
  location: string;
  cover: string;
  link?: string;
  description?: string;
}

export interface Speaker {
  id: number;
  created_at: Date;
  name: string;
  affiliation: string;
  title: string;
  time: string;
  location: string;
  cover: string;
  symposium: number;
  description: string;
  affiliated_logo?: string;
  youtube?: string;
  track: string;
  category: 'keynote' | 'general' | 'industry' | 'research' | 'workshop';
  deleted?: true;
}

export interface Action {
    title: string,
    description: string,
    action: string,
    redirect: string,
}

export interface Profile {
    account_setup: any;
    email: string;
    id: string;
    first_name: string;
    last_name: string;
    role: string;
    pictureURL?: string;
    publish: boolean;
}

export enum Email {
    INVITE_EMAIL = 1,
    RESET_PASSWORD = 2
}

export interface Activity {
    id: string;
    user_id: string;
    action_type: string;
    table_name: string;
    record_id: string;
    description: string;
    created_at: Date;
    people: AdminInfo | null;
    old_data: object | null;
    new_data: object | null;

}