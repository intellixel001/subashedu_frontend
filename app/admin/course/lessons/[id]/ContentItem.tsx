"use client";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  Tooltip,
} from "@mui/material";
import { FaChevronDown, FaEdit, FaTrash } from "react-icons/fa";
import { Content as ContentType } from "./ContentForm";

interface ContentItemProps {
  content: ContentType & { _id: string }; // Ensure _id exists
  onDelete: (contentId: string) => void;
  onEdit: (content: ContentType & { _id: string }) => void;
}

export default function ContentItem({
  content,
  onDelete,
  onEdit,
}: ContentItemProps) {
  return (
    <Accordion className="mb-2 shadow-sm border rounded">
      <AccordionSummary expandIcon={<FaChevronDown />}>
        <div className="flex flex-col">
          <span className="font-medium">{content.name}</span>
          <span className="text-sm text-gray-500">{content.type}</span>
        </div>
        <div className="flex gap-2 ml-auto">
          <Tooltip title="Edit Content">
            <IconButton
              size="small"
              color="primary"
              onClick={() => onEdit(content)}
            >
              <FaEdit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Content">
            <IconButton
              size="small"
              color="error"
              onClick={() => onDelete(content._id)}
            >
              <FaTrash />
            </IconButton>
          </Tooltip>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <p>{content.description}</p>
        {content.link && (
          <a
            href={content.link}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline"
          >
            View Link
          </a>
        )}
      </AccordionDetails>
    </Accordion>
  );
}
