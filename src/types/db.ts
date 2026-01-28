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
    id: number,
    keynote: number,
    date: Date,
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