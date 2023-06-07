export type Topic = {
  id: number;
  created_at: string;
  updated_at: string;
  topic_name: string;
  votes: number;
};

export type TopicRouteParams = {
  topicID: string;
  topicName: string;
};

export type Poll = {
  id: number;
  title: string;
  topic: number;
  description: string;
  created_by: number;
  is_permanent: boolean;
  duration: number;
  is_active: boolean;
  allow_multiple: boolean;
  created_by_user: string;
  votes: number;
  created_at: string;
  updated_at: string;
};

export type PollRouteParams = {
  pollID: string;
};

export type PollOption = {
  Poll: number;
  id: number;
  option_name: number;
  created_at: string;
  updated_at: string;
  votes: number;
  colorClass: string;
};
