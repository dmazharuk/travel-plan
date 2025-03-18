export type AlertType = {
  id: number;
  message: string;
  status: 'success' | 'mistake' | 'message';
};

export type AlertTypeData = {
  message: string;
  status: 'success' | 'mistake' | 'message';
};
