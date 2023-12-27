// Define All Data Models Here

// composite types 😇
type matchTypes = 'request' | 'swipe' | 'auto' | 'scan';
type statusTypes = 'pending' | 'active' | 'inactive';
type gendaTypes = 'male' | 'female';
type genTypes = 'Z' | 'X' | 'Millenial';
type colorTypes =
  | 'dark-skin'
  | 'light-skin'
  | 'chocalate-skin'
  | 'brownish'
  | 'black-beauty';
type badHabitTypes = 'smoking' | 'drinking' | 'betting';
type audioRoomTypes = 'hot-seat' | 'help-session' | 'open-session';
type sizeTypes = 'portable' | 'medium' | 'big';
type heightTypes = 'short' | 'medium' | 'tall';
type personalityTypes = 'introvert' | 'extrovert' | 'nuetral';

interface PollOption {
  id: number;
  user_id: number;
  option_votes: number;
  option_type: string; // A,B,C,D
}

export interface User {
  id: number;
  user_name: string;
  user_email: string;
  user_password: string;
}

export interface UserProfile {
  id: number;
  user_id: number; // User
  user_name: string;
  user_email: string;
  user_contact: string;
  user_avatar: string;
  hiv_status: string;
  clan: string;
  genda: gendaTypes;
  age: number;
  children: number;
  bad_habits: badHabitTypes;
  color: colorTypes;
  generation: genTypes;
  education: string;
  religion: string;
  size: sizeTypes;
  height: heightTypes;
  personality: personalityTypes;
  occupation: string;
  zodiac_sign: string; //  horoscope zodiac signs
  hobby1: string;
  hobby2: string;
  hobby3: string;
  hobby4: string;
}

export interface Post {
  id: number;
  user_id: number;
  is_draft: boolean;
  text: string;
}

export interface PostReply {
  id: number;
  user_id: number;
  post_id: number;
  reply_text: string;
}

export interface UserReply {
  id: number;
  user_id: number;
  reply_id: number; // PostReply
  user_reply_text: string;
}

export interface Match {
  id: number;
  first_user_id: number;
  second_user_id: number;
  match_type: matchTypes;
}
export interface MatchRequest {
  id: number;
  requesting_user_id: number;
  responding_user_id: number;
  request_status: statusTypes;
  match_type: matchTypes;
}

export interface Chat {
  id: number;
  receiver_id: number;
  sender_id: number;
  chat_text: string;
  chat_image_url: string;
  chat_audio_url: string;
  chat_video_url: string;
}

export interface AudioRoom {
  id: number;
  category: audioRoomTypes;
  user_id: number;
  host_id: number;
  user_text: string;
  user_audio_url: string;
}

// todo: some more work is needed on poll options
export interface Poll {
  id: number;
  user_id: number;
  poll_status: boolean;
  poll_question: string;
  poll_option_A: PollOption;
  poll_option_B: PollOption;
  poll_option_C: PollOption;
  poll_option_D: PollOption;
}

export interface Subscription {
  id: string;
  token: string;
  plan: string;
  is_active: boolean;
  started: string; // should be time stamp
  ends: string; // should also be a timestamp
}

export interface Payment {
  id: string;
  user_id: number;
  payment_mode: string;
  status: string;
}
