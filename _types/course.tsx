interface Instructor {
  _id: string;
  name: string;
  bio: string;
  image: string;
}

// Course type
export interface CourseType {
  _id: string;
  id: string;
  title: string;
  description: string;
  short_description: string;
  subjects: string[];
  thumbnailUrl: string;
  tags: string[];
  price: number;
  offer_price: number;
  instructors: Instructor[];
  type: string;
  studentsEnrolled: number;
  courseFor: string;
  classes: any[];
  materials: any[];
  lessons: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}
