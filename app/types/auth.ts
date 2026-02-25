export interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  bio?: string;
  is_private: boolean;
}

// You can put NavbarProps here or in a separate file
export interface NavbarProps {
  onLoginClick: () => void;
  onSignUpClick: () => void;
}