import { CourseType } from "@/_types/course";

interface AlreadyPurchasedProps {
  course: CourseType;
}

export default function AlreadyPurchased({ course }: AlreadyPurchasedProps) {
  return <div>You already purchased {course.title}</div>;
}
