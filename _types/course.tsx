import { Lesson } from "@/app/admin/components/CourseTable";

interface Instructor {
  _id: string;
  name: string;
  bio: string;
  image: string;
}

// Course type
export interface CourseType {
  _id: string;
  id?: string;
  title: string;
  description?: string;
  short_description?: string;
  subjects: string[];
  thumbnailUrl: string;
  tags: string[];
  price: number;
  offer_price: number;
  instructors: Instructor[];
  type?: string;
  studentsEnrolled: number;
  courseFor: string;
  classes: any[];
  materials: any[];
  lessons: Lesson[];
  createdAt: string;
  updatedAt: string;
  __v: number;

  enrollmentId?: string; // maps to _id in enrollment
  userid?: string;
  tranjectionid?: string;
  enrollmentType?: "paid" | "free";
  paymentMethod?: string;
  status?: "approved" | "pending" | "rejected";
  enrollcourse?: any[];
  enrollmentCreatedAt?: string;
  enrollmentUpdatedAt?: string;
  enrollmentVersion?: number;
}
