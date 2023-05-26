export type ICreateUsersBody = {
  username: string;
  email: string;
  password: string;
  voted_polls: number[];
};

export type ICreatePollsBody = {
  poll_id: number;
  title: string;
  topic: number;
  description: string;
  created_by: number;
  is_permanent: boolean;
  duration: number;
  is_active: boolean;
  allow_multiple: boolean;
  options: string[];
};

export type ICreateTopicsBody = {
  topic_id: number;
  topic_name: string;
};

export type ICreatePollOptionsBody = {
  poll_option_id: number;
  option_name: string;
  poll: number;
};
