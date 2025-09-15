"use client";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  Modal,
  Tooltip,
} from "@mui/material";
import { useState } from "react";
import { FaChevronDown, FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { addContent, deleteContent, deleteLesson, updateContent } from "./api";
import ContentForm from "./ContentForm";
import ContentItem from "./ContentItem";
import { Content } from "./LessonsClient";

export interface Lesson {
  _id: string;
  name: string;
  description: string;
  type: "video" | "quiz" | "note";
  requiredForNext?: boolean;
  contents?: Content[];
}

interface LessonItemProps {
  lesson: Lesson;
  index: number;
  courseId: string;
  onDelete: (index: number) => void;
  onEdit?: (index: number) => void;
  onUpdateLesson?: (updatedLesson: Lesson, index: number) => void;
  fetchLessons?: () => void;
}

export default function LessonItem({
  lesson,
  index,
  courseId,
  onEdit,
  onUpdateLesson,
  fetchLessons,
}: LessonItemProps) {
  const [openContentModal, setOpenContentModal] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | null>(null);

  const handleDeleteLesson = async () => {
    try {
      const response = await deleteLesson(courseId, lesson._id);
      if (response) {
        fetchLessons();
      } else {
        alert("Failed to delete lesson");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting lesson");
    }
  };
  const handleAddOrUpdateContent = async (content: Content) => {
    try {
      if (editingContent) {
        // Edit content using its _id
        const response = await updateContent(
          courseId,
          lesson._id,
          content._id,
          content
        );
        console.log(response);
        if (response.name) {
          const updatedContents = lesson.contents?.map((c) =>
            c._id === content._id ? content : c
          );
          onUpdateLesson?.({ ...lesson, contents: updatedContents }, index);
          setEditingContent(null);
          setOpenContentModal(false);
          fetchLessons?.();
        } else {
          alert("Failed to update content");
        }
      } else {
        // Add content
        const response = await addContent(courseId, lesson._id, content);
        console.log(response);
        if (response) {
          const updatedContents = [...(lesson.contents || []), content];
          onUpdateLesson?.({ ...lesson, contents: updatedContents }, index);
          setOpenContentModal(false);
          fetchLessons?.();
        } else {
          alert("Failed to add content");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Error saving content");
    }
  };

  const handleDeleteContent = async (contentId: string) => {
    try {
      const response = await deleteContent(courseId, lesson._id, contentId);
      if (response.success) {
        const updatedContents = lesson.contents?.filter(
          (c) => c._id !== contentId
        );
        onUpdateLesson?.({ ...lesson, contents: updatedContents }, index);
      } else {
        alert(response.message || "Failed to delete content");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting content");
    }
  };

  const handleEditContent = (content: Content) => {
    setEditingContent(content);
    setOpenContentModal(true);
  };

  return (
    <>
      <Accordion className="rounded-lg shadow-sm border mb-3">
        <AccordionSummary expandIcon={<FaChevronDown />}>
          <div className="flex flex-col">
            <h3 className="font-bold">{lesson.name}</h3>
            <p className="text-sm text-gray-600">{lesson.description}</p>
          </div>
          <div className="flex gap-2 ml-auto">
            {onEdit && (
              <Tooltip title="Edit Lesson">
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => onEdit(lesson?._id)}
                >
                  <FaEdit />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Add Content">
              <IconButton
                size="small"
                color="success"
                onClick={() => {
                  setEditingContent(null);
                  setOpenContentModal(true);
                }}
              >
                <FaPlus />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Lesson">
              <IconButton
                size="small"
                color="error"
                onClick={handleDeleteLesson}
              >
                <FaTrash />
              </IconButton>
            </Tooltip>
          </div>
        </AccordionSummary>

        <AccordionDetails>
          {lesson.contents && lesson.contents.length > 0 ? (
            lesson.contents.map((content) => (
              <ContentItem
                key={content._id}
                content={content}
                onDelete={handleDeleteContent}
                onEdit={handleEditContent}
              />
            ))
          ) : (
            <p className="text-gray-500">No contents added yet.</p>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Content Modal */}
      <Modal
        open={openContentModal}
        onClose={() => setOpenContentModal(false)}
        className="flex items-center justify-center"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
          <h2 className="text-xl font-semibold mb-4">
            {editingContent ? "Edit Content" : "Add Content"}
          </h2>
          <ContentForm
            onSuccess={handleAddOrUpdateContent}
            content={editingContent}
          />
        </div>
      </Modal>
    </>
  );
}
