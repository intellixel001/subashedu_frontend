export interface ExamType {
  _id?: string;
  name: string;
  description?: string;
  billingType: "free" | "paid";
  class: number;
  subject: number;
  duration: number;
  mcq?: string[];
  isLive?: boolean;
  status?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
